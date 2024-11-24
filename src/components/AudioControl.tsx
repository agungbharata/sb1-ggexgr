import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  audioUrl?: string;
  autoPlay?: boolean;
}

export default function AudioControl({ audioUrl, autoPlay = true }: AudioControlProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && isMounted) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMounted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
      />
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label={isPlaying ? 'Mute music' : 'Play music'}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
