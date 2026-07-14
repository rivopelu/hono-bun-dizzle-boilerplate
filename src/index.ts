import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { registerControllers } from './lib/decorators'
import { corsConfig } from './configs/cors'
import { env } from './configs/env'
import { requestLogger } from './middlewares/request-logger'
import { errorHandler } from './configs/error-handler'
import { systemController } from './bff/controllers/system.controller'
import { authController } from './bff/controllers/auth.controller'
import { renderHome } from './views/home'

const app = new Hono()

app.use('*', cors(corsConfig))
app.use('*', requestLogger())
app.use('*', secureHeaders())

app.get('/favicon.ico', (c) => {
  const file = Bun.file('public/logo.svg')
  return new Response(file, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
})

app.get('/', async (c) => {
  const svg = await Bun.file('public/logo.svg').text()
  return c.html(renderHome({ appName: env.APP_NAME, appEnv: env.APP_ENV, port: env.PORT, svg }))
})

app.onError(errorHandler)

registerControllers(app, [systemController, authController], env.API_PREFIX as string)

export default app
