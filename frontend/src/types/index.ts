export type Role = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthPayload {
  user: AuthUser;
  accessToken: string;
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdBy:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        role: Role;
      };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  page?: number;
  limit?: number;
}
