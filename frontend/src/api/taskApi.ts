import { api } from "./client";
import { ApiResponse, Task, TaskPriority, TaskQuery, TaskStatus } from "../types";

export type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
};

export type TaskListPayload = {
  items: Task[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const taskApi = {
  list: async (query: TaskQuery): Promise<TaskListPayload> => {
    const params = {
      ...(query.search?.trim() ? { search: query.search.trim() } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.page ? { page: query.page } : {}),
      ...(query.limit ? { limit: query.limit } : {})
    };
    const response = await api.get<ApiResponse<Task[]>>("/tasks", { params });
    return { items: response.data.data, meta: response.data.meta };
  },
  create: async (payload: TaskInput): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", payload);
    return response.data.data;
  },
  update: async (taskId: string, payload: TaskInput): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
    return response.data.data;
  },
  remove: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  }
};
