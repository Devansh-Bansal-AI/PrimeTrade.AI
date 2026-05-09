# 🚀 Task Management & Team Workspace Platform

> **Backend Developer Intern Assignment — PrimeTrade.ai**
>
> A production-style, full-stack REST API platform featuring secure JWT authentication, role-based access control (RBAC), full Task CRUD, and a React frontend — built with scalability as a first-class concern.

---

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Runtime** | Node.js + TypeScript |
| **Web Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt |
| **Validation** | Zod |
| **Security** | Helmet, CORS, express-rate-limit |
| **API Docs** | Swagger / OpenAPI 3.0 |
| **Frontend** | React 18 + Vite + TypeScript |
| **Frontend Styling** | Tailwind CSS |
| **HTTP Client** | Axios |
| **Forms** | React Hook Form |

---

## ✅ Features Implemented

### 🔐 Authentication & Authorization
- **User Registration** with bcrypt password hashing (cost factor 12)
- **User Login** with JWT access token issuance
- **JWT Middleware** — verifies token, attaches user object to request
- **Role-Based Access Control (RBAC)** — `user` and `admin` roles
- **Admin-only routes** — manage all users, promote/demote roles, delete accounts
- **Ownership enforcement** — users can only edit/delete their own tasks

### 📋 Task CRUD (Secondary Entity)
- **Create**, **Read** (single + list), **Update**, **Delete** tasks
- Task fields: `title`, `description`, `status`, `priority`, `dueDate`
- **Paginated task listing** with search, filtering by status/priority, and multi-field sorting
- Full **text search index** on title + description
- **Compound DB index** on `(createdBy, status, priority)` for performance

### 🛡️ Security
- `Helmet` sets secure HTTP headers
- CORS restricted to allowed origins only
- **Auth rate limiter** — 20 requests / 15 min per IP
- **Global rate limiter** — 200 requests / 15 min per IP
- `x-powered-by` header disabled
- Request body size limited to `1mb`
- Passwords never returned in responses (`select: false`)

### 📚 API Design
- RESTful design with proper HTTP verbs and status codes
- **API versioning** — all endpoints under `/api/v1`
- Centralized, consistent response envelope (`success`, `message`, `data`, `meta`)
- Centralized error handler — covers `ApiError`, `ZodError`, `MongooseError`
- **Swagger UI** for interactive API documentation

### 🖥️ Frontend UI
- React + Vite + Tailwind CSS
- **Register & Login** pages with form validation and API error display
- **Protected Dashboard** — accessible only with a valid JWT
- **Tasks Page** — full CRUD UI with search/filter/pagination
- Automatic logout on expired/invalid token (`auth:unauthorized` event)
- Role-aware UI messaging (admin sees all tasks, user sees only theirs)

---

## 📁 Project Structure

```
PrimeTrade.AI/
├── backend/
│   └── src/
│       ├── config/         # DB connection, env validation
│       ├── controllers/    # Auth, Task, User controllers
│       ├── docs/           # OpenAPI specification
│       ├── middleware/      # auth, authorize, rateLimiter, errorHandler, validate
│       ├── models/         # User & Task Mongoose schemas
│       ├── routes/         # auth, tasks, users + index router
│       ├── services/       # Business logic (auth, task, user)
│       ├── types/          # TypeScript augmentations (req.user)
│       ├── utils/          # ApiError, asyncHandler, apiResponse
│       ├── validators/     # Zod schemas for auth, tasks, users
│       ├── scripts/        # bootstrapAdmin.ts helper
│       ├── app.ts          # Express app setup
│       └── server.ts       # Bootstrap + DB connect
└── frontend/
    └── src/
        ├── api/            # authApi, taskApi (Axios instances)
        ├── components/     # Alert, FormInput, TaskForm, TaskTable
        ├── context/        # AuthContext (token, user, login/logout)
        ├── hooks/          # useAuth hook
        ├── layouts/        # AuthLayout, AppLayout
        ├── pages/          # LoginPage, RegisterPage, DashboardPage, TasksPage
        ├── routes/         # AppRouter, ProtectedRoute
        ├── types/          # Shared TypeScript types
        └── utils/          # storage, apiError helpers
```

---

## 🗄️ Database Schema

### User Collection
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | 2–80 chars |
| `email` | String | Unique, lowercase |
| `password` | String | bcrypt hashed, never returned |
| `role` | Enum | `"user"` (default) / `"admin"` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Task Collection
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `title` | String | 2–120 chars, required |
| `description` | String | Optional, max 2000 chars |
| `status` | Enum | `"todo"` / `"in_progress"` / `"done"` |
| `priority` | Enum | `"low"` / `"medium"` / `"high"` |
| `dueDate` | Date | Optional |
| `createdBy` | ObjectId | Ref: User |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Indexes:**
- `{ createdBy: 1, status: 1, priority: 1 }` — compound index for filtered list queries
- `{ title: "text", description: "text" }` — full text search

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB (local install OR Docker)

**Quick MongoDB via Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run dev
```

Backend runs on → `http://localhost:5000`

Swagger Docs → `http://localhost:5000/api-docs`

### 2. Frontend

```bash
cd frontend
npm install
# .env is pre-configured to http://localhost:5000/api/v1
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

## 🌍 Environment Variables

### `backend/.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-workspace
JWT_SECRET=<your-strong-random-secret>
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
```

### `frontend/.env`
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🔑 Admin Bootstrap

Register a regular user via the UI or API, then promote them to admin:

```bash
cd backend
npm run bootstrap:admin -- your-email@example.com
```

---

## 📖 API Documentation

Interactive Swagger UI: **`http://localhost:5000/api-docs`**

Base URL: `http://localhost:5000/api/v1`

Auth: `Authorization: Bearer <jwt_token>`

### Quick Reference

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/auth/register` | ❌ | Any | Register new user |
| POST | `/auth/login` | ❌ | Any | Login, receive JWT |
| GET | `/auth/me` | ✅ | Any | Get own profile |
| GET | `/tasks` | ✅ | Any | List tasks (paginated) |
| POST | `/tasks` | ✅ | Any | Create task |
| GET | `/tasks/:id` | ✅ | Owner/Admin | Get single task |
| PATCH | `/tasks/:id` | ✅ | Owner/Admin | Update task |
| DELETE | `/tasks/:id` | ✅ | Owner/Admin | Delete task |
| GET | `/users` | ✅ | Admin | List all users |
| GET | `/users/:id` | ✅ | Admin | Get user by ID |
| PATCH | `/users/:id/role` | ✅ | Admin | Update user role |
| DELETE | `/users/:id` | ✅ | Admin | Delete user |

### Example API Flow

**1. Register**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Aarav Singh","email":"aarav@example.com","password":"StrongPass123!"}'
```

**2. Login**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aarav@example.com","password":"StrongPass123!"}'
```

**3. Create Task** (use JWT from login)
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"title":"Prepare sprint demo","priority":"high","status":"todo"}'
```

**4. List Tasks with filters**
```bash
curl "http://localhost:5000/api/v1/tasks?status=todo&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 📈 Scalability Note

This codebase is designed as a **scalable modular monolith** with a clear evolution path:

| Strategy | Details |
|---|---|
| **Horizontal Scaling** | Stateless JWTs allow multiple backend instances behind a load balancer (Nginx / AWS ALB) with zero session-sharing overhead |
| **Caching (Redis)** | Rate-limit state and hot queries (user profiles, frequent task lookups) can be moved to Redis; the limiter is pluggable via `express-rate-limit` store |
| **Database Scaling** | MongoDB supports replica sets and sharding natively; indexes are already in place for the most common query patterns |
| **Service Extraction** | `auth`, `tasks`, and `users` are cleanly separated modules that can be extracted into independent microservices communicating via REST or message queues (RabbitMQ / Kafka) |
| **Async Workloads** | Heavy jobs (email notifications, report generation) can be offloaded to a job queue (Bull / BullMQ) without blocking the API event loop |
| **Containerisation** | Docker + docker-compose can be added to orchestrate the Node app, MongoDB, and Redis together for repeatable deployments |

---

## 🔮 Future Improvements

- Refresh token rotation + revocation list (Redis-backed blocklist)
- Email verification and password reset flow
- Audit log for all admin actions
- CI/CD pipeline with lint, type-check, and test gates
- Optional: WebSocket for real-time task updates across collaborators
