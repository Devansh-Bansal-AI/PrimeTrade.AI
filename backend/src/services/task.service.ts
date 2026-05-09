import { FilterQuery, SortOrder } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ITaskDocument, Task, TaskPriority, TaskStatus } from "../models/Task";
import { ApiError } from "../utils/ApiError";
import { escapeRegex } from "../utils/escapeRegex";

type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
};

type TaskUpdate = Partial<TaskInput>;

type ListTaskOptions = {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  limit: number;
  sortBy: "createdAt" | "dueDate" | "priority" | "status";
  sortOrder: "asc" | "desc";
};

export const createTask = async (createdBy: string, payload: TaskInput): Promise<ITaskDocument> => {
  return Task.create({ ...payload, createdBy });
};

export const getTaskById = async (taskId: string, userId: string, role: "user" | "admin"): Promise<ITaskDocument> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found.");
  }

  if (role !== "admin" && task.createdBy.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You can only access your own tasks.");
  }

  await task.populate("createdBy", "name email role");
  return task;
};

export const listTasks = async (
  userId: string,
  role: "user" | "admin",
  options: ListTaskOptions
): Promise<{ items: ITaskDocument[]; total: number; page: number; limit: number; totalPages: number }> => {
  const filter: FilterQuery<ITaskDocument> = {};

  if (role !== "admin") {
    filter.createdBy = userId;
  }

  if (options.status) {
    filter.status = options.status;
  }
  if (options.priority) {
    filter.priority = options.priority;
  }
  const searchValue = options.search?.trim();
  if (searchValue) {
    const safeSearch = escapeRegex(searchValue);
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } }
    ];
  }

  const sort: Record<string, SortOrder> = { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 };
  const skip = (options.page - 1) * options.limit;

  const [items, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(options.limit).populate("createdBy", "name email role"),
    Task.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit)
  };
};

export const updateTask = async (
  taskId: string,
  userId: string,
  role: "user" | "admin",
  payload: TaskUpdate
): Promise<ITaskDocument> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found.");
  }

  if (role !== "admin" && task.createdBy.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You can only update your own tasks.");
  }

  Object.assign(task, payload);
  await task.save();
  return task;
};

export const deleteTask = async (taskId: string, userId: string, role: "user" | "admin"): Promise<void> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found.");
  }

  if (role !== "admin" && task.createdBy.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You can only delete your own tasks.");
  }

  await task.deleteOne();
};
