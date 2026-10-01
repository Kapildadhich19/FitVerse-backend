import { logger } from '../../infrastructure/logger/logger.js';
import { AppError } from '../../shared/errors/app-error.js';
import { avatarRepository } from './avatar.repository.js';
import { avatarStorage } from './storage/avatar-storage.js';
import { avatarGenerationClient } from './avatar-generation.client.js';
import type { UploadAvatarPhotoInput } from './avatar.schemas.js';

const requiredPhotoTypes = ['front', 'right', 'back', 'left'] as const;

async function getOrCreateAvatar(userId: string) {
  const avatar = await avatarRepository.findCurrentByUser(userId);

  if (avatar) {
    return avatar;
  }

  return avatarRepository.create({
    userId,
    status: 'queued',
    thumbnailUrl: null,
    modelUrl: null,
  });
}

export const avatarService = {
  get(userId: string) {
    return avatarRepository.findCurrentByUser(userId);
  },

  async uploadPhoto(
    userId: string,
    input: UploadAvatarPhotoInput,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new AppError(400, 'Photo file is required', 'PHOTO_REQUIRED');
    }

    const avatar = await getOrCreateAvatar(userId);
    const existingPhoto = avatar.photos.find(
      (photo) => photo.type === input.type,
    );
    const storedFile = await avatarStorage.upload({
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
      folder: `avatars/${userId}/${avatar.id}`,
    });

    const photo = await avatarRepository.upsertPhoto({
      avatarId: avatar.id,
      type: input.type,
      fileUrl: storedFile.url,
    });

    if (existingPhoto) {
      await avatarStorage.delete(existingPhoto.fileUrl);
    }

    logger.info(
      { userId, avatarId: avatar.id, photoType: input.type },
      'Avatar photo uploaded',
    );
    return {
      avatar: await avatarRepository.findCurrentByUser(userId),
      photo,
    };
  },

  async deletePhoto(userId: string, photoId: string) {
    const photo = await avatarRepository.findPhotoById(photoId);

    if (!photo || photo.avatar.userId !== userId) {
      throw new AppError(
        404,
        'Avatar photo not found',
        'AVATAR_PHOTO_NOT_FOUND',
      );
    }

    await avatarRepository.deletePhoto(photo.id);
    await avatarStorage.delete(photo.fileUrl);
    logger.info(
      { userId, avatarId: photo.avatarId, photoId },
      'Avatar photo deleted',
    );

    return avatarRepository.findCurrentByUser(userId);
  },

  async queueGeneration(userId: string) {
    const avatar = await getOrCreateAvatar(userId);
    const uploadedTypes = new Set(avatar.photos.map((photo) => photo.type));
    const missingTypes = requiredPhotoTypes.filter(
      (type) => !uploadedTypes.has(type),
    );

    if (missingTypes.length > 0) {
      throw new AppError(
        400,
        `Missing avatar photos: ${missingTypes.join(', ')}`,
        'AVATAR_PHOTOS_INCOMPLETE',
      );
    }

    if (avatar.status === 'processing' && avatar.generationTaskId) {
      return avatar;
    }

    const images = {} as Record<(typeof requiredPhotoTypes)[number], string>;
    for (const photoType of requiredPhotoTypes) {
      const photo = avatar.photos.find((item) => item.type === photoType);
      if (!photo) {
        throw new AppError(
          400,
          `Missing avatar photo: ${photoType}`,
          'AVATAR_PHOTOS_INCOMPLETE',
        );
      }

      const file = await avatarStorage.read(photo.fileUrl);
      images[photoType] =
        `data:${file.mimeType};base64,${file.buffer.toString('base64')}`;
    }

    const generation = await avatarGenerationClient.create(images);
    logger.info(
      { userId, avatarId: avatar.id, taskId: generation.taskId },
      'Avatar generation started',
    );
    return avatarRepository.updateGeneration(avatar.id, {
      status: 'processing',
      generationTaskId: generation.taskId,
      modelUrl: null,
      thumbnailUrl: null,
    });
  },

  async status(userId: string) {
    let avatar = await avatarRepository.findCurrentByUser(userId);

    if (avatar?.status === 'processing' && avatar.generationTaskId) {
      const generation = await avatarGenerationClient.status(
        avatar.generationTaskId,
      );

      if (generation.status === 'failed') {
        avatar = await avatarRepository.updateGeneration(avatar.id, {
          status: 'failed',
        });
        logger.error(
          { userId, avatarId: avatar.id, error: generation.error },
          'Avatar generation failed',
        );
      } else if (generation.status === 'completed') {
        const model = await avatarGenerationClient.artifact(
          avatar.generationTaskId,
          'model',
        );
        const storedModel = await avatarStorage.upload({
          ...model,
          originalName: model.fileName,
          folder: `avatars/${userId}/${avatar.id}`,
        });

        let thumbnailUrl: string | null = null;
        try {
          const thumbnail = await avatarGenerationClient.artifact(
            avatar.generationTaskId,
            'thumbnail',
          );
          const storedThumbnail = await avatarStorage.upload({
            ...thumbnail,
            originalName: thumbnail.fileName,
            folder: `avatars/${userId}/${avatar.id}`,
          });
          thumbnailUrl = storedThumbnail.url;
        } catch (error) {
          logger.warn(
            { error, userId, avatarId: avatar.id },
            'Avatar thumbnail could not be stored',
          );
        }

        avatar = await avatarRepository.updateGeneration(avatar.id, {
          status: 'completed',
          modelUrl: storedModel.url,
          thumbnailUrl,
        });
        logger.info(
          { userId, avatarId: avatar.id },
          'Avatar generation completed',
        );
      }
    }

    return {
      status: avatar?.status ?? 'queued',
      avatar,
    };
  },
};
