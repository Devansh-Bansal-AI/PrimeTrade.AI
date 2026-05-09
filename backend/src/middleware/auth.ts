import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

type TokenPayload = JwtPayload & { userId: string; role: "user" | "admin" };

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication token is missing.");
  }

  const token = authHeader.split(" ")[1];
  let decoded: TokenPayload;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.userId).select("_id name email role");
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User account not found.");
  }

  req.user = user;
  next();
});
