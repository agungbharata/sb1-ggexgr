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
    <div className="bg-[#F5E9E2] rounded-lg shadow-lg p-6">
      <audio ref={audioRef} className="hidden" />
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-500 animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicList.map((music) => (
            <div
              key={music.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg font-medium text-[#8B7355] mb-2">{music.title}</h3>
              <p className="text-sm text-[#6B5B4E] mb-4">{music.artist}</p>
              <div className="flex items-center justify-between space-x-4">
                <button
                  type="button"
                  onClick={() => handlePlay(music.url)}
                  className="px-4 py-2 bg-[#D4B996] text-white rounded-md hover:bg-[#C4A576] transition-colors duration-200"
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
                  className={`px-4 py-2 border border-[#D4B996] text-[#8B7355] rounded-md hover:bg-[#F5E9E2] transition-colors duration-200 ${
                    selectedMusic === music.url
                      ? 'bg-[#D4B996] text-white'
                      : ''
                  }`}
                >
                  {selectedMusic === music.url ? 'Terpilih' : 'Pilih'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
