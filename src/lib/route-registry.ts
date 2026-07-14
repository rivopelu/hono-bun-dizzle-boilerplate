export type Constructor = new (...args: unknown[]) => object
type Handler = (...args: unknown[]) => unknown

interface RouteEntry {
  method: string
  path: string
  handler: Handler
}

interface ControllerEntry {
  basePath: string
  routes: RouteEntry[]
}

const registry = new Map<Constructor, ControllerEntry>()

export function registerRoute(target: Constructor, method: string, path: string, handler: Handler) {
  let entry = registry.get(target)
  if (!entry) {
    entry = { basePath: '', routes: [] }
    registry.set(target, entry)
  }
  entry.routes.push({ method, path, handler })
}

export function setBasePath(target: Constructor, basePath: string) {
  let entry = registry.get(target)
  if (!entry) {
    entry = { basePath, routes: [] }
    registry.set(target, entry)
  } else {
    entry.basePath = basePath
  }
}

export function registerControllers(app: any, controllers: object[], globalPrefix?: string) {
  for (const controller of controllers) {
    const entry = registry.get(controller.constructor as Constructor)
    if (!entry) continue

    const base = [globalPrefix, entry.basePath].filter(Boolean).join('').replace(/\/$/, '')
    for (const route of entry.routes) {
      const path = `${base}${route.path}`
      const handler = route.handler.bind(controller)
      app[route.method.toLowerCase()](path, handler)
    }
  }
}
