import { api } from "./client";
import { ApiResponse, AuthPayload, AuthUser } from "../types";

type RegisterInput = { name: string; email: string; password: string };
type LoginInput = { email: string; password: string };

export const authApi = {
  register: async (payload: RegisterInput): Promise<AuthPayload> => {
    const response = await api.post<ApiResponse<AuthPayload>>("/auth/register", payload);
    return response.data.data;
  },
  login: async (payload: LoginInput): Promise<AuthPayload> => {
    const response = await api.post<ApiResponse<AuthPayload>>("/auth/login", payload);
    return response.data.data;
  },
  me: async (): Promise<AuthUser> => {
    const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
    return response.data.data;
  }
};
