export type StoredFile = {
  url: string;
  key: string;
};

export type UploadFileInput = {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  folder: string;
};

export type StoredFileContent = {
  buffer: Buffer;
  mimeType: string;
};

export interface StorageAdapter {
  upload(input: UploadFileInput): Promise<StoredFile>;
  read(fileUrl: string): Promise<StoredFileContent>;
  delete(fileUrl: string): Promise<void>;
}
