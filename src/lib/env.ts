import { z } from "zod";

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

/** Lazily validate and return environment variables (avoids build-time failure) */
export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse({
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _env;
}
