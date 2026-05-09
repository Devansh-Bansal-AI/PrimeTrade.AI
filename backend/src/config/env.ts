import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CLIENT_URL: z.string().url().optional(),
  CLIENT_URLS: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const defaultClientUrl = "http://localhost:5173";

export const env = {
  ...parsed.data,
  CLIENT_URL: parsed.data.CLIENT_URL ?? defaultClientUrl,
  CLIENT_URLS: parsed.data.CLIENT_URLS ?? parsed.data.CLIENT_URL ?? defaultClientUrl
};
