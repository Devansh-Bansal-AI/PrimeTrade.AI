import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { sanitizeObject } from "../utils/sanitize";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const sanitizedBody = sanitizeObject(req.body);
    const sanitizedQuery = sanitizeObject(req.query);
    const sanitizedParams = sanitizeObject(req.params);
    const parsed = schema.safeParse({
      body: sanitizedBody,
      query: sanitizedQuery,
      params: sanitizedParams
    });

    if (!parsed.success) {
      throw parsed.error;
    }

    req.body = parsed.data.body ?? {};
    req.query = parsed.data.query ?? {};
    req.params = parsed.data.params ?? {};
    next();
  };
