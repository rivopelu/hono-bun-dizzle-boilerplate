import { describe, expect, test } from 'bun:test'

describe('AccountRepository', () => {
  test('class is importable', async () => {
    const { AccountRepository } = await import('../account.repository')
    const repo = new AccountRepository()
    expect(repo).toBeDefined()
    expect(typeof repo.findByEmail).toBe('function')
    expect(typeof repo.findById).toBe('function')
    expect(typeof repo.insert).toBe('function')
    expect(typeof repo.update).toBe('function')
  })
})
