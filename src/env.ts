import { z } from "zod";

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1, "Missing GOOGLE_API_KEY"),
});

export function getEnv() {
  return envSchema.parse({
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  });
}


