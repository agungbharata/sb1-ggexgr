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
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image file size must be less than 5MB')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

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

// Helper untuk upload audio
export async function uploadAudio(file: File): Promise<string> {
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error('Audio file size must be less than 10MB')
  }

  if (!file.type.startsWith('audio/')) {
    throw new Error('File must be an audio')
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
