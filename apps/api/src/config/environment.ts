import { z } from "zod";

const portSchema = z.coerce.number().int().min(1).max(65_535);
const positiveIntegerSchema = z.coerce.number().int().positive();

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: portSchema.default(4000),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
  DB_HOST: z.string().trim().min(1).default("127.0.0.1"),
  DB_PORT: portSchema.default(3306),
  DB_NAME: z.string().trim().min(1).default("gori"),
  DB_USER: z.string().trim().min(1).default("gori"),
  DB_PASSWORD: z.string().min(1).default("gori"),
  REDIS_HOST: z.string().trim().min(1).default("127.0.0.1"),
  REDIS_PORT: portSchema.default(6379),
  REDIS_USERNAME: z.string().trim().min(1).optional(),
  REDIS_PASSWORD: z.string().min(1).optional(),
  REDIS_LINK_TTL_SECONDS: positiveIntegerSchema.default(120),
  LINK_CREATE_RATE_LIMIT_MAX: positiveIntegerSchema.default(20),
  LINK_CREATE_RATE_LIMIT_WINDOW_SECONDS: positiveIntegerSchema.default(60),
});

export function validateEnvironment(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result = environmentSchema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`환경 변수 설정이 올바르지 않습니다: ${details}`);
  }

  return result.data;
}
