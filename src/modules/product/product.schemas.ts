import { z } from "zod";

export const createProductSchema = z.object({
  sourceUrl: z.string().url(),
  title: z.string().trim().min(1).max(160),
  brand: z.string().trim().max(100).optional(),
  imageUrl: z.string().url().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().trim().length(3).toUpperCase().optional()
});

export const parseProductSchema = z.object({
  url: z.string().trim().url()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ParseProductInput = z.infer<typeof parseProductSchema>;
