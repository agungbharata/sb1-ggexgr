import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MusicLibrary as MusicLibraryType } from '../types/invitation';

interface MusicLibraryProps {
  onSelect: (url: string | null) => void;
  selectedMusic?: string;
}

export const MusicLibrary: React.FC<MusicLibraryProps> = ({ onSelect, selectedMusic = '' }) => {
  const [musicList, setMusicList] = useState<MusicLibraryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadMusicLibrary();
    return () => {
      // Cleanup audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const loadMusicLibrary = async () => {
    try {
      console.log('Fetching music library from storage...');
      
      // First, get all folders
      const { data: folders, error: foldersError } = await supabase
        .storage
        .from('music-files')
        .list('', {
          sortBy: { column: 'name', order: 'asc' }
        });

      if (foldersError) {
        console.error('Supabase storage error:', foldersError);
        throw foldersError;
      }

      // Then get files from each folder
      const allMusicFiles = [];
      for (const folder of folders || []) {
        const { data: files, error: filesError } = await supabase
          .storage
          .from('music-files')
          .list(folder.name, {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (filesError) {
          console.error(`Error listing files in folder ${folder.name}:`, filesError);
          continue;
        }

        const musicFiles = (files || [])
          .filter(file => file.name.toLowerCase().endsWith('.mp3'))
          .map(file => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('music-files')
              .getPublicUrl(`${folder.name}/${file.name}`);

            const secureUrl = publicUrl.replace('http://', 'https://');
            
            return {
              id: file.id || `${folder.name}-${file.name}`,
              title: file.name.replace(/\.mp3$/i, ''),
              artist: 'Unknown Artist',
              url: secureUrl,
              created_at: file.created_at
            };
          });

        allMusicFiles.push(...musicFiles);
      }

      console.log('Processed music library:', allMusicFiles);
      setMusicList(allMusicFiles);
    } catch (error) {
      console.error('Error loading music library:', error);
      setMusicList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (url: string) => {
    try {
      if (currentlyPlaying === url) {
        console.log('Stopping current audio');
        audioRef.current?.pause();
        setCurrentlyPlaying(null);
      } else {
        if (audioRef.current) {
          console.log('Setting up audio player...');
          
          // Reset audio element
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
          
          // Set new source and options
          audioRef.current.src = url;
          audioRef.current.crossOrigin = 'anonymous';
          audioRef.current.preload = 'auto';
          
          console.log('Attempting to play URL:', url);
          
          try {
            // Add event listeners for debugging
            const onLoadStart = () => console.log('Audio loading started');
            const onCanPlay = () => console.log('Audio can play');
            const onError = (e: ErrorEvent) => console.error('Audio error:', e);
            
            audioRef.current.addEventListener('loadstart', onLoadStart);
            audioRef.current.addEventListener('canplay', onCanPlay);
            audioRef.current.addEventListener('error', onError);
            
            await audioRef.current.play();
            console.log('Audio playing successfully');
            setCurrentlyPlaying(url);
            
            // Clean up event listeners
            audioRef.current.removeEventListener('loadstart', onLoadStart);
            audioRef.current.removeEventListener('canplay', onCanPlay);
            audioRef.current.removeEventListener('error', onError);
          } catch (playError) {
            console.error('Error playing audio:', playError);
            throw new Error('Gagal memutar audio. Pastikan format file MP3 valid dan dapat diakses.');
          }
        }
      }
    } catch (error) {
      console.error('Error in handlePlay:', error);
      alert(error.message || 'Gagal memutar audio. Pastikan file musik tersedia dan dalam format yang didukung.');
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    if (currentlyPlaying) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-medium text-gray-900">
          <Music className="w-4 h-4" /> Musik Latar
        </h3>
        
        {/* Tombol Nonaktifkan */}
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setCurrentlyPlaying(null);
            }
            onSelect(null);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
            !selectedMusic 
              ? 'bg-red-100 text-red-700' 
              : 'text-gray-700 hover:text-red-600'
          }`}
        >
          <VolumeX className="w-3.5 h-3.5" />
          {!selectedMusic ? 'Musik Dinonaktifkan' : 'Nonaktifkan'}
        </button>
      </div>

      <div className="grid gap-2">
        {loading ? (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500 animate-spin border-t-transparent"></div>
          </div>
        ) : (
          musicList.map((music) => (
            <div
              key={music.id}
              className="flex items-center justify-between bg-white rounded-md p-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePlay(music.url)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  {currentlyPlaying === music.url ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{music.title}</h4>
                  <p className="text-xs text-gray-500">{music.artist}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => handleSelect(music.url)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  selectedMusic === music.url
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {selectedMusic === music.url ? 'Terpilih' : 'Pilih'}
              </button>
            </div>
          ))
        )}
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};
