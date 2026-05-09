# Task Management & Team Workspace Platform

Production-style full-stack internship project for a **Backend Developer Intern** role, focused on backend maturity: secure auth, RBAC, scalable modular architecture, clean API contracts, and a minimal professional frontend.

## Overview

This project is a modular monolith with:

- **Backend:** Node.js, TypeScript, Express, MongoDB Atlas, Mongoose, JWT, Zod, Swagger, Helmet, Morgan, rate limiting
- **Frontend:** React + Vite + TypeScript, Tailwind CSS, Axios, React Router, React Hook Form

It is intentionally optimized for local reviewer experience:

- Backend: `npm install` + `npm run dev`
- Frontend: `npm install` + `npm run dev`
- No Docker, no local Mongo installation, no Redis

## Core Features

- Secure registration/login with bcrypt password hashing + JWT access tokens
- Role-based access control (`user`, `admin`)
- Protected routes and middleware-based authorization
- Task CRUD with ownership rules
- Task list with search, filtering, sorting, and pagination
- Admin-only user management routes
- Centralized validation/error handling and consistent API response structure
- Swagger/OpenAPI docs at `/api-docs`
- Frontend auth flow, protected pages, task management UI, loading/error/success states

## Architecture

### Backend

```text
backend/src
├── app.ts
├── server.ts
├── config/
├── controllers/
├── docs/
├── middleware/
├── models/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
└── scripts/
```

### Frontend

```text
frontend/src
├── api/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── types/
└── utils/
```

## Local Setup

## 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill `.env` with MongoDB Atlas connection and JWT secret.

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

Swagger: `http://localhost:5000/api-docs`

## 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

- `PORT` - backend port (default `5000`)
- `NODE_ENV` - environment (`development`, `production`, `test`)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret (use strong random value)
- `JWT_EXPIRES_IN` - JWT expiration window (example `1d`)
- `CLIENT_URL` - primary frontend URL for CORS
- `CLIENT_URLS` - comma-separated allowed origins for CORS

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` - backend API base URL (default `http://localhost:5000/api/v1`)

## Admin Bootstrap (Reviewer Friendly)

1. Register a normal user from UI or API.
2. Promote that account to admin:

```bash
cd backend
npm run bootstrap:admin -- your-email@example.com
```

This updates the existing user role to `admin` safely without exposing insecure default admin credentials.

## API Documentation

- Base URL: `http://localhost:5000/api/v1`
- Swagger UI: `http://localhost:5000/api-docs`
- Auth scheme: `Bearer <jwt>`

### Example API Flow

1. Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Aarav Singh\",\"email\":\"aarav@example.com\",\"password\":\"StrongPass123!\"}"
```

2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"aarav@example.com\",\"password\":\"StrongPass123!\"}"
```

3. Create Task (with JWT)

```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d "{\"title\":\"Prepare sprint demo\",\"priority\":\"high\",\"status\":\"todo\"}"
```

## Security and API Quality Highlights

- Helmet headers + `x-powered-by` disabled
- Auth and global rate limiting
- JWT verification middleware + role middleware
- Zod validation middleware with parsed output application
- Sanitized request payloads + safe regex escaping for search
- Centralized error handling and consistent success/error response envelopes
- API versioning via `/api/v1`

## Frontend UX Notes

- Protected routes with token-based session handling
- Automatic logout on unauthorized/expired token responses
- Task dashboard + management page with stable loading/error states
- Search/filter apply-reset workflow with pagination controls
- Role-aware messaging for admin vs user scope

## Scalability Discussion

This codebase is built as a **scalable modular monolith** and can evolve incrementally:

- **Horizontal scaling:** stateless JWT auth enables multiple backend instances behind a load balancer.
- **Caching options:** introduce Redis for hot queries/rate-limit state if needed.
- **Data growth:** indexed task/user fields already support common filters/search paths.
- **Service extraction path:** modules (`auth`, `tasks`, `users`) can be extracted into services later with minimal rewrite.
- **Operational hardening:** add structured logging, tracing, and background jobs for async workloads.

## Future Improvements

- Refresh token rotation and token revocation list
- Email verification and forgot-password flow
- Audit logs for admin actions
- CI pipeline with automated tests + lint/build gates
- Optional WebSocket updates for real-time collaboration

## Screenshots (Placeholders)

- `docs/screenshots/login.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/tasks.png`
- `docs/screenshots/swagger.png`
