import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';
import { getEnv } from '@/env';
import { CardData } from '@/utils/cardSchema';

function getGoogle() {
  const { GOOGLE_API_KEY } = getEnv();
  return createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY });
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
  const google = getGoogle();

  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: text,
    });

    return embedding;
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
