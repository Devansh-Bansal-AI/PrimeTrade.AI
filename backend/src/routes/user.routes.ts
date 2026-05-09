import { Router } from "express";
import {
  deleteUserController,
  getSingleUserController,
  getUsersController,
  updateUserRoleController
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { updateRoleSchema, userIdSchema } from "../validators/user.validator";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/", getUsersController);
router.get("/:id", validate(userIdSchema), getSingleUserController);
router.patch("/:id/role", validate(updateRoleSchema), updateUserRoleController);
router.delete("/:id", validate(userIdSchema), deleteUserController);

export default router;
