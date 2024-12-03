import React, { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  audioUrl?: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect untuk menginisialisasi audio saat komponen dimount
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.volume = 0.3;
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log('Play/pause error:', error);
      setIsPlaying(false);
    }
  };

  if (!audioUrl) return null;

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
