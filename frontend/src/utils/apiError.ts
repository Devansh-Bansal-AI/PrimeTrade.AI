import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const data = error.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
      const messages: string[] = [];
      Object.values(data.errors).forEach(errArray => {
        if (Array.isArray(errArray)) {
          messages.push(...errArray);
        }
      });
      if (messages.length > 0) {
        return `${data.message || 'Error'}: ${messages.join(" ")}`;
      }
    }
    return data?.message ?? fallback;
  }
  return fallback;
};
