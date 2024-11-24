import axios from 'axios';
import { API_URL } from '../config';

// Tipe data untuk response upload
interface UploadResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

// Fungsi untuk mengupload file
export const uploadMedia = async (
  file: File,
  type: 'cover' | 'bride' | 'groom' | 'gallery'
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await axios.post(`${API_URL}/api/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error);
    return {
      success: false,
      error: 'Gagal mengupload file. Silakan coba lagi.',
    };
  }
};

// Fungsi untuk menghapus file
export const deleteMedia = async (filePath: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_URL}/api/upload/image`, {
      data: { filePath },
    });

    return response.data.success;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
};

// Fungsi untuk mendapatkan URL file
export const getMediaUrl = (filePath: string): string => {
  return `${API_URL}/${filePath}`;
};

// Fungsi untuk memvalidasi file sebelum upload
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau GIF.',
    };
  }

  // Validasi ukuran file (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Ukuran file terlalu besar. Maksimal 5MB.',
    };
  }

  return { valid: true };
};
