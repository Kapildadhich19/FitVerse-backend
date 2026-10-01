import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_COOKIE_NAME: z
    .string()
    .min(1)
    .default('fitverse_refresh_token'),
  PRODUCT_PARSE_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:3000'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8001'),
  AI_SERVICE_TOKEN: z.string().min(32).optional(),
  AI_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(120000),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
