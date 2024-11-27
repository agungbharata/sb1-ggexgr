import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../lib/storage';

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function GalleryUpload({ images, onChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setUploading(true);

      // Validate total size
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 20 * 1024 * 1024; // 20MB total
      if (totalSize > maxTotalSize) {
        throw new Error('Total ukuran gambar tidak boleh lebih dari 20MB');
      }

      // Upload each file with progress tracking
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        try {
          const url = await uploadImage(file, 'gallery');
          uploadedUrls.push(url);
        } catch (error: any) {
          console.error(`Error uploading file ${file.name}:`, error);
          // Continue with other files even if one fails
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error('Gagal mengupload gambar. Silakan coba lagi.');
      }

      if (uploadedUrls.length < files.length) {
        alert(`Berhasil mengupload ${uploadedUrls.length} dari ${files.length} gambar.`);
      }

      // Add new URLs to existing images
      onChange([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(error.message || 'Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Photo Gallery</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <div className="w-8 h-8 border-t-2 border-pink-500 border-solid rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Add Photos</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}