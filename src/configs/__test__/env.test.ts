import { describe, expect, test } from 'bun:test'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(8888),
  APP_ENV: z.enum(['dev', 'staging', 'production']).default('dev'),
  API_PREFIX: z.string().default('/api'),
  LOG_LEVEL: z.string().default('debug'),
})

describe('env schema validation', () => {
  test('applies default values when env vars are missing', () => {
    const parsed = envSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.PORT).toBe(8888)
    expect(parsed.data.APP_ENV).toBe('dev')
    expect(parsed.data.API_PREFIX).toBe('/api')
    expect(parsed.data.LOG_LEVEL).toBe('debug')
  })

  test('parses PORT as number', () => {
    const parsed = envSchema.safeParse({ PORT: '3000' })
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.PORT).toBe(3000)
  })

  test('accepts valid APP_ENV values', () => {
    for (const val of ['dev', 'staging', 'production'] as const) {
      const parsed = envSchema.safeParse({ APP_ENV: val })
      expect(parsed.success).toBe(true)
      if (!parsed.success) return
      expect(parsed.data.APP_ENV).toBe(val)
    }
  })

  test('rejects invalid APP_ENV', () => {
    const parsed = envSchema.safeParse({ APP_ENV: 'invalid' })
    expect(parsed.success).toBe(false)
  })

  test('coerces PORT from string', () => {
    const parsed = envSchema.safeParse({ PORT: '8080' })
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.PORT).toBe(8080)
  })

  test('API_PREFIX defaults to /api', () => {
    const parsed = envSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.API_PREFIX).toBe('/api')
  })
})
