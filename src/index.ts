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

const app = new Hono()

app.use('*', cors(corsConfig))
app.use('*', requestLogger())
app.use('*', secureHeaders())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.onError(errorHandler)

registerControllers(app, [systemController, authController], env.API_PREFIX as string)

export default app
