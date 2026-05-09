import { StatusCodes } from "http-status-codes";
import { User, UserRole } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const getAllUsers = async () => {
  return User.find().select("_id name email role createdAt updatedAt").sort({ createdAt: -1 });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("_id name email role createdAt updatedAt");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
  }
  return user;
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
  }
  user.role = role;
  await user.save();
  return user;
};

export const deleteUserById = async (id: string, currentUserId: string) => {
  if (id === currentUserId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You cannot delete your own account.");
  }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
  }
  await user.deleteOne();
};
