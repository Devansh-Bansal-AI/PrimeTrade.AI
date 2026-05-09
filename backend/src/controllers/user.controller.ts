import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { deleteUserById, getAllUsers, getUserById, updateUserRole } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createResponse } from "../utils/apiResponse";

export const getUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(StatusCodes.OK).json(createResponse("Users fetched successfully.", users));
});

export const getSingleUserController = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  res.status(StatusCodes.OK).json(createResponse("User fetched successfully.", user));
});

export const updateUserRoleController = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserRole(req.params.id, req.body.role);
  res.status(StatusCodes.OK).json(createResponse("User role updated successfully.", user));
});

export const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.user!._id.toString();
  await deleteUserById(req.params.id, currentUserId);
  res.status(StatusCodes.OK).json(createResponse("User deleted successfully."));
});
