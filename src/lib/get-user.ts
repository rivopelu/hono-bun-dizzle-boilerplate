import { Context } from 'hono'

export function getUser(c: Context): { sub: string } | undefined {
  return c.get('user') as { sub: string } | undefined
}
