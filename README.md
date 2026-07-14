# Hono Bun Drizzle Boilerplate

Production-ready backend boilerplate using **Hono**, **Bun**, and **Drizzle ORM** with PostgreSQL.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh) v1.3+
- **Framework:** [Hono](https://hono.dev) v4
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- **Validation:** [Zod](https://zod.dev)
- **Auth:** JWT via [jose](https://github.com/panva/jose)
- **Password:** bcryptjs
- **Logging:** Winston
- **Linting:** ESLint + Prettier
- **Testing:** Bun test (built-in)
- **Hooks:** Husky + lint-staged

## Project Structure

```
src/
├── app/                    # Domain-driven modules
│   ├── account/            # Account domain (entity, repository, service, types)
│   └── auth/               # Auth domain (service, types)
├── bff/
│   ├── controllers/        # Route handlers
│   ├── services/           # BFF services
│   ├── types/request/      # Request validation schemas (Zod)
│   └── types/response/     # Response type definitions
├── configs/                # App configuration (env, db, logger, errors)
├── lib/                    # Shared utilities (base entity, string utils, decorators)
└── middlewares/            # Hono middlewares
```

## Quick Start (New Project)

```bash
# Clone as a new project (no git history)
bun create github:rivopelu/hono-bun-dizzle-boilerplate my-project
cd my-project

# Copy environment variables
cp .env.example .env

# Generate and run migrations
bun run db:generate
bun run db:migrate

# Start dev server
bun run dev
```

## Getting Started (Existing Clone)

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Generate and run migrations
bun run db:generate
bun run db:migrate

# Start dev server
bun run dev
```

## Scripts

| Script          | Description                      |
|-----------------|----------------------------------|
| `dev`           | Start dev server with hot reload |
| `lint`          | Run ESLint                       |
| `lint:fix`      | Fix lint errors                  |
| `format`        | Check Prettier formatting        |
| `format:fix`    | Format with Prettier             |
| `typecheck`     | TypeScript type checking         |
| `test`          | Run tests                        |
| `test:coverage` | Run tests with coverage report   |
| `db:generate`   | Generate Drizzle migrations      |
| `db:migrate`    | Run Drizzle migrations           |
| `db:studio`     | Open Drizzle Studio              |

## Commit Hooks

- **Pre-commit:** Prettier + ESLint via lint-staged
- **Pre-push:** TypeScript typecheck + all tests
