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

## Testing
- Test files: `__test__/<name>.test.ts`
- Use `describe`/`test` from `bun:test`
- Mock external dependencies with constructor injection
- Test happy path + error cases
