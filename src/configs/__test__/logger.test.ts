import { describe, expect, test } from 'bun:test'

describe('logger', () => {
  test('exports logger instance', async () => {
    const { logger } = await import('../logger')
    expect(logger).toBeDefined()
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.warn).toBe('function')
  })

  test('logger.info works without error', async () => {
    const { logger } = await import('../logger')
    expect(() => logger.info('test message')).not.toThrow()
  })
})
