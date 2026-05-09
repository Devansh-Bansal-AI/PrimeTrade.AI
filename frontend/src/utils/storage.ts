const TOKEN_KEY = "task_workspace_token";
const USER_KEY = "task_workspace_user";

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),
  getUser: (): string | null => localStorage.getItem(USER_KEY),
  setUser: (value: string): void => localStorage.setItem(USER_KEY, value),
  clearUser: (): void => localStorage.removeItem(USER_KEY)
};
