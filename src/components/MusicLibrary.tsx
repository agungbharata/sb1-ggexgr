import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MusicLibrary as MusicLibraryType } from '../types/invitation';

interface MusicLibraryProps {
  onSelect: (url: string) => void;
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
    <div className="space-y-4">
      <audio ref={audioRef} className="hidden" />
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-500 animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {musicList.map((music) => (
            <div
              key={music.id}
              className={`p-4 rounded-lg border ${
                selectedMusic === music.url
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{music.title}</h3>
                  <p className="text-sm text-gray-500">{music.artist}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePlay(music.url)}
                    className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100"
                  >
                    {currentlyPlaying === music.url ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect(music.url)}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      selectedMusic === music.url
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {selectedMusic === music.url ? 'Terpilih' : 'Pilih'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
