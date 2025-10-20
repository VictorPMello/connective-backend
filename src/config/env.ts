import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
