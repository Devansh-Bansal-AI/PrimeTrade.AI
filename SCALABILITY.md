# Scalability Note

This document outlines the scalability strategies and future growth path for the Task Management backend system. 

## Current Architecture
The current backend is a **Modular Monolith** built with Node.js and Express. It uses MongoDB for data storage and stateless JWTs for authentication.

## Scaling Strategies

### 1. Horizontal Scaling (Load Balancing)
Because the application uses stateless JWTs for authentication rather than server-side sessions, it is immediately ready to be horizontally scaled. 
- We can deploy multiple instances of the Node.js backend using PM2 (for bare metal) or Docker/Kubernetes.
- A Load Balancer (like Nginx, AWS ALB, or HAProxy) can distribute incoming traffic evenly across the application instances.

### 2. Caching (Redis)
To reduce database load and improve response times for read-heavy operations:
- **Rate Limiting:** Currently handled in-memory, which doesn't scale across multiple instances. We should migrate the `express-rate-limit` store to Redis.
- **Data Caching:** Frequently accessed data (like User profiles or commonly searched Tasks) can be cached in Redis with a TTL.

### 3. Database Scalability
MongoDB natively supports scalability:
- **Indexing:** Indexes have been added to commonly queried fields (like `userId`, `status`, `priority`) to ensure fast query performance as the collection grows.
- **Replication & Sharding:** If data grows massively, MongoDB Atlas allows us to enable sharding to distribute data across multiple servers seamlessly.

### 4. Transitioning to Microservices
As the project grows in complexity and team size, the modular structure allows for an easy transition to Microservices.
- The `auth`, `users`, and `tasks` modules are logically separated.
- We can extract them into independent microservices communicating via gRPC or message queues (like RabbitMQ or Kafka) to decouple heavy operations (e.g., generating export reports or sending emails) from the main API event loop.

### 5. Deployment Readiness (Docker)
Containerizing the backend using Docker ensures environmental consistency from local development to production. The next step is adding a `Dockerfile` and `docker-compose.yml` to orchestrate the Node app alongside MongoDB and Redis.
