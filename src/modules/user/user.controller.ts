import type { RequestHandler } from "express";

import { asyncHandler } from "../../shared/http/async-handler.js";
import type { AuthenticatedRequest } from "../../shared/middleware/authenticated-request.js";
import { userService } from "./user.service.js";

export const getCurrentUser: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const user = await userService.getCurrentUser(authRequest.user.id);
  response.json({ user });
});
