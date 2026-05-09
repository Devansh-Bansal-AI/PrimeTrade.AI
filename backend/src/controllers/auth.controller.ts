import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginUser, registerUser } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createResponse } from "../utils/apiResponse";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(StatusCodes.CREATED).json(createResponse("User registered successfully.", result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(StatusCodes.OK).json(createResponse("Login successful.", result));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  res.status(StatusCodes.OK).json(
    createResponse("User profile fetched.", {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    })
  );
});
