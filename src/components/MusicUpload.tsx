import React, { useState } from 'react'
import { Upload, Music2 } from 'lucide-react'
import { uploadAudio } from '../lib/storage'

interface MusicUploadProps {
  audioUrl: string
  onChange: (url: string) => void
}

export default function MusicUpload({ audioUrl, onChange }: MusicUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const url = await uploadAudio(file)
      onChange(url)
    } catch (error) {
      console.error('Error uploading audio:', error)
      alert('Failed to upload audio. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Background Music</label>
      <div className="relative">
        {audioUrl ? (
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <Music2 className="w-6 h-6 text-gray-400" />
            <div className="flex-1">
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <label className="p-2 bg-white border rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex flex-col items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-t-2 border-pink-500 border-solid rounded-full animate-spin" />
              ) : (
                <>
                  <Music2 className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload Background Music</p>
                  <p className="text-xs text-gray-400 mt-1">MP3 file recommended</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  )
}
