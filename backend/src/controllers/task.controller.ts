import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createTask, deleteTask, getTaskById, listTasks, updateTask } from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createResponse } from "../utils/apiResponse";

export const createTaskController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const task = await createTask(user._id.toString(), req.body);
  res.status(StatusCodes.CREATED).json(createResponse("Task created successfully.", task));
});

export const getSingleTaskController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const task = await getTaskById(req.params.id, user._id.toString(), user.role);
  res.status(StatusCodes.OK).json(createResponse("Task fetched successfully.", task));
});

export const getAllTasksController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await listTasks(user._id.toString(), user.role, {
    search: req.query.search as string | undefined,
    status: req.query.status as "todo" | "in_progress" | "done" | undefined,
    priority: req.query.priority as "low" | "medium" | "high" | undefined,
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    sortBy: (req.query.sortBy as "createdAt" | "dueDate" | "priority" | "status") ?? "createdAt",
    sortOrder: (req.query.sortOrder as "asc" | "desc") ?? "desc"
  });

  res.status(StatusCodes.OK).json(
    createResponse("Tasks fetched successfully.", result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    })
  );
});

export const updateTaskController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const task = await updateTask(req.params.id, user._id.toString(), user.role, req.body);
  res.status(StatusCodes.OK).json(createResponse("Task updated successfully.", task));
});

export const deleteTaskController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  await deleteTask(req.params.id, user._id.toString(), user.role);
  res.status(StatusCodes.OK).json(createResponse("Task deleted successfully."));
});
