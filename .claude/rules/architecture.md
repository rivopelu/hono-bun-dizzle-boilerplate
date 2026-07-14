# Architecture Rules

## Layer Isolation
- Controllers in `bff/controllers/` must NOT import from `app/` domain services
- Controllers must go through `bff/services/` (BFF layer)
- Domain services in `app/*/service/` must NOT import from `bff/`
- BFF services can import from both `app/` and `bff/`

## Repository Pattern
- Accept `db` via constructor with default: `constructor(private db: NodePgDatabase = defaultDb) {}`
- This enables mocking in tests without `mock.module`
- Soft delete: always filter `active = true` in queries

## Dependency Injection
- Services accept dependencies via constructor with default parameters
- Example: `constructor(private repo = new Repository()) {}`
- This enables testing with mocked dependencies
- For module-level mocking use `mock.module()` from `bun:test` with `beforeAll` + dynamic `import()`

## Error Handling
- Domain services throw `AppError` subclasses
- BFF services pass errors through (don't catch unless adding context)
- Controllers let errors bubble to global `errorHandler`
- `ZodError` is automatically caught → 422 with structured `{ path, message }` errors

## Auth Access (`@AuthAccess`)
- `@AuthAccess()` decorator from `src/lib/decorators/` — JWT protection for routes
- Applied at class level: all routes in the controller require auth
- Applied at method level: only that specific route requires auth
- Routes without `@AuthAccess()` are public by default
- Applied automatically by `registerControllers()` — no manual `app.use()` needed
- Use `getUser(c)` helper to get current user — never `c.get('user')` directly
- Protected routes get `c.set('user', { sub })` from JWT verification
- Internal implementation: `src/middlewares/auth-access.ts`

## Pagination
- Always use `getPagination(c)` helper to parse query params
- Use generic `PaginationQuery` and `PaginatedResult<T>` from `src/lib/pagination.ts`
- Repository returns `PaginatedResult<T>` (not raw Drizzle result)
- Controller calls `ResponseHelper.paginated(data, { page, size, totalData })`
- Domain types should alias the generics for each domain (e.g., `AccountListQuery = PaginationQuery`)

## i18n
- Translations live in `resources/lang/{en,id}.json`
- Use `detectLocale(header)` in controllers, pass locale to response layer
- Use `t(locale, key)` in views/services for translated strings
- `loadLocale(locale)` caches parsed JSON in memory

## CORS
- `ALLOWED_ORIGINS` env var controls behavior
- `*` → wildcard origin, credentials disabled
- Explicit list (comma-separated) → credentials enabled
- Configured in `src/configs/cors.ts`

## Graceful Shutdown
- SIGTERM/SIGINT handlers must stop server + close DB pool
- Log shutdown progress with `logger.info`
