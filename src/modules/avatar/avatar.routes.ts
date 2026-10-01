import { Router } from "express";

import { requireAuth } from "../../shared/middleware/require-auth.js";
import { avatarUpload } from "../../shared/uploads/avatar-upload.js";
import {
  deleteAvatarPhoto,
  getAvatar,
  getAvatarStatus,
  queueAvatarGeneration,
  uploadAvatarPhoto
} from "./avatar.controller.js";

export const avatarRouter = Router();

avatarRouter.use(requireAuth);
avatarRouter.get("/", getAvatar);
avatarRouter.post("/photos", avatarUpload.single("photo"), uploadAvatarPhoto);
avatarRouter.delete("/photos/:id", deleteAvatarPhoto);
avatarRouter.post("/generate", queueAvatarGeneration);
avatarRouter.get("/status", getAvatarStatus);
