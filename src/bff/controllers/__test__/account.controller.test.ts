import { describe, expect, test } from 'bun:test'
import { Hono } from 'hono'
import { accountController } from '../account.controller'
import { registerControllers } from '../../../lib/decorators'
import { errorHandler } from '../../../configs/error-handler'

describe('AccountController', () => {
  const app = new Hono()
  app.onError(errorHandler)
  registerControllers(app, [accountController], '/api')

  test('GET /api/accounts returns paginated response', async () => {
    const res = await app.request('/api/accounts')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.response_data)).toBe(true)
    expect(body.paginated_data).toBeDefined()
    expect(body.paginated_data.page).toBe(0)
    expect(body.paginated_data.size).toBe(20)
  })

  test('GET /api/accounts?page=1&size=5 passes query params', async () => {
    const res = await app.request('/api/accounts?page=1&size=5')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.paginated_data.page).toBe(1)
    expect(body.paginated_data.size).toBe(5)
  })

  test('GET /api/accounts?q=test passes search', async () => {
    const res = await app.request('/api/accounts?q=test')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('GET /api/accounts?sort=name&order=asc passes sort params', async () => {
    const res = await app.request('/api/accounts?sort=name&order=asc')
    expect(res.status).toBe(200)
  })

  test('GET /api/accounts clamps size to max 100', async () => {
    const res = await app.request('/api/accounts?size=999')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.paginated_data.size).toBe(100)
  })
})
