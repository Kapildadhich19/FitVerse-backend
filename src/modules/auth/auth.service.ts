import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { logger } from "../../infrastructure/logger/logger.js";
import { AppError } from "../../shared/errors/app-error.js";
import { authRepository } from "./auth.repository.js";
import { addDurationToNow } from "./auth.duration.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./auth.tokens.js";
import type { LoginUserInput, RegisterUserInput } from "./auth.schemas.js";
import { userRepository } from "../user/user.repository.js";

function toAuthUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function createSession(user: { id: string; email: string; name: string }) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenExpiresAt = addDurationToNow(env.JWT_REFRESH_EXPIRES_IN);

  await authRepository.createRefreshToken({
    id: refreshToken.tokenId,
    userId: user.id,
    tokenHash: await bcrypt.hash(refreshToken.token, 12),
    expiresAt: refreshTokenExpiresAt
  });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken: refreshToken.token,
    refreshTokenExpiresAt
  };
}

export const authService = {
  async register(input: RegisterUserInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, "A user with this email already exists", "EMAIL_IN_USE");
    }

    const password = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password
    });

    logger.info({ userId: user.id }, "User registered");
    return createSession(user);
  },

  async login(input: LoginUserInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    logger.info({ userId: user.id }, "User logged in");
    return createSession(user);
  },

  async refresh(refreshToken: string | null) {
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required", "REFRESH_TOKEN_REQUIRED");
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const persistedToken = await authRepository.findRefreshTokenById(payload.jti);

      if (!persistedToken || persistedToken.revokedAt || persistedToken.expiresAt <= new Date()) {
        throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
      }

      const tokenMatches = await bcrypt.compare(refreshToken, persistedToken.tokenHash);

      if (!tokenMatches) {
        throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
      }

      const nextRefreshToken = signRefreshToken(persistedToken.user);
      const nextRefreshTokenExpiresAt = addDurationToNow(env.JWT_REFRESH_EXPIRES_IN);

      await authRepository.rotateRefreshToken(payload.jti, {
        id: nextRefreshToken.tokenId,
        userId: persistedToken.userId,
        tokenHash: await bcrypt.hash(nextRefreshToken.token, 12),
        expiresAt: nextRefreshTokenExpiresAt
      });

      logger.info({ userId: persistedToken.userId }, "Refresh token rotated");

      return {
        user: toAuthUser(persistedToken.user),
        accessToken: signAccessToken(persistedToken.user),
        refreshToken: nextRefreshToken.token,
        refreshTokenExpiresAt: nextRefreshTokenExpiresAt
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
      }

      throw error;
    }
  },

  async logout(refreshToken: string | null) {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      await authRepository.revokeRefreshToken(payload.jti);
      logger.info({ userId: payload.sub }, "User logged out");
    } catch (error) {
      if (!(error instanceof jwt.JsonWebTokenError)) {
        throw error;
      }
    }
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return {
      user: toAuthUser(user)
    };
  }
};
