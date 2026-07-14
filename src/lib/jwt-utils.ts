import { jwtVerify } from 'jose'
import { env } from '../configs/env'

export async function verifyToken(token: string): Promise<{ sub: string }> {
  const secret = new TextEncoder().encode(env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)
  return { sub: payload.sub as string }
}
