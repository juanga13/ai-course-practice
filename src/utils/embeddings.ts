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

  console.log('[Text embedding] createTextContent:', content);
  return content;
}

export async function generateTextEmbedding(text: string): Promise<number[]> {
  const google = getGoogle();

  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: text,
    });
    console.log('[Text embedding] Generated!', embedding);
    return embedding;
  } catch (error) {
    console.error('[Text embedding] Error generating:', error);
    throw new Error('Failed to generate text embedding');
  }
}

export async function generateTextEmbeddingFromCard(
  cardData: CardData
): Promise<number[]> {
  console.log(
    '[Text embedding] Generating text embedding from card data',
    cardData
  );
  const textContent = createTextContent(cardData);
  console.log('[Text embedding] Text content', textContent);
  const result = await generateTextEmbedding(textContent);
  console.log('[Text embedding] Result', result);
  return result;
}
