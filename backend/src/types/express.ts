import { IUserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUserDocument, "_id" | "email" | "name" | "role">;
    }
  }
}

export {};
