import { Router } from "express";

import { validateBody } from "../../shared/http/validate-request.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import { login, logout, me, refresh, register } from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refresh);
authRouter.get("/me", requireAuth, me);
