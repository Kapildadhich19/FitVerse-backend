import type { Prisma } from "@prisma/client";

import { prisma } from "../../infrastructure/database/prisma.js";

export const productRepository = {
  listByUser(userId: string) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data });
  }
};
