import type { Prisma } from "@prisma/client";

import { prisma } from "../../infrastructure/database/prisma.js";

export const authRepository = {
  createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
      where: { id },
      include: { user: true }
    });
  },

  revokeRefreshToken(id: string) {
    return prisma.refreshToken.updateMany({
      where: {
        id,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  },

  async rotateRefreshToken(oldTokenId: string, newToken: Prisma.RefreshTokenUncheckedCreateInput) {
    return prisma.$transaction(async (transaction) => {
      await transaction.refreshToken.updateMany({
        where: {
          id: oldTokenId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });

      return transaction.refreshToken.create({
        data: newToken
      });
    });
  }
};
