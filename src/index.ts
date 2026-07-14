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
import { detectLocale } from './lib/i18n'
import { logger } from './configs/logger'
import { authMiddleware } from './middlewares/auth'
import { pool } from './configs/database.config'

const app = new Hono()

app.use('*', cors(corsConfig))
app.use('*', requestLogger())
app.use('*', secureHeaders())
app.use('/api/auth/*', authMiddleware())

app.get('/favicon.ico', (_c) => {
  const file = Bun.file('public/logo.svg')
  return new Response(file, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
})

app.get('/', async (c) => {
  const svg = await Bun.file('public/logo.svg').text()
  const locale = detectLocale(c.req.header('Accept-Language'))
  return c.html(
    renderHome({ appName: env.APP_NAME, appEnv: env.APP_ENV, port: env.PORT, svg, locale }),
  )
})

app.onError(errorHandler)

registerControllers(app, [systemController, authController], env.API_PREFIX as string)

const server = Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
})

logger.info(`Server started: http://localhost:${env.PORT}`)

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down')
  server.stop()
  await pool.end()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received — shutting down')
  server.stop()
  await pool.end()
  process.exit(0)
})
