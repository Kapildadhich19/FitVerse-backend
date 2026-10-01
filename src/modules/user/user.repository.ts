import type { Prisma } from "@prisma/client";

import { prisma } from "../../infrastructure/database/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }
};
