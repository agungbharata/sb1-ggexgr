let rootDirectoryHandle: FileSystemDirectoryHandle | null = null;

export const initializeStorage = async (): Promise<boolean> => {
  try {
    // Minta izin akses ke direktori
    rootDirectoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
    });

    // Simpan handle ke localStorage untuk penggunaan berikutnya
    localStorage.setItem('storageInitialized', 'true');

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

export const getStorageDirectory = async (): Promise<FileSystemDirectoryHandle | null> => {
  if (!rootDirectoryHandle) {
    const isInitialized = localStorage.getItem('storageInitialized');
    if (!isInitialized) {
      const success = await initializeStorage();
      if (!success) return null;
    }
  }
  return rootDirectoryHandle;
};

export const verifyStorageAccess = async (): Promise<boolean> => {
  try {
    const directory = await getStorageDirectory();
    if (!directory) return false;

    // Verifikasi permission
    const permission = await directory.requestPermission({ mode: 'readwrite' });
    return permission === 'granted';
  } catch (error) {
    console.error('Error verifying storage access:', error);
    return false;
  }
};

export const createDirectory = async (name: string): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const rootDir = await getStorageDirectory();
    if (!rootDir) return null;

    return await rootDir.getDirectoryHandle(name, { create: true });
  } catch (error) {
    console.error(`Error creating directory ${name}:`, error);
    return null;
  }
};

export const writeFile = async (
  directoryName: string,
  fileName: string,
  content: Blob
): Promise<boolean> => {
  try {
    const directory = await createDirectory(directoryName);
    if (!directory) return false;

    const fileHandle = await directory.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    return true;
  } catch (error) {
    console.error(`Error writing file ${fileName}:`, error);
    return false;
  }
};

export const readFile = async (
  directoryName: string,
  fileName: string
): Promise<Blob | null> => {
  try {
    const rootDir = await getStorageDirectory();
    if (!rootDir) return null;

    const directory = await rootDir.getDirectoryHandle(directoryName);
    const fileHandle = await directory.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return file;
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return null;
  }
};

export const deleteFile = async (
  directoryName: string,
  fileName: string
): Promise<boolean> => {
  try {
    const rootDir = await getStorageDirectory();
    if (!rootDir) return false;

    const directory = await rootDir.getDirectoryHandle(directoryName);
    await directory.removeEntry(fileName);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    return false;
  }
};

export const listFiles = async (
  directoryName: string
): Promise<string[]> => {
  try {
    const rootDir = await getStorageDirectory();
    if (!rootDir) return [];

    const directory = await rootDir.getDirectoryHandle(directoryName);
    const files: string[] = [];
    
    for await (const [name] of directory.entries()) {
      files.push(name);
    }
    
    return files;
  } catch (error) {
    console.error(`Error listing files in ${directoryName}:`, error);
    return [];
  }
};
