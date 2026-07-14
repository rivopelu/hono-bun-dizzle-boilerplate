# Architecture Rules

## Layer Isolation
- Controllers in `bff/controllers/` must NOT import from `app/` domain services
- Controllers must go through `bff/services/` (BFF layer)
- Domain services in `app/*/service/` must NOT import from `bff/`
- BFF services can import from both `app/` and `bff/`

## Repository Pattern
- Accept `db` via constructor with default: `constructor(private db: NodePgDatabase = defaultDb) {}`
- This enables mocking in tests without `mock.module`

## Dependency Injection
- Services accept dependencies via constructor with default parameters
- Example: `constructor(private repo = new Repository()) {}`
- This enables testing with mocked dependencies

## Error Handling
- Domain services throw `AppError` subclasses
- BFF services pass errors through (don't catch unless adding context)
- Controllers let errors bubble to global `errorHandler`
