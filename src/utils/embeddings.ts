import OpenAI from 'openai';
import { getEnv } from '@/env';
import { CardData } from '@/utils/cardSchema';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const { OPENAI_API_KEY } = getEnv();
    openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return openaiClient;
}

export function createTextContent(cardData: CardData): string {
  const content = [
    `Player: ${cardData.playerName}`,
    `Team: ${cardData.team}`,
    `Year: ${cardData.year}`,
    `Manufacturer: ${cardData.manufacturer}`,
    `Set: ${cardData.setName}`,
    `Card Number: ${cardData.cardNumber}`,
    `Type: ${cardData.parallelOrVariant}`,
    `PSA Grade: ${cardData.psa?.grade || ''}${cardData.psa?.qualifier || ''}`,
    `Certification: ${cardData.psa?.certNumber || ''}`,
    `Notes: ${cardData.notes}`,
    `Insights: ${cardData.imageInsights?.join(', ') || ''}`,
  ]
    .filter(Boolean)
    .join(' | ');

  return content;
}

export async function generateTextEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating text embedding:', error);
    throw new Error('Failed to generate text embedding');
  }
}

export async function generateTextEmbeddingFromCard(
  cardData: CardData
): Promise<number[]> {
  const textContent = createTextContent(cardData);
  return generateTextEmbedding(textContent);
}
