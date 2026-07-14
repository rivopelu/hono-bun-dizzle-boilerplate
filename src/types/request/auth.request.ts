import { z } from 'zod'

export const SignUpRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
})

export const SignInRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
export type SignInRequest = z.infer<typeof SignInRequestSchema>
