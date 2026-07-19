# API Template

Fastify API template with Drizzle ORM, PostgreSQL, JWT authentication, AWS S3,
and OpenAPI documentation.

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
