# Hono Bun Drizzle Boilerplate

## Tech Stack
- **Runtime:** Bun 1.3+
- **Framework:** Hono 4
- **ORM:** Drizzle ORM + PostgreSQL (node-postgres)
- **Validation:** Zod 4
- **Auth:** JWT (jose) + bcryptjs
- **Logging:** Winston
- **Templating:** Handlebars
- **i18n:** JSON files (EN/ID)
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
│   ├── types/request/          # Request validation schemas (Zod)
│   └── types/response/         # Response type definitions
├── configs/                    # App config (env, db, logger, errors)
├── lib/                        # Shared utilities
├── middlewares/                # Hono middlewares
├── views/                      # Page renderers (home.ts)
└── resources/
    ├── lang/                   # i18n JSON files (en.json, id.json)
    └── views/                  # Handlebars templates (.html)
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
import { Controller, Get, Post } from '../../lib/decorators'
import { ResponseHelper } from '../../lib/response-helper'
import { getPagination } from '../../lib/get-pagination'
import { getUser } from '../../lib/get-user'

@Controller()
@AuthAccess() // class-level: all routes require auth
export class SomeController {
  @Get('/path')
  handler(c: Context) {
    return c.json(ResponseHelper.data(result))
  }

  @Get('/public')
  publicHandler(c: Context) { ... }

  @Get('/protected')
  @AuthAccess() // method-level: only this route requires auth
  protectedHandler(c: Context) { ... }
}
```

### Auth Access (`@AuthAccess`)
- `src/middlewares/auth-access.ts` — JWT verification middleware (used internally)
- `@AuthAccess()` decorator from `src/lib/decorators/` protects routes
- Can be applied at class level (all routes) or method level (single route)
- Protected routes get `c.set('user', { sub })` from JWT
- Use `getUser(c)` helper to read user — returns `{ sub: string } | undefined`
- Applied automatically by `registerControllers()` when `@AuthAccess()` is used
- Routes without `@AuthAccess()` are public by default (no path-based `app.use()` needed)

### Pagination Pattern
- `getPagination(c)` parses `?page=0&size=20&q=search&sort=name&order=asc` from Context
- Generic types: `PaginationQuery` and `PaginatedResult<T>` in `src/lib/pagination.ts`
- Repository returns `PaginatedResult<T>` with `{ items, total }`
- Controller returns `ResponseHelper.paginated(data, { page, size, totalData })`
- Default: page=0, size=20, max size=100, filter active=true (soft delete)

### i18n
- JSON files in `resources/lang/{en,id}.json`
- `detectLocale(header)` from `Accept-Language` header
- `t(locale, key)` returns translated string
- `loadLocale(locale)` caches parsed JSON

### Error Handling
- Use `AppError` subclasses from `configs/exception.ts`
- `ZodError` is caught by global `errorHandler` → 422 with structured errors
- Throw errors in services, caught by global `errorHandler`
- Never catch errors in controllers unless adding context

### Graceful Shutdown
- SIGTERM/SIGINT handlers in `src/index.ts`
- Calls `server.stop()` + `pool.end()` before exit

### CORS
- `ALLOWED_ORIGINS` env var: `*` = wildcard (no credentials), explicit list = credentials enabled
- Example: `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173`

### Testing (TDD Required)
- **Write tests first** — define expected behavior before implementation
- Every folder must have `__test__/` with corresponding test files
- Use constructor injection to mock dependencies (preferred)
- Or `mock.module()` for module-level mocks (use in `beforeAll` with dynamic `import()`)
- Services: mock repository layer, test business logic
- Controllers: mock BFF service via `mock.module()`, use `app.request()`
- **100% line coverage required** — run `bun test --coverage` before every push

### Response Format
All API responses follow `BaseResponse`:
```typescript
{ success: boolean, message: string, response_data?: T, paginated_data?: {...}, errors?: unknown }
```

### Bruno API Collection
- Located in `bruno/collections/{AUTH,SYSTEM}/`
- Auth: SIGN_UP, SIGN_IN (auto-saves TOKEN to env), ME (uses `{{TOKEN}}`)
- System: PING
- Environment: `bruno/environments/dev.yml` with `URL=http://localhost:8888/api`

## Environment Variables
| Var | Default | Description |
|-----|---------|-------------|
| `PORT` | 8888 | Server port |
| `APP_ENV` | dev | dev/staging/production |
| `APP_NAME` | hono-boilerplate | App name for landing page |
| `API_PREFIX` | /api | API route prefix |
| `LOG_LEVEL` | debug | Winston log level |
| `ALLOWED_ORIGINS` | * | CORS origins (comma-separated) |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USER` | postgres | DB user |
| `DB_PASSWORD` | (empty) | DB password |
| `DB_NAME` | reel_cut | DB name |
| `JWT_SECRET` | dev-secret-change-in-production | JWT signing key |
| `BCRYPT_ROUNDS` | 10 | bcrypt salt rounds |
| `JWT_ISSUER` | reel-cut | JWT issuer claim |

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
