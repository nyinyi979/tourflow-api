# TourFlow API

Fastify API for TourFlow with Drizzle ORM, PostgreSQL, JWT authentication, AWS
S3, TypeBox request validation, and OpenAPI documentation.

## Feature structure

Each API feature keeps its HTTP and database responsibilities separate:

```text
src/api/tour/
├── controllers.ts  # Database and business operations
├── handlers.ts     # HTTP request and response handling
├── routes.ts       # Route registration and documentation
├── schemas.ts      # TypeBox validation and inferred request types
└── utils.ts        # Tour-specific processing and relationship syncing
```

TypeBox schemas are the source of truth for request validation, Swagger JSON
Schema, and TypeScript request types. Request interfaces should not be written
separately from their runtime schemas.

## Getting started

```bash
npm install
cp .env.sample .env
npm run dev
```

The development server uses Nodemon and automatically restarts when TypeScript
files under `src/` change.

## API documentation

With the server running, open:

- Swagger UI: `http://127.0.0.1:7000/documentation/`
- OpenAPI JSON: `http://127.0.0.1:7000/documentation/json`
- OpenAPI YAML: `http://127.0.0.1:7000/documentation/yaml`

Protected endpoints use the `x-access-token` header. Swagger UI provides an
Authorize button for entering the JWT returned by the login endpoint.

## Commands

```bash
npm run dev          # Start the development server with Nodemon
npm run typecheck    # Check TypeScript without emitting files
npm run build        # Compile TypeScript into build/
npm run start        # Start the compiled server
npm run format       # Format the repository
npm run format:check # Check repository formatting
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply Drizzle migrations
```
