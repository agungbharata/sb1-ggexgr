import { InvitationData } from '../types/invitation';
import { compressImage } from './imageCompression';

// Nama folder untuk menyimpan data undangan
const APP_DIRECTORY = 'weddinggas-data';
const IMAGES_DIRECTORY = 'images';

interface StorageDirectories {
  root: FileSystemDirectoryHandle;
  images: FileSystemDirectoryHandle;
}

// Inisialisasi direktori aplikasi
export const initializeStorage = async (): Promise<StorageDirectories> => {
  try {
    // Minta akses ke direktori sistem
    const root = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
    });

    // Buat atau buka direktori aplikasi
    let appDir: FileSystemDirectoryHandle;
    try {
      appDir = await root.getDirectoryHandle(APP_DIRECTORY);
    } catch {
      appDir = await root.getDirectoryHandle(APP_DIRECTORY, { create: true });
    }

    // Buat atau buka direktori gambar
    let imagesDir: FileSystemDirectoryHandle;
    try {
      imagesDir = await appDir.getDirectoryHandle(IMAGES_DIRECTORY);
    } catch {
      imagesDir = await appDir.getDirectoryHandle(IMAGES_DIRECTORY, { create: true });
    }

    return {
      root: appDir,
      images: imagesDir
    };
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw new Error('Gagal menginisialisasi penyimpanan. Pastikan Anda mengizinkan akses ke direktori.');
  }
};

// Simpan file gambar
export const saveImageFile = async (
  directory: FileSystemDirectoryHandle,
  fileName: string,
  imageData: string
): Promise<string> => {
  try {
    // Generate nama file unik
    const timestamp = Date.now();
    const uniqueFileName = `${fileName}-${timestamp}.jpg`;

    // Buat file handle
    const fileHandle = await directory.getFileHandle(uniqueFileName, { create: true });
    const writable = await fileHandle.createWritable();

    // Konversi base64 ke blob
    const response = await fetch(imageData);
    const blob = await response.blob();

    // Tulis file
    await writable.write(blob);
    await writable.close();

    return uniqueFileName;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Gagal menyimpan gambar ke storage.');
  }
};

// Simpan data undangan
export const saveInvitation = async (
  directories: StorageDirectories,
  invitation: InvitationData
): Promise<void> => {
  try {
    // Simpan gambar-gambar
    const imagePromises = [];
    
    if (invitation.coverPhoto) {
      imagePromises.push(
        saveImageFile(directories.images, 'cover', invitation.coverPhoto)
          .then(fileName => { invitation.coverPhoto = fileName; })
      );
    }
    
    if (invitation.bridePhoto) {
      imagePromises.push(
        saveImageFile(directories.images, 'bride', invitation.bridePhoto)
          .then(fileName => { invitation.bridePhoto = fileName; })
      );
    }
    
    if (invitation.groomPhoto) {
      imagePromises.push(
        saveImageFile(directories.images, 'groom', invitation.groomPhoto)
          .then(fileName => { invitation.groomPhoto = fileName; })
      );
    }

    if (invitation.gallery?.length) {
      invitation.gallery.forEach((photo, index) => {
        imagePromises.push(
          saveImageFile(directories.images, `gallery-${index}`, photo)
            .then(fileName => {
              if (invitation.gallery) {
                invitation.gallery[index] = fileName;
              }
            })
        );
      });
    }

    // Tunggu semua gambar tersimpan
    await Promise.all(imagePromises);

    // Simpan data undangan ke file JSON
    const invitationFile = await directories.root.getFileHandle(
      `invitation-${invitation.slug}.json`,
      { create: true }
    );
    const writable = await invitationFile.createWritable();
    await writable.write(JSON.stringify(invitation, null, 2));
    await writable.close();

  } catch (error) {
    console.error('Error saving invitation:', error);
    throw new Error('Gagal menyimpan undangan ke storage.');
  }
};

// Baca file gambar
export const readImageFile = async (
  directory: FileSystemDirectoryHandle,
  fileName: string
): Promise<string> => {
  try {
    const fileHandle = await directory.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error reading image:', error);
    throw new Error('Gagal membaca gambar dari storage.');
  }
};

// Baca data undangan
export const loadInvitation = async (
  directories: StorageDirectories,
  slug: string
): Promise<InvitationData> => {
  try {
    // Baca file JSON undangan
    const fileHandle = await directories.root.getFileHandle(`invitation-${slug}.json`);
    const file = await fileHandle.getFile();
    const invitation: InvitationData = JSON.parse(await file.text());

    // Baca semua gambar
    if (invitation.coverPhoto) {
      invitation.coverPhoto = await readImageFile(directories.images, invitation.coverPhoto);
    }
    
    if (invitation.bridePhoto) {
      invitation.bridePhoto = await readImageFile(directories.images, invitation.bridePhoto);
    }
    
    if (invitation.groomPhoto) {
      invitation.groomPhoto = await readImageFile(directories.images, invitation.groomPhoto);
    }

    if (invitation.gallery?.length) {
      invitation.gallery = await Promise.all(
        invitation.gallery.map(fileName => readImageFile(directories.images, fileName))
      );
    }

    return invitation;
  } catch (error) {
    console.error('Error loading invitation:', error);
    throw new Error('Gagal membaca undangan dari storage.');
  }
};

// Hapus undangan
export const deleteInvitation = async (
  directories: StorageDirectories,
  invitation: InvitationData
): Promise<void> => {
  try {
    // Hapus gambar-gambar
    const deletePromises = [];
    
    if (invitation.coverPhoto) {
      deletePromises.push(directories.images.removeEntry(invitation.coverPhoto));
    }
    
    if (invitation.bridePhoto) {
      deletePromises.push(directories.images.removeEntry(invitation.bridePhoto));
    }
    
    if (invitation.groomPhoto) {
      deletePromises.push(directories.images.removeEntry(invitation.groomPhoto));
    }

    if (invitation.gallery?.length) {
      invitation.gallery.forEach(fileName => {
        deletePromises.push(directories.images.removeEntry(fileName));
      });
    }

    // Tunggu semua gambar terhapus
    await Promise.all(deletePromises);

    // Hapus file JSON undangan
    await directories.root.removeEntry(`invitation-${invitation.slug}.json`);

  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw new Error('Gagal menghapus undangan dari storage.');
  }
};
