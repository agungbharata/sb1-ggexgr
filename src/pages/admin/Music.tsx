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
  const { user } = useAuth();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      console.log('Fetching tracks...');
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tracks:', error);
        throw error;
      }
      
      console.log('Fetched tracks:', data);
      setTracks(data || []);
    } catch (error: any) {
      console.error('Error in fetchTracks:', error);
      toast.error('Error loading music: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        console.log('No file selected');
        return;
      }

      const file = files[0];
      console.log('Selected file:', file.name, 'Size:', file.size);

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      if (!user?.id) {
        toast.error('You must be logged in to upload music');
        return;
      }

      setUploading({ progress: 0, fileName: file.name });

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const uniqueId = Date.now().toString();
      const fileName = `${uniqueId}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('music-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music-files')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Save to database
      const { data: insertData, error: insertError } = await supabase
        .from('music')
        .insert([
          {
            user_id: user.id,
            url: publicUrl,
            title: file.name.replace(`.${fileExt}`, ''),
            artist: 'Unknown Artist',
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        // If database insert fails, try to delete the uploaded file
        await supabase.storage
          .from('music-files')
          .remove([filePath]);
        throw insertError;
      }

      console.log('Database insert successful:', insertData);
      
      toast.success('Music uploaded successfully');
      await fetchTracks();
    } catch (error: any) {
      console.error('Error in handleFileUpload:', error);
      toast.error(error.message || 'Error uploading music');
    } finally {
      setUploading(null);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async (id: string, url: string) => {
    try {
      if (!user?.id) {
        toast.error('You must be logged in to delete music');
        return;
      }

      const confirmed = window.confirm('Are you sure you want to delete this track?');
      if (!confirmed) return;

      // Extract filename from URL
      const fileName = url.split('/').pop();
      if (!fileName) {
        throw new Error('Invalid file URL');
      }

      const filePath = `${user.id}/${fileName}`;
      console.log('Deleting file:', filePath);

      // Delete from database first
      const { error: dbError } = await supabase
        .from('music')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        throw dbError;
      }

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('music-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't throw here as the database record is already deleted
        toast.error('File deleted from database but storage cleanup failed');
      }

      toast.success('Track deleted successfully');
      setTracks(tracks.filter(track => track.id !== id));
      
      if (playing === id && audioRef.current) {
        audioRef.current.pause();
        setPlaying(null);
      }
    } catch (error: any) {
      console.error('Error in handleDelete:', error);
      toast.error('Error deleting track: ' + error.message);
    }
  };

  const togglePlay = async (track: MusicTrack) => {
    try {
      if (playing === track.id) {
        if (audioRef.current) {
          audioRef.current.pause();
          setPlaying(null);
        }
      } else {
        if (audioRef.current) {
          audioRef.current.src = track.url;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setPlaying(track.id);
          }
        }
      }
    } catch (error: any) {
      console.error('Error playing track:', error);
      toast.error('Error playing track: ' + error.message);
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
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

      <audio 
        ref={audioRef}
        onEnded={() => setPlaying(null)}
        onError={(e) => {
          console.error('Audio playback error:', e);
          toast.error('Error playing audio');
          setPlaying(null);
        }}
      />
    </div>
  );
};

export default Music;
