import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
