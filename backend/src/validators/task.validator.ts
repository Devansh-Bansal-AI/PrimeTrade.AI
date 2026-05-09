import { z } from "zod";

const taskStatus = z.enum(["todo", "in_progress", "done"]);
const taskPriority = z.enum(["low", "medium", "high"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().max(2000).optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    dueDate: z.coerce.date().optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().length(24)
  }),
  body: z
    .object({
      title: z.string().min(2).max(120).optional(),
      description: z.string().max(2000).optional(),
      status: taskStatus.optional(),
      priority: taskPriority.optional(),
      dueDate: z.coerce.date().optional()
    })
    .refine((value) => Object.keys(value).length > 0, "At least one field is required.")
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().length(24)
  })
});

export const listTasksSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(["createdAt", "dueDate", "priority", "status"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc")
  })
});
