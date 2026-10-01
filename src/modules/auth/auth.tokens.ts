import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import { env } from "../../config/env.js";

type TokenUser = {
  id: string;
  email: string;
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  jti: string;
};

export function signAccessToken(user: TokenUser) {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as Exclude<SignOptions["expiresIn"], undefined>;

  return jwt.sign(
    {
      email: user.email
    },
    env.JWT_ACCESS_SECRET,
    {
      subject: user.id,
      expiresIn
    }
  );
}

export function signRefreshToken(user: TokenUser) {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN as Exclude<SignOptions["expiresIn"], undefined>;
  const tokenId = randomUUID();
  const token = jwt.sign(
    {
      email: user.email
    },
    env.JWT_REFRESH_SECRET,
    {
      subject: user.id,
      jwtid: tokenId,
      expiresIn
    }
  );

  return { token, tokenId };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
