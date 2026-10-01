import type { CookieOptions, Response } from "express";

import { env } from "../../config/env.js";

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth"
};

export function setRefreshTokenCookie(response: Response, token: string, expiresAt: Date) {
  response.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, {
    ...refreshTokenCookieOptions,
    expires: expiresAt
  });
}

export function clearRefreshTokenCookie(response: Response) {
  response.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions);
}

export function getRefreshTokenCookie(cookies: Record<string, unknown>) {
  const token = cookies[env.REFRESH_TOKEN_COOKIE_NAME];
  return typeof token === "string" ? token : null;
}
