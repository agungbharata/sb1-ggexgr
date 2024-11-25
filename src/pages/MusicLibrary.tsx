import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { uploadAudio } from '../lib/storage'
import { Music2, Trash2 } from 'lucide-react'

interface Music {
  id: string
  title: string
  artist: string
  category: string
  url: string
}

export default function MusicLibrary() {
  const [musicList, setMusicList] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: ''
  })

  useEffect(() => {
    loadMusicLibrary()
  }, [])

  const loadMusicLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true })

      if (error) throw error
      if (data) setMusicList(data)
    } catch (error) {
      console.error('Error loading music library:', error)
      alert('Error loading music library')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const url = await uploadAudio(file)

      const { data, error } = await supabase
        .from('music_library')
        .insert({
          ...formData,
          url,
          created_by: supabase.auth.user()?.id
        })
        .select()
        .single()

      if (error) throw error

      setMusicList([...musicList, data])
      setFormData({ title: '', artist: '', category: '' })
    } catch (error) {
      console.error('Error uploading music:', error)
      alert('Error uploading music')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('music_library')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMusicList(musicList.filter(music => music.id !== id))
    } catch (error) {
      console.error('Error deleting music:', error)
      alert('Error deleting music')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
      </div>

      {/* Add Music Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
          <input
            type="text"
            placeholder="Artist"
            value={formData.artist}
            onChange={e => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
        <div className="mt-4">
          <label className={`flex justify-center px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-pink-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center space-x-2">
              <Music2 className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Upload Music File'}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={uploading || !formData.title}
            />
          </label>
        </div>
      </div>

      {/* Music List */}
      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {musicList.map(music => (
            <li key={music.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{music.title}</h3>
                <p className="text-sm text-gray-500">
                  {music.artist} • {music.category}
                </p>
              </div>
              <button
                onClick={() => handleDelete(music.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
