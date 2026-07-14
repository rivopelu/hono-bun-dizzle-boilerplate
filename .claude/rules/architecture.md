# Architecture Rules

## Layer Isolation
- Controllers in `bff/controllers/` must NOT import from `app/` domain services
- Controllers must go through `bff/services/` (BFF layer)
- Domain services in `app/*/service/` must NOT import from `bff/`
- BFF services can import from both `app/` and `bff/`

## Dependency Injection
- Services accept dependencies via constructor with default parameters
- Example: `constructor(private repo = new Repository()) {}`
- This enables testing with mocked dependencies

## Error Handling
- Domain services throw `AppError` subclasses
- BFF services pass errors through (don't catch unless adding context)
- Controllers let errors bubble to global `errorHandler`
