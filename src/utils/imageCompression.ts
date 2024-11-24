import imageCompression from 'browser-image-compression';

const MAX_IMAGE_SIZE_MB = 0.5; // 500KB
const MAX_THUMB_SIZE_MB = 0.1; // 100KB

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export const compressImage = async (
  imageFile: File | Blob,
  isThumb: boolean = false
): Promise<string> => {
  try {
    const options: CompressionOptions = {
      maxSizeMB: isThumb ? MAX_THUMB_SIZE_MB : MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: isThumb ? 400 : 1920,
      useWebWorker: true
    };

    // Kompresi gambar
    const compressedFile = await imageCompression(imageFile as File, options);
    
    // Convert ke base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = () => reject(new Error('Failed to read compressed image'));
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Gagal mengkompresi gambar');
  }
};

export const compressImageFromUrl = async (
  imageUrl: string,
  isThumb: boolean = false
): Promise<string> => {
  try {
    // Download gambar
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Kompresi gambar
    return await compressImage(blob, isThumb);
  } catch (error) {
    console.error('Error compressing image from URL:', error);
    throw new Error('Gagal mengkompresi gambar dari URL');
  }
};

export const calculateImageSize = (base64String: string): number => {
  // Hapus header data URL jika ada
  const base64Data = base64String.split(',')[1] || base64String;
  
  // Hitung ukuran dalam bytes
  const sizeInBytes = (base64Data.length * 3) / 4;
  return sizeInBytes / (1024 * 1024); // Convert ke MB
};

export const getTotalImagesSize = (images: string[]): number => {
  return images.reduce((total, image) => {
    return total + calculateImageSize(image);
  }, 0);
};
