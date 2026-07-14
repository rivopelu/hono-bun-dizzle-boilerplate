import { eq } from 'drizzle-orm'
import { db } from '../../../configs/database.config'
import { AccountEntity, type Account, type NewAccount } from '../entity/account.entity'

export class AccountRepository {
  async findByEmail(email: string): Promise<Account | null> {
    const result = await db
      .select()
      .from(AccountEntity)
      .where(eq(AccountEntity.email, email))
      .limit(1)
    return result[0] ?? null
  }

  async findById(id: string): Promise<Account | null> {
    const result = await db.select().from(AccountEntity).where(eq(AccountEntity.id, id)).limit(1)
    return result[0] ?? null
  }

  async insert(input: NewAccount): Promise<Account> {
    const result = await db.insert(AccountEntity).values(input).returning()
    return result[0]
  }

  async update(id: string, input: Partial<NewAccount>): Promise<Account> {
    const result = await db
      .update(AccountEntity)
      .set({ ...input, updated_date: Date.now() })
      .where(eq(AccountEntity.id, id))
      .returning()
    return result[0]
  }
}
