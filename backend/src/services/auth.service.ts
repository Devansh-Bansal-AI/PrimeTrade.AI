import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { IUserDocument, User } from "../models/User";
import { ApiError } from "../utils/ApiError";

type AuthPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
  accessToken: string;
};

const signToken = (user: IUserDocument): string => {
  const signOptions: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign({ userId: user._id.toString(), role: user.role }, env.JWT_SECRET, signOptions);
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthPayload> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "Email is already registered.");
  }

  const user = await User.create(payload);
  const accessToken = signToken(user);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken
  };
};

export const loginUser = async (payload: { email: string; password: string }): Promise<AuthPayload> => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(payload.password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password.");
  }

  const accessToken = signToken(user);
  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken
  };
};
