import type { RequestHandler } from "express";

import { asyncHandler } from "../../shared/http/async-handler.js";
import type { AuthenticatedRequest } from "../../shared/middleware/authenticated-request.js";
import { uploadAvatarPhotoSchema, type UploadAvatarPhotoInput } from "./avatar.schemas.js";
import { avatarService } from "./avatar.service.js";
import { AppError } from "../../shared/errors/app-error.js";

export const getAvatar: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const avatar = await avatarService.get(authRequest.user.id);
  response.json({ avatar });
});

export const uploadAvatarPhoto: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const input = uploadAvatarPhotoSchema.parse(request.body) as UploadAvatarPhotoInput;
  const result = await avatarService.uploadPhoto(authRequest.user.id, input, request.file);
  response.status(201).json(result);
});

export const deleteAvatarPhoto: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const photoId = request.params.id;

  if (typeof photoId !== "string" || photoId.length === 0) {
    throw new AppError(400, "Avatar photo id is required", "AVATAR_PHOTO_ID_REQUIRED");
  }

  const avatar = await avatarService.deletePhoto(authRequest.user.id, photoId);
  response.json({ avatar });
});

export const queueAvatarGeneration: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const avatar = await avatarService.queueGeneration(authRequest.user.id);
  response.status(202).json({ avatar });
});

export const getAvatarStatus: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const result = await avatarService.status(authRequest.user.id);
  response.json(result);
});
