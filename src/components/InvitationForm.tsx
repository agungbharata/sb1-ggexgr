import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Calendar, Clock, MapPin, Save, Link, Plus, Minus } from 'lucide-react';
import type { InvitationData } from '../types/invitation';
import { supabase } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import BankAccounts from './BankAccounts';
import SocialLinks from './SocialLinks';
import RichTextEditor from './RichTextEditor';
import { generateSlug, isSlugUnique, sanitizeSlug } from '../utils/slug';
import CopyLinkButton from './CopyLinkButton';
import { useParams, useNavigate } from 'react-router-dom';

interface InvitationFormProps {
  onUpdate: (data: InvitationData) => void;
  onChange?: (data: InvitationData) => void;
  initialData: InvitationData;
  isEditing?: boolean;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  onUpdate,
  onChange,
  initialData,
  isEditing = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InvitationData>(() => {
    const mergedData = { ...initialData };
    if (!mergedData.openingText) mergedData.openingText = 'Bersama keluarga mereka';
    if (!mergedData.invitationText) mergedData.invitationText = 'Mengundang kehadiran Anda';
    return mergedData;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customSlug, setCustomSlug] = useState(initialData.customSlug || '');
  const [slugError, setSlugError] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isInitialMount = useRef(true);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            id: data.id,
            brideNames: data.bride_names,
            groomNames: data.groom_names,
            date: data.date,
            time: data.time,
            venue: data.venue,
            openingText: data.opening_text,
            invitationText: data.invitation_text,
            coverPhoto: data.cover_photo,
            bridePhoto: data.bride_photo,
            groomPhoto: data.groom_photo,
            gallery: data.gallery || [],
            socialLinks: data.social_links || [],
            bankAccounts: data.bank_accounts || [],
            customSlug: data.slug,
            googleMapsUrl: data.google_maps_url,
            googleMapsEmbed: data.google_maps_embed,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          });
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if any
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  const handleImageUpload = useCallback((field: string, value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGoogleMapsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    let embedUrl = '';

    if (url) {
      let query = '';

      if (url.includes('place/')) {
        const placePath = url.split('place/')[1];
        query = placePath.split('/')[0].split('?')[0];
      } else if (url.includes('@')) {
        const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          query = `${match[1]},${match[2]}`;
        }
      } else if (url.includes('g.co/') || url.includes('goo.gl/')) {
        query = formData.venue || '';
      }

      if (query) {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      }
    }

    setFormData(prev => ({
      ...prev,
      googleMapsUrl: url,
      googleMapsEmbed: embedUrl
    }));
  }, [formData.venue]);

  const handleSocialLinksChange = useCallback((socialLinks: any[]) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: socialLinks
    }));
  }, []);

  const handleBankAccountsChange = useCallback((bankAccounts: any[]) => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: bankAccounts
    }));
  }, []);

  const handleRichTextChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const generateSlug = (brideNames: string, groomNames: string): string => {
    if (!brideNames || !groomNames) {
      return '';
    }

    // Remove any special characters and convert to lowercase
    const sanitizedBride = brideNames.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Keep only letters, numbers, and spaces
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens

    const sanitizedGroom = groomNames.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    // Create the slug
    const baseSlug = `${sanitizedBride}-${sanitizedGroom}`;
    console.log('Generated slug:', baseSlug);

    return baseSlug;
  };

  const defaultSlug = generateSlug(formData.brideNames, formData.groomNames);

  useEffect(() => {
    if (!customSlug && formData.brideNames && formData.groomNames) {
      setCustomSlug('');
      setSlugError('');
    }
  }, [formData.brideNames, formData.groomNames]);

  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = {
      brideNames: 'Nama Mempelai Wanita',
      groomNames: 'Nama Mempelai Pria',
      date: 'Tanggal Pernikahan',
      time: 'Waktu Acara',
      venue: 'Lokasi Acara'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        errors[field] = `${label} harus diisi`;
      }
    });

    // Validate date format
    if (formData.date && !isValidDate(formData.date)) {
      errors.date = 'Format tanggal tidak valid';
    }

    // Validate time format
    if (formData.time && !isValidTime(formData.time)) {
      errors.time = 'Format waktu tidak valid';
    }

    return errors;
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const isValidTime = (timeString: string) => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
  };

  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
      if (!slug || slug.trim() === '') {
        return false;
      }

      const { data, error } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !data;
    } catch (error) {
      console.error('Error checking slug:', error);
      throw new Error('Gagal memeriksa ketersediaan URL. Silakan coba lagi.');
    }
  };

  const handleUpdate = async (data: InvitationData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw new Error('Sesi login Anda telah berakhir. Silakan login kembali.');
      }

      if (!user) {
        throw new Error('Anda harus login terlebih dahulu untuk menyimpan undangan.');
      }

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join('\n');
        throw new Error(`Mohon lengkapi data berikut:\n${errorMessages}`);
      }

      let customUrl = data.customSlug || generateSlug(data.brideNames, data.groomNames);

      if (!isEditing || (isEditing && customUrl !== initialData.customSlug)) {
        try {
          const isAvailable = await checkSlugAvailability(customUrl);
          if (!isAvailable) {
            const timestamp = new Date().getTime().toString().slice(-4);
            customUrl = `${customUrl}-${timestamp}`;
          }
        } catch (error) {
          console.error('Error checking slug:', error);
        }
      }

      // Convert the data to match the database schema
      const invitationData = {
        id: data.id || crypto.randomUUID(),
        user_id: user.id,
        slug: customUrl,
        custom_slug: customUrl,
        bride_names: data.brideNames,
        groom_names: data.groomNames,
        date: data.date,
        time: data.time,
        venue: data.venue,
        opening_text: data.openingText,
        invitation_text: data.invitationText,
        cover_photo: data.coverPhoto,
        bride_photo: data.bridePhoto,
        groom_photo: data.groomPhoto,
        gallery: data.gallery || [],
        social_links: data.socialLinks || [],
        bank_accounts: data.bankAccounts || [],
        message: data.message,
        google_maps_url: data.googleMapsUrl,
        google_maps_embed: data.googleMapsEmbed,
        created_at: data.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Saving invitation data:', invitationData);

      const { data: savedData, error: updateError } = await supabase
        .from('invitations')
        .upsert(invitationData, {
          onConflict: 'id',
          returning: 'minimal'
        });

      if (updateError) {
        console.error('Supabase error:', updateError);
        if (updateError.code === '23505') {
          throw new Error('URL undangan sudah digunakan. Sistem akan membuat URL alternatif.');
        }
        throw new Error(`Gagal menyimpan undangan: ${updateError.message}`);
      }

      // Convert back to frontend format
      const updatedData: InvitationData = {
        ...data,
        id: invitationData.id,
        customSlug: invitationData.slug,
        createdAt: invitationData.created_at,
        updatedAt: invitationData.updated_at
      };

      onUpdate(updatedData);
      return true;
    } catch (error) {
      console.error('Error saving invitation:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Terjadi kesalahan saat menyimpan undangan. Silakan coba lagi.');
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const invitationData = {
        ...formData,
        id: isEditing ? formData.id : crypto.randomUUID(),
        customSlug: customSlug || undefined,
        updatedAt: new Date().toISOString(),
      };

      await handleUpdate(invitationData);

      const finalSlug = customSlug || defaultSlug;
      const invitationUrl = `${window.location.origin}/${finalSlug}`;
      setSavedUrl(invitationUrl);

      if (!isEditing) {
        setFormData({
          brideNames: '',
          groomNames: '',
          openingText: 'Bersama keluarga mereka',
          invitationText: 'Mengundang kehadiran Anda',
          gallery: [],
          socialLinks: [],
          bankAccounts: []
        });
        setCustomSlug('');
      }

      alert('Undangan berhasil disimpan!');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = sanitizeSlug(e.target.value);
    setCustomSlug(newSlug);

    if (newSlug && newSlug !== initialData.customSlug) {
      const isAvailable = await checkSlugAvailability(newSlug);
      if (!isAvailable) {
        setSlugError('URL ini sudah digunakan. Silakan pilih yang lain.');
      } else {
        setSlugError('');
      }
    } else {
      setSlugError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedUrl && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Bagikan undangan Anda:</h3>
          <CopyLinkButton url={savedUrl} />
        </div>
      )}

      {/* Foto Sampul */}
      <ImageUpload
        label="Foto Sampul"
        value={formData.coverPhoto}
        onChange={(base64) => {
          handleImageUpload('coverPhoto', base64);
        }}
        onClear={() => {
          handleImageUpload('coverPhoto', undefined);
        }}
      />

      {/* Foto Mempelai */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageUpload
          label="Foto Mempelai Wanita"
          value={formData.bridePhoto}
          onChange={(base64) => {
            handleImageUpload('bridePhoto', base64);
          }}
          onClear={() => {
            handleImageUpload('bridePhoto', undefined);
          }}
        />
        <ImageUpload
          label="Foto Mempelai Pria"
          value={formData.groomPhoto}
          onChange={(base64) => {
            handleImageUpload('groomPhoto', base64);
          }}
          onClear={() => {
            handleImageUpload('groomPhoto', undefined);
          }}
        />
      </div>

      {/* Nama Lengkap */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="brideNames"
            value={formData.brideNames}
            onChange={handleFieldChange}
            placeholder="Nama Mempelai Wanita"
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="text"
            name="groomNames"
            value={formData.groomNames}
            onChange={handleFieldChange}
            placeholder="Nama Mempelai Pria"
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tautan Khusus */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Link className="inline-block mr-2 w-4 h-4" />
          Tautan Khusus
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setCustomSlug('')}
            className="px-4 py-2 text-sm text-gray-600 rounded-md border border-gray-300 hover:text-gray-700 hover:bg-gray-50"
          >
            Atur Ulang
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{window.location.origin}/</span>
            <input
              type="text"
              value={customSlug}
              onChange={handleSlugChange}
              placeholder={defaultSlug}
              className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                slugError ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {slugError && (
            <p className="text-sm text-red-500">{slugError}</p>
          )}
          {!customSlug && (
            <p className="text-sm text-gray-500">
              Biarkan kosong untuk menggunakan URL default berdasarkan nama
            </p>
          )}
        </div>
      </div>

      {/* Teks Pembuka */}
      <div className="space-y-2">
        <RichTextEditor
          label="Teks Pembuka"
          value={formData.openingText || ''}
          onChange={(value) => {
            handleRichTextChange('openingText', value);
          }}
          height={150}
        />
      </div>

      {/* Teks Undangan */}
      <div className="space-y-2">
        <RichTextEditor
          label="Teks Undangan"
          value={formData.invitationText || ''}
          onChange={(value) => {
            handleRichTextChange('invitationText', value);
          }}
          height={150}
        />
      </div>

      {/* Tanggal dan Waktu Pernikahan */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block mr-2 w-4 h-4" />
            Tanggal Pernikahan
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFieldChange}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {fieldErrors.date && (
            <p className="text-sm text-red-500">{fieldErrors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Clock className="inline-block mr-2 w-4 h-4" />
            Waktu Akad/Resepsi
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleFieldChange}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {fieldErrors.time && (
            <p className="text-sm text-red-500">{fieldErrors.time}</p>
          )}
        </div>
      </div>

      {/* Lokasi Acara */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block mr-2 w-4 h-4" />
          Lokasi Acara
        </label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleFieldChange}
          placeholder="Masukkan lokasi acara pernikahan"
          className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        {fieldErrors.venue && (
          <p className="text-sm text-red-500">{fieldErrors.venue}</p>
        )}
      </div>

      {/* Tautan Google Maps */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block mr-2 w-4 h-4" />
          Tautan Google Maps
        </label>
        <input
          type="text"
          value={formData.googleMapsUrl || ''}
          onChange={handleGoogleMapsChange}
          placeholder="Tempel tautan Google Maps (g.co/...)"
          className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Galeri Foto */}
      <GalleryUpload
        images={formData.gallery || []}
        onChange={(gallery) => {
          handleImageUpload('gallery', gallery);
        }}
        label="Galeri Foto"
      />

      {/* Media Sosial */}
      <div className="p-4 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Media Sosial</h3>
          <button
            type="button"
            onClick={() => setShowSocialLinks(!showSocialLinks)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 bg-white rounded-md border border-pink-200 hover:bg-pink-50 transition-colors duration-200"
          >
            {showSocialLinks ? (
              <>
                <Minus className="mr-1.5 w-4 h-4" />
                Sembunyikan
              </>
            ) : (
              <>
                <Plus className="mr-1.5 w-4 h-4" />
                Tambah Media Sosial
              </>
            )}
          </button>
        </div>
        {showSocialLinks && (
          <div className="pt-2">
            <SocialLinks
              links={formData.socialLinks || []}
              onChange={handleSocialLinksChange}
            />
          </div>
        )}
      </div>

      {/* Rekening */}
      <div className="p-4 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Rekening Bank</h3>
          <button
            type="button"
            onClick={() => setShowBankAccounts(!showBankAccounts)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 bg-white rounded-md border border-pink-200 hover:bg-pink-50 transition-colors duration-200"
          >
            {showBankAccounts ? (
              <>
                <Minus className="mr-1.5 w-4 h-4" />
                Sembunyikan
              </>
            ) : (
              <>
                <Plus className="mr-1.5 w-4 h-4" />
                Tambah Rekening
              </>
            )}
          </button>
        </div>
        {showBankAccounts && (
          <div className="pt-2">
            <BankAccounts
              accounts={formData.bankAccounts || []}
              onChange={handleBankAccountsChange}
            />
          </div>
        )}
      </div>

      {/* Pesan Pribadi */}
      <div className="space-y-2">
        <RichTextEditor
          label="Pesan Pribadi"
          value={formData.message || ''}
          onChange={(value) => {
            handleRichTextChange('message', value);
          }}
          height={200}
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex justify-center items-center px-6 py-3 w-full text-base font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-md border border-transparent hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="mr-2 w-5 h-5" />
        {isSaving ? 'Menyimpan...' : isEditing ? 'Perbarui Undangan' : 'Simpan Undangan'}
      </button>
    </form>
  );
};

export default InvitationForm;