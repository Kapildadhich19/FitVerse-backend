import type {
  StorageAdapter,
  StoredFile,
  StoredFileContent,
  UploadFileInput,
} from './storage-adapter.js';

export class CloudinaryStorageAdapter implements StorageAdapter {
  upload(_input: UploadFileInput): Promise<StoredFile> {
    throw new Error('Cloudinary storage is not configured yet.');
  }

  read(_fileUrl: string): Promise<StoredFileContent> {
    throw new Error('Cloudinary storage is not configured yet.');
  }

  delete(_fileUrl: string): Promise<void> {
    throw new Error('Cloudinary storage is not configured yet.');
  }
}
