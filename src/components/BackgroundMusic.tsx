import React, { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { preloadAudio } from '../utils/audioUtils';

interface BackgroundMusicProps {
  bucket?: string;
  path?: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ bucket = 'music-files', path }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!bucket || !path) return;

    let mounted = true;

    const initAudio = async () => {
      try {
        // Tunggu sampai halaman sepenuhnya dimuat
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
          });
        }

        // Preload audio setelah halaman dimuat
        const audio = await preloadAudio(bucket, path);
        if (!mounted) return;

        audio.loop = true;
        audioRef.current = audio;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    };

    initAudio();

    return () => {
      mounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [bucket, path]);

  const togglePlay = async () => {
    if (!audioRef.current || !isLoaded) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Coba play hanya saat user klik
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Play/pause error:', error);
      setIsPlaying(false);
    }
  };

  // Tampilkan tombol hanya setelah audio siap
  if (!bucket || !path || !isLoaded) return null;

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-colors"
      title={isPlaying ? 'Matikan musik' : 'Putar musik'}
    >
      {isPlaying ? (
        <Music className="w-5 h-5 text-gray-700" />
      ) : (
        <VolumeX className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default BackgroundMusic;