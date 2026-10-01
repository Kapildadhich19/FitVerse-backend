import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

type AccessTokenPayload = {
  sub: string;
  email: string;
};

function isAccessTokenPayload(payload: JwtPayload | string): payload is AccessTokenPayload {
  return typeof payload === "object" && typeof payload.sub === "string" && typeof payload.email === "string";
}

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (!isAccessTokenPayload(payload)) {
      next(new AppError(401, "Invalid or expired token", "INVALID_TOKEN"));
      return;
    }

    Object.assign(request, {
      user: {
        id: payload.sub,
        email: payload.email
      }
    });
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token", "INVALID_TOKEN"));
  }
}
