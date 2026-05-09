export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export const createResponse = <T>(
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta
});

export const createErrorResponse = (message: string, errors?: unknown): ApiErrorResponse => ({
  success: false,
  message,
  ...(errors ? { errors } : {})
});
