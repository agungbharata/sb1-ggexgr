import { supabase } from './supabase'

const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public`

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const MAX_AUDIO_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export type UploadOptions = {
  file: File
  bucket: string
  folder: string
  maxSize?: number // in MB
}

export async function uploadFile({ file, bucket, folder, maxSize = 2 }: UploadOptions) {
  try {
    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > maxSize) {
      throw new Error(`File size should not exceed ${maxSize}MB`)
    }

    // Create unique filename
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        fileMetadata: {
          owner: supabase.auth.user()?.id
        }
      })

    if (error) throw error

    // Return public URL
    return `${STORAGE_URL}/${bucket}/${data.path}`
  } catch (error: any) {
    console.error('Error uploading file:', error)
    throw new Error(error.message || 'Error uploading file')
  }
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  // Verify ownership before delete
  const user = supabase.auth.user()
  if (!user) throw new Error('Must be logged in to delete files')

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return true
  } catch (error: any) {
    console.error('Error deleting file:', error)
    throw new Error(error.message || 'Error deleting file')
  }
}

export function getPublicUrl(bucket: string, path: string) {
  return `${STORAGE_URL}/${bucket}/${path}`
}

// Helper untuk upload gambar
export async function uploadImage(file: File, folder: string): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Ukuran gambar tidak boleh lebih dari 5MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar (JPG, PNG, atau GIF)');
    }

    // Compress image if needed
    let imageToUpload = file;
    if (file.size > 2 * 1024 * 1024) { // if larger than 2MB
      try {
        const compressedBlob = await compressImage(file);
        imageToUpload = new File([compressedBlob], file.name, { type: compressedBlob.type });
      } catch (compressError) {
        console.warn('Failed to compress image:', compressError);
        // Continue with original file if compression fails
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!validExts.includes(fileExt)) {
      throw new Error('Format gambar harus JPG, PNG, atau GIF');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase with retry
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase.storage
          .from('wedding-images')
          .upload(filePath, imageToUpload, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        if (!data?.path) throw new Error('No path returned from upload');

        return `${STORAGE_URL}/wedding-images/${data.path}`;
      } catch (uploadError: any) {
        lastError = uploadError;
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // exponential backoff
          continue;
        }
        break;
      }
    }

    throw new Error(lastError?.message || 'Gagal mengupload gambar. Silakan coba lagi.');
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Gagal mengupload gambar. Silakan coba lagi.');
  }
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      const maxDimension = 1920; // max width/height

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.8 // quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for compression'));
    };
  });
}

// Helper untuk upload audio
export async function uploadAudio(file: File): Promise<string> {
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error('Ukuran audio tidak boleh lebih dari 10MB')
  }

  if (!file.type.startsWith('audio/')) {
    throw new Error('File harus berupa audio')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `music/${fileName}`

  const { data, error } = await supabase.storage
    .from('wedding-images')
    .upload(filePath, file, {
      upsert: false,
      fileMetadata: {
        owner: supabase.auth.user()?.id
      }
    })

  if (error) throw error

  const { data: { publicUrl } } = await supabase.storage
    .from('wedding-images')
    .getPublicUrl(filePath)

  return publicUrl
}
