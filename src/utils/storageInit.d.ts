declare global {
  interface Window {
    showDirectoryPicker(options?: {
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }): Promise<FileSystemDirectoryHandle>;
  }
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
  requestPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  kind: 'directory';
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  kind: 'file';
  getFile(): Promise<File>;
  createWritable(options?: { keepExistingData?: boolean }): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: BufferSource | Blob | string): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

export let rootDirectoryHandle: FileSystemDirectoryHandle | null;

export function initializeStorage(): Promise<boolean>;
export function getStorageDirectory(): Promise<FileSystemDirectoryHandle | null>;
export function verifyStorageAccess(): Promise<boolean>;
export function createDirectory(name: string): Promise<FileSystemDirectoryHandle | null>;
export function writeFile(directoryName: string, fileName: string, content: Blob): Promise<boolean>;
export function readFile(directoryName: string, fileName: string): Promise<Blob | null>;
export function deleteFile(directoryName: string, fileName: string): Promise<boolean>;
export function listFiles(directoryName: string): Promise<string[]>;
