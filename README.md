# Todo Backend API

A minimal but properly structured Node.js + Express backend for a Todo app with JWT authentication.

## Tech Stack

- **Node.js & Express** - Server framework
- **Prisma ORM** - Database toolkit with PostgreSQL
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Input validation
- **TypeScript** - Type safety

## Project Structure

```
/src
  /config
    env.ts            # Environment configuration
    prisma.ts         # Prisma client setup
  /middlewares
    auth.ts           # JWT authentication middleware
    validate.ts       # Zod validation middleware
    error.ts          # Global error handler
  /routes
    auth.routes.ts    # Authentication routes
    todo.routes.ts    # Todo CRUD routes
    index.ts          # Route aggregation
  /controllers
    auth.controller.ts
    todo.controller.ts
  /services
    auth.service.ts   # Business logic for auth
    todo.service.ts   # Business logic for todos
  /utils
    http.ts           # HTTP response helpers
  app.ts              # Express app configuration
  server.ts           # Server bootstrap
/prisma
  schema.prisma       # Database schema
```

## Quick Start

1. **Clone and setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

#### Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Todos (All Protected)

#### Get Token for Testing
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}' | jq -r .data.token)
```

#### Create Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy milk","completed":false}'
```

#### Get All Todos
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Single Todo
```bash
curl -X GET http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Todo
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'
```

#### Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Response Format

All responses follow this structure:
```json
{
  "data": { /* response data */ },
  "error": null
}
```

Error responses:
```json
{
  "data": null,
  "error": "Error message"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `PORT` - Server port (default: 3000)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation with Zod schemas
- CORS and security headers
- Protected routes middleware
- Proper error handling