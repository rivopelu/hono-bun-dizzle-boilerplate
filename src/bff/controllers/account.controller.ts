import { Context } from 'hono'
import { Controller, Get } from '../../lib/decorators'
import { ResponseHelper } from '../../lib/response-helper'
import { AccountBffService } from '../services/account-bff.service'

@Controller()
export class AccountController {
  private accountBffService = new AccountBffService()

  @Get('/accounts')
  async list(c: Context) {
    const page = Math.max(0, parseInt(c.req.query('page') ?? '0', 10))
    const size = Math.min(100, Math.max(1, parseInt(c.req.query('size') ?? '20', 10)))
    const q = c.req.query('q') ?? undefined
    const sort = c.req.query('sort') ?? undefined
    const orderRaw = c.req.query('order')
    const order = orderRaw === 'asc' || orderRaw === 'desc' ? orderRaw : undefined

    const result = await this.accountBffService.list({ page, size, q, sort, order })

    return c.json(ResponseHelper.paginated(result.items, { page, size, totalData: result.total }))
  }
}

export const accountController = new AccountController()
