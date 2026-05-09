import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getSingleTaskController,
  updateTaskController
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from "../validators/task.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), createTaskController);
router.get("/", validate(listTasksSchema), getAllTasksController);
router.get("/:id", validate(taskIdSchema), getSingleTaskController);
router.patch("/:id", validate(updateTaskSchema), updateTaskController);
router.delete("/:id", validate(taskIdSchema), deleteTaskController);

export default router;
