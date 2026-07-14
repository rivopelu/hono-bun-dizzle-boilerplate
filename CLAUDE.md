# Hono Bun Drizzle Boilerplate

## Tech Stack
- **Runtime:** Bun 1.3+
- **Framework:** Hono 4
- **ORM:** Drizzle ORM + PostgreSQL (node-postgres)
- **Validation:** Zod 4
- **Auth:** JWT (jose) + bcryptjs
- **Logging:** Winston
- **Linting:** ESLint + Prettier
- **Testing:** Bun test (built-in)
- **Hooks:** Husky + lint-staged

## Project Structure

```
src/
├── app/                        # Domain-driven modules
│   ├── <domain>/               # Each domain has:
│   │   ├── entity/             #   Drizzle entity (pgTable)
│   │   ├── repository/         #   Data access layer
│   │   ├── service/            #   Business logic
│   │   └── types/              #   DTO interfaces
├── bff/
│   ├── controllers/            # Route handlers (Hono controllers)
│   ├── services/               # BFF services (bridge controllers ↔ domain)
│   └── types/response/         # Response type definitions
├── configs/                    # App config (env, db, logger, errors)
├── lib/                        # Shared utilities (base entity, string utils, decorators, response-helper)
├── middlewares/                # Hono middlewares
└── types/request/              # Request validation schemas (Zod)
```

## Architecture Rules

### Layer Flow
```
Controller (bff/controllers/)
  → BFF Service (bff/services/)
    → Domain Service (app/<domain>/service/)
      → Domain Repository (app/<domain>/repository/)
        → Database (Drizzle ORM)
```

**Never** let a Controller directly import from `app/` domain services. Always go through `bff/services/`.

### Entity Definition Pattern
```typescript
import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { baseEntity, entityId } from '../../../lib/base.entity'

export const EntityName = pgTable('table_name', {
  ...entityId,
  // domain columns
  ...baseEntity,
})

export type Entity = InferSelectModel<typeof EntityName>
export type NewEntity = InferInsertModel<typeof EntityName>
```

### Service Pattern
- Domain services (`app/*/service/`) contain pure business logic
- Services accept dependencies via constructor (default to new instance)
- BFF services (`bff/services/`) are thin wrappers that delegate to domain services

### Controller Pattern
```typescript
import { Context } from 'hono'
import { Controller, Get, Post } from '../../libs/decorators'
import { ResponseHelper } from '../../libs/response-helper'

@Controller()
export class SomeController {
  @Get('/path')
  handler(c: Context) {
    return c.json(ResponseHelper.data(result))
  }
}
```

### Error Handling
- Use `AppError` subclasses from `configs/exception.ts`
- Throw errors in services, caught by global `errorHandler`
- Never catch errors in controllers unless adding context

### Testing
- Every folder must have `__test__/` with corresponding test files
- Use constructor injection to mock dependencies
- Services: mock repository layer, test business logic
- Controllers: use `app.request()` to test endpoints
- Aim for 80%+ coverage

### Response Format
All API responses follow `BaseResponse`:
```typescript
{ success: boolean, message: string, response_data?: T, paginated_data?: {...}, errors?: unknown }
```

## Available Scripts
| Script          | Description                      |
|-----------------|----------------------------------|
| `dev`           | Start dev server with hot reload |
| `lint`          | Run ESLint                       |
| `lint:fix`      | Fix lint errors                  |
| `format`        | Check Prettier formatting        |
| `format:fix`    | Format with Prettier             |
| `typecheck`     | tsc --noEmit                     |
| `test`          | Run all tests                    |
| `test:coverage` | Run tests with coverage report   |
| `db:generate`   | Generate Drizzle migrations      |
| `db:migrate`    | Run Drizzle migrations           |
| `db:studio`     | Open Drizzle Studio              |
