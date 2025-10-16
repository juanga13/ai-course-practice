import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { put } from '@vercel/blob';
import { getEnv } from '@/env';
import { cardSchema } from '@/utils/cardSchema';
import { generateTextEmbeddingFromCard } from '@/utils/embeddings';
import { generateImageEmbedding } from '@/utils/clip';
import { storeCardInVectorDB } from '@/utils/vectorStore';

function getGoogle() {
  const { GOOGLE_API_KEY } = getEnv();
  return createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY });
}

const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    console.log('[Image analyze] file', file);

    if (!(file instanceof Blob)) {
      console.log('[Image analyze] file not a blob');
      return NextResponse.json(
        { error: 'image_not_supported', reason: 'No file provided' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_TYPES.includes(file.type)) {
      console.log('[Image analyze] file not supported', file.type);
      return NextResponse.json(
        {
          error: 'image_not_supported',
          reason: `Unsupported type: ${file.type}`,
        },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');

    const systemPrompt = `
Instructions:
- You extract structured data from an NBA PSA certified trading card image.
- Return as JSON per schema.
- If not a PSA graded NBA card, explain why.
`;

    console.log('[Image analyze] Google generate object', {
      type: file.type,
      isImage,
      systemPrompt,
    });

    const google = getGoogle();
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: cardSchema,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the card details from this card.' },
            ...(isImage
              ? [{ type: 'image' as const, image: bytes }]
              : [{ type: 'file' as const, data: bytes, mediaType: file.type }]),
          ],
        },
      ],
    });

    console.log('[Image analyze] Google generate object OK?', object);

    if (!object.playerName || object.playerName === 'N/A') {
      console.log('[Image analyze] Google generate OK? NO, missing playerName');
      return NextResponse.json(
        {
          error: 'image_not_supported',
          reason:
            'Could not identify an NBA PSA certified card or missing key fields',
        },
        { status: 400 }
      );
    }

    console.log('[Image analyze] Google generate OK? YES');

    try {
      const fileName = `cards/${object.playerName.replace(/\s+/g, '-')}-${Date.now()}.${file.type.split('/')[1]}`;
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      console.log(
        '[Image analyze] Blob generated, uploaded to Vercel Blob Storage and generating embeddings (text and image)'
      );

      const [textEmbedding, imageEmbedding] = await Promise.all([
        generateTextEmbeddingFromCard(object),
        generateImageEmbedding(blob.url),
      ]);

      const cardId = await storeCardInVectorDB(
        object,
        blob.url,
        textEmbedding,
        imageEmbedding
      );

      return NextResponse.json({
        ...object,
        cardId,
        imageUrl: blob.url,
        stored: true,
      });
    } catch (embeddingError) {
      console.error(
        'Error generating embeddings or storing in vector DB:',
        embeddingError
      );
      return NextResponse.json({
        ...object,
        stored: false,
        embeddingError:
          'Failed to generate embeddings or store in vector database',
      });
    }
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'image_not_supported', reason },
      { status: 400 }
    );
  }
}
