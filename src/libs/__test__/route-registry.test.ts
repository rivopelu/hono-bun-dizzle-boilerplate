import { describe, expect, test } from 'bun:test'
import { Hono } from 'hono'
import { Controller, Get } from '../decorators'
import { registerControllers } from '../route-registry'

describe('registerControllers', () => {
  @Controller()
  class TestController {
    @Get('/test-route')
    handler(c: any) {
      return c.text('ok')
    }
  }

  test('registers controller routes', async () => {
    const app = new Hono()
    registerControllers(app, [new TestController()], '/api')
    const res = await app.request('/api/test-route')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('ok')
  })

  test('returns 404 for unregistered routes', async () => {
    const app = new Hono()
    registerControllers(app, [new TestController()], '/api')
    const res = await app.request('/api/nonexistent')
    expect(res.status).toBe(404)
  })

  test('handles multiple controllers', async () => {
    @Controller()
    class AnotherController {
      @Get('/another')
      handler(c: any) {
        return c.text('another')
      }
    }

    const app = new Hono()
    registerControllers(app, [new TestController(), new AnotherController()], '/api')
    const res1 = await app.request('/api/test-route')
    const res2 = await app.request('/api/another')
    expect(await res1.text()).toBe('ok')
    expect(await res2.text()).toBe('another')
  })
})
