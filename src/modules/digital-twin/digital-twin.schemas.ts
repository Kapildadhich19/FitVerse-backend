import { z } from "zod";

const genderSchema = z.enum(["FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]);
const lengthUnitSchema = z.enum(["CM", "IN"]);
const weightUnitSchema = z.enum(["KG", "LB"]);
const clothingFitSchema = z.enum(["SLIM", "REGULAR", "RELAXED", "OVERSIZED"]);

const positiveMeasurement = z.number().positive().max(400);
const positiveWeight = z.number().positive().max(800);

export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  gender: genderSchema,
  dateOfBirth: z.coerce.date().max(new Date()),
  country: z.string().trim().min(2).max(80),
  preferredLength: lengthUnitSchema,
  preferredWeight: weightUnitSchema
});

export const measurementsSchema = z.object({
  height: positiveMeasurement,
  weight: positiveWeight,
  chest: positiveMeasurement,
  waist: positiveMeasurement,
  hip: positiveMeasurement,
  shoulderWidth: positiveMeasurement,
  neck: positiveMeasurement,
  armLength: positiveMeasurement,
  forearm: positiveMeasurement,
  wrist: positiveMeasurement,
  thigh: positiveMeasurement,
  calf: positiveMeasurement,
  inseam: positiveMeasurement,
  footLength: positiveMeasurement,
  lengthUnit: lengthUnitSchema,
  weightUnit: weightUnitSchema
});

export const appearanceSchema = z.object({
  skinTone: z.string().trim().min(1).max(60),
  hairColor: z.string().trim().min(1).max(60),
  hairStyle: z.string().trim().min(1).max(80),
  eyeColor: z.string().trim().min(1).max(60),
  facialHair: z.string().trim().min(1).max(80),
  bodyType: z.string().trim().min(1).max(80),
  preferredClothingFit: clothingFitSchema
});

export const completeDigitalTwinSchema = z.object({
  profile: profileSchema,
  measurements: measurementsSchema,
  appearance: appearanceSchema
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type MeasurementsInput = z.infer<typeof measurementsSchema>;
export type AppearanceInput = z.infer<typeof appearanceSchema>;
export type CompleteDigitalTwinInput = z.infer<typeof completeDigitalTwinSchema>;
