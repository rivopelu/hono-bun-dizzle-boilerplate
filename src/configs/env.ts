import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(8888),
  APP_ENV: z.enum(['dev', 'staging', 'production']).default('dev'),
  APP_NAME: z.string().default('hono-boilerplate'),
  API_PREFIX: z.string().default('/api'),
  LOG_LEVEL: z.string().default('debug'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('reel_cut'),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  JWT_ISSUER: z.string().default('reel-cut'),
})

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('Invalid environment variables:')
    console.error(parsed.error.issues)
    process.exit(1)
  }
  return parsed.data
}

export const env = validateEnv()
