import type { Prisma } from "@prisma/client";

import { prisma } from "../../infrastructure/database/prisma.js";

const digitalTwinInclude = {
  measurements: true,
  appearance: true
} satisfies Prisma.DigitalTwinProfileInclude;

export const digitalTwinRepository = {
  findByUserId(userId: string) {
    return prisma.digitalTwinProfile.findUnique({
      where: { userId },
      include: digitalTwinInclude
    });
  },

  upsertProfile(userId: string, data: Omit<Prisma.DigitalTwinProfileUncheckedCreateInput, "userId">) {
    return prisma.digitalTwinProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data
      },
      update: data,
      include: digitalTwinInclude
    });
  },

  upsertMeasurements(profileId: string, data: Omit<Prisma.DigitalTwinMeasurementsUncheckedCreateInput, "profileId">) {
    return prisma.digitalTwinMeasurements.upsert({
      where: { profileId },
      create: {
        profileId,
        ...data
      },
      update: data
    });
  },

  upsertAppearance(profileId: string, data: Omit<Prisma.DigitalTwinAppearanceUncheckedCreateInput, "profileId">) {
    return prisma.digitalTwinAppearance.upsert({
      where: { profileId },
      create: {
        profileId,
        ...data
      },
      update: data
    });
  },

  complete(userId: string, input: Prisma.DigitalTwinProfileUncheckedCreateInput) {
    return prisma.$transaction(async (transaction) => {
      const profile = await transaction.digitalTwinProfile.upsert({
        where: { userId },
        create: input,
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
          country: input.country,
          preferredLength: input.preferredLength,
          preferredWeight: input.preferredWeight,
          completedAt: new Date()
        }
      });

      return transaction.digitalTwinProfile.findUniqueOrThrow({
        where: { id: profile.id },
        include: digitalTwinInclude
      });
    });
  }
};
