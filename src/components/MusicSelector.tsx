import React, { useState, useEffect } from 'react'
import { Music2, Play, Pause } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Music {
  id: string
  title: string
  artist: string
  category: string
  url: string
}

interface MusicSelectorProps {
  value?: string
  onChange: (url: string) => void
}

export default function MusicSelector({ value, onChange }: MusicSelectorProps) {
  const [musicList, setMusicList] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadMusicLibrary()
  }, [])

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ''
      }
    }
  }, [audioElement])

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
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (music: Music) => {
    if (playing === music.id) {
      // Stop playing
      if (audioElement) {
        audioElement.pause()
      }
      setPlaying(null)
    } else {
      // Start playing new song
      if (audioElement) {
        audioElement.pause()
      }
      const audio = new Audio(music.url)
      audio.play()
      setAudioElement(audio)
      setPlaying(music.id)
    }
  }

  const handleSelect = (music: Music) => {
    onChange(music.url)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-40 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {musicList.map((music) => (
          <div
            key={music.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              value === music.url
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-pink-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handlePlay(music)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {playing === music.id ? (
                  <Pause className="w-5 h-5 text-gray-600" />
                ) : (
                  <Play className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <div>
                <h3 className="font-medium text-gray-900">{music.title}</h3>
                <p className="text-sm text-gray-500">
                  {music.artist} • {music.category}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSelect(music)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                value === music.url
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {value === music.url ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
