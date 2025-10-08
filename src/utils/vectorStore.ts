import {
  getPineconeClient,
  ensureIndexExists,
  PINECONE_INDEX_NAME,
  TEXT_EMBEDDING_DIMENSION,
} from './database';
import { SearchResult } from '@/app/types';
import { CardData } from './cardSchema';

export async function storeCardInVectorDB(
  cardData: CardData,
  imageUrl: string,
  textEmbedding: number[],
  _imageEmbedding: number[]
): Promise<string> {
  const pinecone = getPineconeClient();

  // Ensure the index exists
  await ensureIndexExists(PINECONE_INDEX_NAME, TEXT_EMBEDDING_DIMENSION);

  const index = pinecone.index(PINECONE_INDEX_NAME);

  // Generate a unique ID for the card
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Prepare metadata for the vector
  const metadata = {
    cardId,
    playerName: cardData.playerName,
    team: cardData.team,
    year: cardData.year,
    manufacturer: cardData.manufacturer,
    setName: cardData.setName,
    cardNumber: cardData.cardNumber,
    parallelOrVariant: cardData.parallelOrVariant,
    grade: cardData.psa?.grade || '',
    certNumber: cardData.psa?.certNumber || '',
    qualifier: cardData.psa?.qualifier || '',
    notes: cardData.notes,
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  // Store text embedding
  await index.upsert([
    {
      id: `${cardId}_text`,
      values: textEmbedding,
      metadata: {
        ...metadata,
        embeddingType: 'text',
      },
    },
  ]);

  // Store image embedding (we'll need a separate index for this or use a different approach)
  // For now, we'll store both in the same index with different IDs

  return cardId;
}

export async function searchSimilarCards(
  query: string,
  textEmbedding: number[],
  imageEmbedding: number[],
  textWeight: number = 0.7,
  imageWeight: number = 0.3,
  limit: number = 10,
  filters?: Record<string, unknown>
): Promise<SearchResult[]> {
  const pinecone = getPineconeClient();
  const index = pinecone.index(PINECONE_INDEX_NAME);

  try {
    // Perform text similarity search
    const textResults = await index.query({
      vector: textEmbedding,
      topK: limit * 2, // Get more results to merge
      includeMetadata: true,
      filter: filters,
    });

    // Perform image similarity search (if we have image embeddings)
    let imageResults: any = { matches: [] };
    if (imageEmbedding && imageEmbedding.length > 0) {
      imageResults = await index.query({
        vector: imageEmbedding,
        topK: limit * 2,
        includeMetadata: true,
        filter: filters,
      });
    }

    // Merge and score results
    const resultMap = new Map<string, SearchResult>();

    // Process text results
    textResults.matches?.forEach(match => {
      if (match.metadata && match.id.endsWith('_text')) {
        const cardId = match.id.replace('_text', '');
        const score = match.score || 0;

        resultMap.set(cardId, {
          id: cardId,
          cardData: {
            type: 'nba_psa_card',
            playerName: match.metadata.playerName as string,
            team: match.metadata.team as string,
            year: match.metadata.year as string,
            manufacturer: match.metadata.manufacturer as string,
            setName: match.metadata.setName as string,
            cardNumber: match.metadata.cardNumber as string,
            parallelOrVariant: match.metadata.parallelOrVariant as string,
            psa: {
              grade: match.metadata.grade as string,
              certNumber: match.metadata.certNumber as string,
              qualifier: match.metadata.qualifier as string,
            },
            notes: match.metadata.notes as string,
            imageInsights: [],
          },
          imageUrl: match.metadata.imageUrl as string,
          textScore: score,
          imageScore: 0,
          combinedScore: score * textWeight,
          createdAt: match.metadata.createdAt as string,
        });
      }
    });

    // Process image results and update scores
    imageResults.matches?.forEach((match: any) => {
      if (match.metadata && match.id.endsWith('_image')) {
        const cardId = match.id.replace('_image', '');
        const score = match.score || 0;

        const existing = resultMap.get(cardId);
        if (existing) {
          existing.imageScore = score;
          existing.combinedScore =
            existing.textScore * textWeight + score * imageWeight;
        } else {
          // Add new result from image search only
          resultMap.set(cardId, {
            id: cardId,
            cardData: {
              type: 'nba_psa_card',
              playerName: match.metadata.playerName as string,
              team: match.metadata.team as string,
              year: match.metadata.year as string,
              manufacturer: match.metadata.manufacturer as string,
              setName: match.metadata.setName as string,
              cardNumber: match.metadata.cardNumber as string,
              parallelOrVariant: match.metadata.parallelOrVariant as string,
              psa: {
                grade: match.metadata.grade as string,
                certNumber: match.metadata.certNumber as string,
                qualifier: match.metadata.qualifier as string,
              },
              notes: match.metadata.notes as string,
              imageInsights: [],
            },
            imageUrl: match.metadata.imageUrl as string,
            textScore: 0,
            imageScore: score,
            combinedScore: score * imageWeight,
            createdAt: match.metadata.createdAt as string,
          });
        }
      }
    });

    // Sort by combined score and return top results
    return Array.from(resultMap.values())
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching similar cards:', error);
    throw new Error('Failed to search similar cards');
  }
}
