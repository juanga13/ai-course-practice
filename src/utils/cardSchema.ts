import { z } from "zod";

export const cardSchema = z.object({
  type: z.literal("nba_psa_card"),
  playerName: z.string().min(1),
  team: z.string().optional().default(""),
  year: z.string().optional().default(""),
  manufacturer: z.string().optional().default(""),
  setName: z.string().optional().default(""),
  cardNumber: z.string().optional().default(""),
  parallelOrVariant: z.string().optional().default(""),
  psa: z
    .object({
      grade: z.string().optional().default(""),
      certNumber: z.string().optional().default(""),
      qualifier: z.string().optional().default(""),
    })
    .partial()
    .optional()
    .default({}),
  notes: z.string().optional().default(""),
  imageInsights: z.array(z.string()).optional().default([]),
});

export type CardData = z.infer<typeof cardSchema>;

export const invalidImageSchema = z.object({
  error: z.literal("image_not_supported"),
  reason: z.string(),
});


