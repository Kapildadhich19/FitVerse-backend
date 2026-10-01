import type { RequestHandler } from "express";

import { asyncHandler } from "../../shared/http/async-handler.js";
import type { AuthenticatedRequest } from "../../shared/middleware/authenticated-request.js";
import { clearRefreshTokenCookie, getRefreshTokenCookie, setRefreshTokenCookie } from "./auth.cookies.js";
import { authService } from "./auth.service.js";
import type { LoginUserInput, RegisterUserInput } from "./auth.schemas.js";

export const register: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.register(request.body as RegisterUserInput);
  setRefreshTokenCookie(response, result.refreshToken, result.refreshTokenExpiresAt);
  response.status(201).json({
    user: result.user,
    accessToken: result.accessToken
  });
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.login(request.body as LoginUserInput);
  setRefreshTokenCookie(response, result.refreshToken, result.refreshTokenExpiresAt);
  response.json({
    user: result.user,
    accessToken: result.accessToken
  });
});

export const refresh: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.refresh(getRefreshTokenCookie(request.cookies as Record<string, unknown>));
  setRefreshTokenCookie(response, result.refreshToken, result.refreshTokenExpiresAt);
  response.json({
    user: result.user,
    accessToken: result.accessToken
  });
});

export const logout: RequestHandler = asyncHandler(async (request, response) => {
  await authService.logout(getRefreshTokenCookie(request.cookies as Record<string, unknown>));
  clearRefreshTokenCookie(response);
  response.status(204).send();
});

export const me: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const result = await authService.me(authRequest.user.id);
  response.json(result);
});
