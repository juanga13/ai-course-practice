import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1, 'Missing GOOGLE_API_KEY'),
  PINECONE_API_KEY: z.string().min(1, 'Missing PINECONE_API_KEY'),
  BLOB_READ_WRITE_TOKEN: z.string().optional().default(''),
});

export function getEnv() {
  return envSchema.parse({
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
