import { LocalStorageAdapter } from "./local-storage.adapter.js";
import type { StorageAdapter } from "./storage-adapter.js";

export const avatarStorage: StorageAdapter = new LocalStorageAdapter();
