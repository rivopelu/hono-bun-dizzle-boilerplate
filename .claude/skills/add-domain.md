# Skill: Add New Domain

Use this skill when creating a new domain module in `src/app/`.

## Steps

1. Create directory structure:
   ```
   src/app/<domain>/
   ├── entity/
   ├── repository/
   ├── service/
   └── types/
   ```

2. Create entity file `entity/<domain>.entity.ts`:
   - Define `pgTable` with `...entityId`, domain columns, `...baseEntity`
   - Export `<Domain>Entity`, `type <Domain> = InferSelectModel<>`, `type New<Domain> = InferInsertModel<>`

3. Create repository `repository/<domain>.repository.ts`:
   - Import `db as defaultDb` from `configs/database.config`
   - Accept `db` via constructor with default: `constructor(private db: NodePgDatabase = defaultDb) {}`
   - Implement CRUD methods using `this.db`
   - Use `eq()` for WHERE clauses
   - For paginated queries: return `PaginatedResult<T>`, accept `PaginationQuery`
   - Always filter `active = true` for soft delete

4. Create service `service/<domain>.service.ts`:
   - Accept repository via constructor
   - Implement business logic methods
   - Throw `AppError` subclasses for error cases

5. Create types `types/<domain>.types.ts`:
   - Define DTO interfaces for inputs/outputs
   - For list queries, alias pagination generics:
     ```typescript
     import type { PaginationQuery, PaginatedResult } from '../../../lib/pagination'
     export type DomainListQuery = PaginationQuery
     export type DomainListResult = PaginatedResult<Domain>
     ```

6. Add `__test__/` directories with test files for entity, repository, service, types

7. If exposing via API:
   - Create BFF service in `bff/services/` (thin wrapper delegating to domain service)
   - Create controller in `bff/controllers/` — use `@Controller()`, `@Get()`, `@Post()` decorators
   - Use `getPagination(c)` and `getUser(c)` helpers in controller
   - Return `ResponseHelper.paginated(data, { page, size, totalData })` for list endpoints
   - Register controller in `src/index.ts`
   - Add test files for BFF service and controller

## Example: Adding "product" domain
```typescript
// src/app/product/entity/product.entity.ts
import { pgTable, varchar, bigint } from 'drizzle-orm/pg-core'
import { baseEntity, entityId } from '../../../lib/base.entity'

export const ProductEntity = pgTable('product', {
  ...entityId,
  name: varchar('name', { length: 255 }).notNull(),
  price: bigint('price', { mode: 'number' }).notNull(),
  ...baseEntity,
})
```
