import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

export const authorizeRoles =
  (...roles: Array<"user" | "admin">) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication is required.");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not allowed to perform this action.");
    }

    next();
  };
