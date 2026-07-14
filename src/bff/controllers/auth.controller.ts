import { Context } from 'hono'
import { Controller, Post } from '../../libs/decorators'
import { ResponseHelper } from '../../libs/response-helper'
import { AuthService } from '../../app/auth/service/auth.service'
import { SignUpRequestSchema, SignInRequestSchema } from '../../types/request/auth.request'

@Controller()
export class AuthController {
  private authService = new AuthService()

  @Post('/auth/sign-up')
  async signUp(c: Context) {
    const body = SignUpRequestSchema.parse(await c.req.json())
    const result = await this.authService.signUp(body)
    return c.json(ResponseHelper.data(result, 'Account created successfully'), 201)
  }

  @Post('/auth/sign-in')
  async signIn(c: Context) {
    const body = SignInRequestSchema.parse(await c.req.json())
    const result = await this.authService.signIn(body)
    return c.json(ResponseHelper.data(result))
  }
}

export const authController = new AuthController()
