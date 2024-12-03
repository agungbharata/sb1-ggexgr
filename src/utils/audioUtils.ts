import { getStorageUrl } from '../lib/supabase';

export const getOptimizedAudioUrl = (bucket: string, path: string): string => {
  return getStorageUrl(bucket, path);
};

export const preloadAudio = async (bucket: string, path: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = getOptimizedAudioUrl(bucket, path);
    
    audio.addEventListener('loadedmetadata', () => resolve(audio));
    audio.addEventListener('error', reject);
    
    audio.volume = 0.3;
  });
};