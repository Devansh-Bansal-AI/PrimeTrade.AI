import { z } from "zod";

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().length(24)
  })
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().length(24)
  }),
  body: z.object({
    role: z.enum(["user", "admin"])
  })
});
