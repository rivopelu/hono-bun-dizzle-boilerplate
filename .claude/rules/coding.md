# Coding Standards

## General
- Use TypeScript strict mode
- Prefer `const` over `let`
- No `any` types unless absolutely necessary
- Use `import type` for type-only imports

## Naming
- Files: `kebab-case.ts` (e.g., `auth-bff.service.ts`)
- Classes: PascalCase
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Entities: PascalCase with `Entity` suffix (e.g., `AccountEntity`)
- Types/interfaces: PascalCase

## Imports Order
1. External packages (hono, drizzle, etc.)
2. Internal absolute imports (configs, libs)
3. Internal relative imports (../, ./)

## Entities
- Always spread `...entityId` and `...baseEntity`
- Export `InferSelectModel` and `InferInsertModel` types
- Use `pgTable('snake_case_name', {...})`

## Services
- One class per file
- Public methods return Promises
- Private helper methods for internal logic

## Lib Helpers
- `src/lib/get-user.ts`: `getUser(c)` — typed `{ sub: string } | undefined`
- `src/lib/get-pagination.ts`: `getPagination(c)` — parse pagination query params
- `src/lib/pagination.ts`: Generic `PaginationQuery` and `PaginatedResult<T>` interfaces
- `src/lib/i18n.ts`: `t()`, `detectLocale()`, `loadLocale()` for translations
- Domain types should alias pagination generics (e.g., `type AccountListQuery = PaginationQuery`)
- Response format always via `ResponseHelper.data()` or `ResponseHelper.paginated()`

## Testing (TDD)
- **Write tests before implementation** — define expected behavior first
- Test files: `__test__/<name>.test.ts`
- Use `describe`/`test`/`expect` from `bun:test`
- Mock external dependencies with constructor injection (preferred)
- For module-level mocks: `mock.module()` in `beforeAll` + `await import()`
- Test happy path + error cases
- Use `toEqual()` for object comparison (not `toBe()` which checks reference identity)
- Controllers: mock BFF service, create `new Hono()`, register controller, use `app.request()`
- **100% line coverage required** — run `bun test --coverage` and verify no uncovered lines
