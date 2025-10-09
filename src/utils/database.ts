import { Pinecone } from '@pinecone-database/pinecone';
import { getEnv } from '@/env';

let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const { PINECONE_API_KEY } = getEnv();
    pineconeClient = new Pinecone({ apiKey: PINECONE_API_KEY });
  }
  return pineconeClient;
}

export async function ensureIndexExists(indexName: string, dimension: number) {
  const pinecone = getPineconeClient();

  try {
    await pinecone.describeIndex(indexName);
  } catch {
    console.log(`Creating index: ${indexName}`);
    await pinecone.createIndex({
      name: indexName,
      dimension,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });

    // Wait for index to be ready
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

export const PINECONE_INDEX_NAME = 'psa-cards-rag';
export const TEXT_EMBEDDING_DIMENSION = 768; // Google text-embedding-004
export const IMAGE_EMBEDDING_DIMENSION = 512; // CLIP ViT-B/32
