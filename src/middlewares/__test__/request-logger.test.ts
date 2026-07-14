import { describe, expect, test } from 'bun:test'
import { Hono } from 'hono'
import { requestLogger } from '../request-logger'

describe('requestLogger middleware', () => {
  const app = new Hono()
  app.use('*', requestLogger())
  app.get('/test', (c) => c.text('ok'))

  test('sets X-Request-Id header', async () => {
    const res = await app.request('/test')
    expect(res.status).toBe(200)
    expect(res.headers.has('X-Request-Id')).toBe(true)
    expect(res.headers.get('X-Request-Id')).toHaveLength(8)
  })

  test('returns normal response', async () => {
    const res = await app.request('/test')
    expect(await res.text()).toBe('ok')
  })

  test('handles 404 paths', async () => {
    const res = await app.request('/notfound')
    expect(res.status).toBe(404)
    expect(res.headers.has('X-Request-Id')).toBe(true)
  })
})
