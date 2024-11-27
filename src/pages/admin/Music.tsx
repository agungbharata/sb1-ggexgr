import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Music as MusicIcon, Play, Pause, Upload, X } from 'react-feather';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  created_at: string;
  duration?: number;
}

interface UploadProgress {
  progress: number;
  fileName: string;
}

const Music: React.FC = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadProgress | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { user } = useAuth();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error: any) {
      toast.error('Error loading music: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploading({ progress: 0, fileName: file.name });

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/music/${fileName}`;

      // Upload music to Supabase Storage with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('music-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploading({ progress: percentage, fileName: file.name });
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music-files')
        .getPublicUrl(filePath);

      // Create audio element to get duration
      const audio = new Audio(publicUrl);
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(audio.duration);
        });
      });

      // Save track metadata to database
      const { error: dbError } = await supabase
        .from('music')
        .insert([
          {
            user_id: user?.id,
            url: publicUrl,
            title: file.name.replace(`.${fileExt}`, ''),
            artist: 'Unknown Artist',
            duration: audio.duration,
          },
        ]);

      if (dbError) throw dbError;

      toast.success('Music track uploaded successfully');
      fetchTracks();
    } catch (error: any) {
      toast.error('Error uploading music: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this track?');
      if (!confirmed) return;

      // Delete from database
      const { error: dbError } = await supabase
        .from('music')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage
      const filePath = url.split('/').pop();
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('music-files')
          .remove([`${user?.id}/music/${filePath}`]);

        if (storageError) throw storageError;
      }

      toast.success('Track deleted successfully');
      setTracks(tracks.filter(track => track.id !== id));
      
      if (playing === id) {
        setPlaying(null);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    } catch (error: any) {
      toast.error('Error deleting track: ' + error.message);
    }
  };

  const togglePlay = (track: MusicTrack) => {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(error => {
          toast.error('Error playing track: ' + error.message);
        });
        setPlaying(track.id);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>, trackId: string) => {
    if (audioRef.current && playing === trackId) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Music Library</h1>
        <label className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Add Music
          <input
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={!!uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Uploading: {uploading.fileName}
            </span>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setUploading(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploading.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {Math.round(uploading.progress)}%
          </span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex flex-col p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <MusicIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{track.title}</h3>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePlay(track)}
                  className="p-2 text-gray-400 hover:text-emerald-600"
                >
                  {playing === track.id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(track.id, track.url)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {playing === track.id && (
              <div className="mt-3 px-14">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => handleSeek(e, track.id)}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {tracks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MusicIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No music tracks</h3>
            <p className="text-gray-500">Add your first track to get started</p>
          </div>
        )}
      </div>

      {/* Hidden audio element for playing music */}
      <audio 
        ref={audioRef} 
        onEnded={() => setPlaying(null)}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default Music;
