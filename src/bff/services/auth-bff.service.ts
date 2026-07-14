import { AuthService } from '../../app/auth/service/auth.service'
import type { SignUpInput, SignInInput, AuthResult } from '../../app/auth/types/auth.types'

export class AuthBffService {
  private authService = new AuthService()

  async signUp(input: SignUpInput): Promise<AuthResult> {
    return this.authService.signUp(input)
  }

  async signIn(input: SignInInput): Promise<AuthResult> {
    return this.authService.signIn(input)
  }
}
