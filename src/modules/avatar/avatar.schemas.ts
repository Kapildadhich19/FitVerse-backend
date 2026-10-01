import { z } from "zod";

export const avatarPhotoTypeSchema = z.enum(["front", "left", "right", "back"]);

export const uploadAvatarPhotoSchema = z.object({
  type: avatarPhotoTypeSchema
});

export type AvatarPhotoTypeInput = z.infer<typeof avatarPhotoTypeSchema>;
export type UploadAvatarPhotoInput = z.infer<typeof uploadAvatarPhotoSchema>;
