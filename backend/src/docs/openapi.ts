export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Task Workspace API",
    version: "1.0.0",
    description:
      "Production-style Task Management & Team Workspace API with JWT authentication, role-based access control, secure middleware, and pagination/filter support."
  },
  servers: [{ url: "http://localhost:5000/api/v1", description: "Local server" }],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Tasks", description: "Task CRUD endpoints" },
    { name: "Users", description: "Admin-only user management endpoints" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ApiSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Request completed successfully." },
          data: { type: "object", nullable: true },
          meta: { type: "object", nullable: true }
        }
      },
      ApiErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed." },
          errors: { type: "object", nullable: true }
        }
      },
      AuthUser: {
        type: "object",
        required: ["id", "name", "email", "role"],
        properties: {
          id: { type: "string", example: "66500b7f8ce9f886f6bb6387" },
          name: { type: "string", example: "Aarav Singh" },
          email: { type: "string", format: "email", example: "aarav@example.com" },
          role: { type: "string", enum: ["user", "admin"], example: "user" }
        }
      },
      AuthPayload: {
        type: "object",
        required: ["user", "accessToken"],
        properties: {
          user: { $ref: "#/components/schemas/AuthUser" },
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
        }
      },
      UserSummary: {
        type: "object",
        properties: {
          _id: { type: "string", example: "66500b7f8ce9f886f6bb6387" },
          name: { type: "string", example: "Aarav Singh" },
          email: { type: "string", format: "email", example: "aarav@example.com" },
          role: { type: "string", enum: ["user", "admin"], example: "admin" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6650f1e1e30832fa6dc0af1f" },
          title: { type: "string", example: "Prepare sprint demo" },
          description: { type: "string", example: "Add charts for throughput trends" },
          status: { type: "string", enum: ["todo", "in_progress", "done"], example: "in_progress" },
          priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
          dueDate: { type: "string", format: "date-time", nullable: true },
          createdBy: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/UserSummary" }]
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80, example: "Aarav Singh" },
          email: { type: "string", format: "email", example: "aarav@example.com" },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 120,
            example: "StrongPass123!"
          }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "aarav@example.com" },
          password: { type: "string", example: "StrongPass123!" }
        }
      },
      TaskCreateInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 2, maxLength: 120, example: "Prepare sprint demo" },
          description: { type: "string", maxLength: 2000, example: "Add metrics charts and release notes." },
          status: { type: "string", enum: ["todo", "in_progress", "done"], example: "todo" },
          priority: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
          dueDate: { type: "string", format: "date-time" }
        }
      },
      TaskUpdateInput: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", minLength: 2, maxLength: 120 },
          description: { type: "string", maxLength: 2000 },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          dueDate: { type: "string", format: "date-time" }
        }
      },
      UpdateRoleInput: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["user", "admin"], example: "admin" }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: { success: false, message: "Invalid or expired token." }
          }
        }
      },
      ForbiddenError: {
        description: "Authorization failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: { success: false, message: "You are not allowed to perform this action." }
          }
        }
      },
      ValidationError: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: { success: false, message: "Validation failed.", errors: { email: ["Invalid email"] } }
          }
        }
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: { success: false, message: "Task not found." }
          }
        }
      },
      TooManyRequestsError: {
        description: "Rate limit exceeded",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: { success: false, message: "Too many requests. Please try again later." }
          }
        }
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
                example: {
                  success: true,
                  message: "User registered successfully.",
                  data: {
                    user: {
                      id: "66500b7f8ce9f886f6bb6387",
                      name: "Aarav Singh",
                      email: "aarav@example.com",
                      role: "user"
                    },
                    accessToken: "jwt-token"
                  }
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": {
            description: "Email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
                example: { success: false, message: "Email is already registered." }
              }
            }
          },
          "429": { $ref: "#/components/responses/TooManyRequestsError" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
                example: {
                  success: true,
                  message: "Login successful.",
                  data: {
                    user: {
                      id: "66500b7f8ce9f886f6bb6387",
                      name: "Aarav Singh",
                      email: "aarav@example.com",
                      role: "user"
                    },
                    accessToken: "jwt-token"
                  }
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "429": { $ref: "#/components/responses/TooManyRequestsError" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profile fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
                example: {
                  success: true,
                  message: "User profile fetched.",
                  data: {
                    id: "66500b7f8ce9f886f6bb6387",
                    name: "Aarav Singh",
                    email: "aarav@example.com",
                    role: "user"
                  }
                }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" }
        }
      }
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List tasks with search, filtering, sorting, and pagination",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "status", schema: { type: "string", enum: ["todo", "in_progress", "done"] } },
          { in: "query", name: "priority", schema: { type: "string", enum: ["low", "medium", "high"] } },
          { in: "query", name: "page", schema: { type: "integer", minimum: 1, default: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
          {
            in: "query",
            name: "sortBy",
            schema: { type: "string", enum: ["createdAt", "dueDate", "priority", "status"], default: "createdAt" }
          },
          { in: "query", name: "sortOrder", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } }
        ],
        responses: {
          "200": {
            description: "Tasks fetched successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
                example: {
                  success: true,
                  message: "Tasks fetched successfully.",
                  data: [
                    {
                      _id: "6650f1e1e30832fa6dc0af1f",
                      title: "Prepare sprint demo",
                      status: "in_progress",
                      priority: "high",
                      createdBy: {
                        _id: "66500b7f8ce9f886f6bb6387",
                        name: "Aarav Singh",
                        email: "aarav@example.com",
                        role: "user"
                      },
                      createdAt: "2026-05-08T10:00:00.000Z",
                      updatedAt: "2026-05-08T12:00:00.000Z"
                    }
                  ],
                  meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
                }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "429": { $ref: "#/components/responses/TooManyRequestsError" }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a new task",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskCreateInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/UnauthorizedError" }
        }
      }
    },
    "/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get a single task by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        responses: {
          "200": {
            description: "Task fetched successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update an existing task",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskUpdateInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        responses: {
          "200": {
            description: "Task deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      }
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Users fetched successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" }
        }
      }
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by id (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        responses: {
          "200": {
            description: "User fetched successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        responses: {
          "200": {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      }
    },
    "/users/{id}/role": {
      patch: {
        tags: ["Users"],
        summary: "Update user role (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", minLength: 24, maxLength: 24 } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRoleInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "User role updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": { $ref: "#/components/responses/ForbiddenError" },
          "404": { $ref: "#/components/responses/NotFoundError" }
        }
      }
    }
  }
} as const;
