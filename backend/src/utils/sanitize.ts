const sanitizeString = (value: string): string =>
  value
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();

const isSafeKey = (key: string): boolean => !key.startsWith("$") && !key.includes(".");

export const sanitizeObject = <T>(input: T): T => {
  if (typeof input === "string") {
    return sanitizeString(input) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item)) as T;
  }

  if (input && typeof input === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (!isSafeKey(key)) {
        continue;
      }
      result[key] = sanitizeObject(value);
    }
    return result as T;
  }

  return input;
};
