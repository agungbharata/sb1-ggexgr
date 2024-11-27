import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { generateSlug } from '../../utils/slug';
import { toast } from 'react-hot-toast';

interface InvitationData {
  id?: string;
  bride_names: string;
  groom_names: string;
  date: string;
  time: string;
  venue: string;
  opening_text: string;
  invitation_text: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery?: string[];
  social_links?: { platform: string; url: string }[];
  bank_accounts?: { bank_name: string; account_number: string; account_holder: string }[];
  google_maps_url?: string;
  google_maps_embed?: string;
  slug?: string;
  custom_slug?: string;
  theme?: string;
}

const InvitationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvitationData>({
    bride_names: '',
    groom_names: '',
    date: '',
    time: '',
    venue: '',
    opening_text: 'Bersama keluarga mereka',
    invitation_text: 'Mengundang kehadiran Anda',
    gallery: [],
    social_links: [],
    bank_accounts: [],
    theme: 'default'
  });

  useEffect(() => {
    if (id) {
      loadInvitation();
    }
  }, [id]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData(data);
      }
    } catch (error: any) {
      toast.error('Error loading invitation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      setLoading(true);
      const { error: uploadError } = await supabase.storage
        .from('invitation-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitation-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'cover' ? 'cover_photo' : type === 'bride' ? 'bride_photo' : 'groom_photo']: publicUrl
      }));

      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Generate slug if not exists
      const slug = formData.custom_slug || generateSlug(formData.bride_names, formData.groom_names);

      const invitationData = {
        ...formData,
        slug,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      };

      if (!id) {
        // Create new invitation
        const { error } = await supabase
          .from('invitations')
          .insert([invitationData]);

        if (error) throw error;
        toast.success('Invitation created successfully');
      } else {
        // Update existing invitation
        const { error } = await supabase
          .from('invitations')
          .update(invitationData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Invitation updated successfully');
      }

      navigate('/dashboard/invitations');
    } catch (error: any) {
      toast.error('Error saving invitation: ' + error.message);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {id ? 'Edit Invitation' : 'Create New Invitation'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bride & Groom Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="bride_names" className="block text-sm font-medium text-gray-700">
                Bride Names
              </label>
              <input
                type="text"
                id="bride_names"
                name="bride_names"
                required
                value={formData.bride_names}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="groom_names" className="block text-sm font-medium text-gray-700">
                Groom Names
              </label>
              <input
                type="text"
                id="groom_names"
                name="groom_names"
                required
                value={formData.groom_names}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Venue & Custom URL */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="custom_slug" className="block text-sm font-medium text-gray-700">
                Custom URL (optional)
              </label>
              <input
                type="text"
                id="custom_slug"
                name="custom_slug"
                value={formData.custom_slug || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="custom-url"
              />
            </div>
          </div>

          {/* Maps Integration */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="google_maps_url" className="block text-sm font-medium text-gray-700">
                Google Maps URL
              </label>
              <input
                type="url"
                id="google_maps_url"
                name="google_maps_url"
                value={formData.google_maps_url || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="google_maps_embed" className="block text-sm font-medium text-gray-700">
                Google Maps Embed URL
              </label>
              <input
                type="url"
                id="google_maps_embed"
                name="google_maps_embed"
                value={formData.google_maps_embed || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="default">Default Theme</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
            </select>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'cover')}
                className="mt-1 block w-full"
              />
              {formData.cover_photo && (
                <img src={formData.cover_photo} alt="Cover" className="mt-2 h-32 w-full object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bride Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'bride')}
                className="mt-1 block w-full"
              />
              {formData.bride_photo && (
                <img src={formData.bride_photo} alt="Bride" className="mt-2 h-32 w-full object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Groom Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'groom')}
                className="mt-1 block w-full"
              />
              {formData.groom_photo && (
                <img src={formData.groom_photo} alt="Groom" className="mt-2 h-32 w-full object-cover rounded" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard/invitations')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : id ? 'Update Invitation' : 'Create Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationForm;
