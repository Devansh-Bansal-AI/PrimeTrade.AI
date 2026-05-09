import rateLimit from "express-rate-limit";
import { createErrorResponse } from "../utils/apiResponse";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(createErrorResponse("Too many auth requests. Please try again later."));
  }
});

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(createErrorResponse("Too many requests. Please try again later."));
  }
});
