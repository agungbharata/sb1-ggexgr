import React, { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  audioUrl?: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(error => {
        console.error('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Play error:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        autoPlay
        preload="auto"
      />
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
    </>
  );
};

export default BackgroundMusic;