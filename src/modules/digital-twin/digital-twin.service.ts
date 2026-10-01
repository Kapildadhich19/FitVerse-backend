import { AppError } from "../../shared/errors/app-error.js";
import { digitalTwinRepository } from "./digital-twin.repository.js";
import type {
  AppearanceInput,
  CompleteDigitalTwinInput,
  MeasurementsInput,
  ProfileInput
} from "./digital-twin.schemas.js";

async function getRequiredProfile(userId: string) {
  const profile = await digitalTwinRepository.findByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Create basic information before continuing onboarding", "DIGITAL_TWIN_PROFILE_REQUIRED");
  }

  return profile;
}

export const digitalTwinService = {
  get(userId: string) {
    return digitalTwinRepository.findByUserId(userId);
  },

  saveProfile(userId: string, input: ProfileInput) {
    return digitalTwinRepository.upsertProfile(userId, {
      firstName: input.firstName,
      lastName: input.lastName,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      country: input.country,
      preferredLength: input.preferredLength,
      preferredWeight: input.preferredWeight
    });
  },

  async saveMeasurements(userId: string, input: MeasurementsInput) {
    const profile = await getRequiredProfile(userId);
    await digitalTwinRepository.upsertMeasurements(profile.id, input);
    return digitalTwinRepository.findByUserId(userId);
  },

  async saveAppearance(userId: string, input: AppearanceInput) {
    const profile = await getRequiredProfile(userId);
    await digitalTwinRepository.upsertAppearance(profile.id, input);
    return digitalTwinRepository.findByUserId(userId);
  },

  async complete(userId: string, input: CompleteDigitalTwinInput) {
    const profile = await digitalTwinRepository.upsertProfile(userId, {
      ...input.profile,
      completedAt: new Date()
    });

    await digitalTwinRepository.upsertMeasurements(profile.id, input.measurements);
    await digitalTwinRepository.upsertAppearance(profile.id, input.appearance);

    return digitalTwinRepository.findByUserId(userId);
  }
};
