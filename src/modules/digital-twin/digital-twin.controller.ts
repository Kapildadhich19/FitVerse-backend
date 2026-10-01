import type { RequestHandler } from "express";

import { asyncHandler } from "../../shared/http/async-handler.js";
import type { AuthenticatedRequest } from "../../shared/middleware/authenticated-request.js";
import { digitalTwinService } from "./digital-twin.service.js";
import type {
  AppearanceInput,
  CompleteDigitalTwinInput,
  MeasurementsInput,
  ProfileInput
} from "./digital-twin.schemas.js";

export const getDigitalTwin: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const digitalTwin = await digitalTwinService.get(authRequest.user.id);
  response.json({ digitalTwin });
});

export const saveProfile: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const digitalTwin = await digitalTwinService.saveProfile(authRequest.user.id, request.body as ProfileInput);
  response.json({ digitalTwin });
});

export const saveMeasurements: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const digitalTwin = await digitalTwinService.saveMeasurements(authRequest.user.id, request.body as MeasurementsInput);
  response.json({ digitalTwin });
});

export const saveAppearance: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const digitalTwin = await digitalTwinService.saveAppearance(authRequest.user.id, request.body as AppearanceInput);
  response.json({ digitalTwin });
});

export const completeDigitalTwin: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const digitalTwin = await digitalTwinService.complete(authRequest.user.id, request.body as CompleteDigitalTwinInput);
  response.json({ digitalTwin });
});
