import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { uploadImage } from '../lib/storage'

interface CouplePhotoUploadProps {
  label: string
  imageUrl: string
  onChange: (url: string) => void
}

export default function CouplePhotoUpload({ label, imageUrl, onChange }: CouplePhotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const url = await uploadImage(file, 'couple')
      onChange(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-48 object-cover rounded-lg"
            />
            <label className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-75 rounded-lg cursor-pointer hover:bg-opacity-100">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex flex-col items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-t-2 border-pink-500 border-solid rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload {label}</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  )
}
