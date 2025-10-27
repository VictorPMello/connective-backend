import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),

  NODE_ENV: z.string(),

  CORS_ORIGIN: z.string(),
});

export const env = envSchema.parse(process.env);
