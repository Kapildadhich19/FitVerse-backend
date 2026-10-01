import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import type {
  StorageAdapter,
  StoredFile,
  UploadFileInput,
} from './storage-adapter.js';

const uploadsRoot = path.resolve(process.cwd(), 'uploads');

function getExtension(originalName: string, mimeType: string) {
  const extension = path.extname(originalName);

  if (extension) {
    return extension.toLowerCase();
  }

  return mimeType === 'image/png' ? '.png' : '.jpg';
}

export class LocalStorageAdapter implements StorageAdapter {
  async upload(input: UploadFileInput): Promise<StoredFile> {
    const folder = input.folder.replace(/[^a-zA-Z0-9/_-]/g, '');
    const targetDirectory = path.join(uploadsRoot, folder);
    await mkdir(targetDirectory, { recursive: true });

    const fileName = `${randomUUID()}${getExtension(input.originalName, input.mimeType)}`;
    const absolutePath = path.join(targetDirectory, fileName);
    await writeFile(absolutePath, input.buffer);

    const key = path.posix.join(folder.replaceAll('\\', '/'), fileName);

    return {
      key,
      url: `/uploads/${key}`,
    };
  }

  async read(fileUrl: string) {
    if (!fileUrl.startsWith('/uploads/')) {
      throw new Error('Unsupported avatar photo URL');
    }

    const relativePath = fileUrl.replace('/uploads/', '');
    const absolutePath = path.resolve(uploadsRoot, relativePath);
    const pathFromRoot = path.relative(uploadsRoot, absolutePath);

    if (pathFromRoot.startsWith('..') || path.isAbsolute(pathFromRoot)) {
      throw new Error('Invalid avatar photo URL');
    }

    const extension = path.extname(absolutePath).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';

    return {
      buffer: await readFile(absolutePath),
      mimeType,
    };
  }

  async delete(fileUrl: string) {
    if (!fileUrl.startsWith('/uploads/')) {
      return;
    }

    const relativePath = fileUrl.replace('/uploads/', '');
    const absolutePath = path.resolve(uploadsRoot, relativePath);

    if (!absolutePath.startsWith(uploadsRoot)) {
      return;
    }

    await rm(absolutePath, { force: true });
  }
}
