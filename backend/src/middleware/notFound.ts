import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createErrorResponse } from "../utils/apiResponse";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).json(createErrorResponse(`Route ${req.originalUrl} not found.`));
};
