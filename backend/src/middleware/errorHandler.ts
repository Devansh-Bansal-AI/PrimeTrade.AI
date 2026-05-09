import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { createErrorResponse } from "../utils/apiResponse";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(createErrorResponse(err.message));
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json(createErrorResponse("Validation failed.", err.flatten().fieldErrors));
    return;
  }

  if (err instanceof MongooseError.ValidationError) {
    res.status(400).json(createErrorResponse("Database validation failed.", Object.values(err.errors).map((item) => item.message)));
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error.";
  if (env.NODE_ENV !== "test") {
    console.error(err);
  }
  res.status(500).json(createErrorResponse(message));
};
