import type { AvatarStatus, Prisma } from '@prisma/client';

import { prisma } from '../../infrastructure/database/prisma.js';

export const avatarRepository = {
  findCurrentByUser(userId: string) {
    return prisma.avatar.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  create(data: Prisma.AvatarUncheckedCreateInput) {
    return prisma.avatar.create({
      data,
      include: {
        photos: true,
      },
    });
  },

  upsertPhoto(data: Prisma.AvatarPhotoUncheckedCreateInput) {
    return prisma.avatarPhoto.upsert({
      where: {
        avatarId_type: {
          avatarId: data.avatarId,
          type: data.type,
        },
      },
      create: data,
      update: {
        fileUrl: data.fileUrl,
      },
    });
  },

  findPhotoById(id: string) {
    return prisma.avatarPhoto.findUnique({
      where: { id },
      include: {
        avatar: true,
      },
    });
  },

  deletePhoto(id: string) {
    return prisma.avatarPhoto.delete({
      where: { id },
    });
  },

  updateStatus(id: string, status: AvatarStatus) {
    return prisma.avatar.update({
      where: { id },
      data: { status },
      include: {
        photos: true,
      },
    });
  },

  updateGeneration(id: string, data: Prisma.AvatarUncheckedUpdateInput) {
    return prisma.avatar.update({
      where: { id },
      data,
      include: {
        photos: true,
      },
    });
  },
};
