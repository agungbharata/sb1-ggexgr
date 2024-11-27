import React, { useState, useRef, useCallback } from 'react';
import { Calendar, Clock, MapPin, Save, Link, Plus, Minus } from 'lucide-react';
import type { InvitationData } from '../types';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import BankAccounts from './BankAccounts';
import SocialLinks from './SocialLinks';
import RichTextEditor from './RichTextEditor';
import { generateSlug, isSlugUnique, sanitizeSlug } from '../utils/slug';
import CopyLinkButton from './CopyLinkButton';

interface InvitationFormProps {
  onUpdate: (data: InvitationData) => void;
  initialData: InvitationData;
  isEditing?: boolean;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  onUpdate,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<InvitationData>(() => ({
    ...initialData,
    openingText: initialData.openingText || 'Bersama keluarga mereka',
    invitationText: initialData.invitationText || 'Mengundang kehadiran Anda',
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string>('');
  const [customSlug, setCustomSlug] = useState(initialData.customSlug || '');
  const [slugError, setSlugError] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isInitialMount = useRef(true);

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

  const defaultSlug = generateSlug(formData.brideNames, formData.groomNames);
  const currentSlug = customSlug || defaultSlug;

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = sanitizeSlug(e.target.value);
    setCustomSlug(newSlug);

    if (newSlug && !isSlugUnique(newSlug) && newSlug !== initialData.customSlug) {
      setSlugError('URL ini sudah digunakan. Silakan pilih yang lain.');
    } else {
      setSlugError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFieldErrors({});

    try {
      if (slugError) {
        throw new Error('Silakan perbaiki kesalahan URL sebelum menyimpan.');
      }

      const requiredFields = {
        brideNames: 'Nama Mempelai Wanita',
        groomNames: 'Nama Mempelai Pria',
        date: 'Tanggal Pernikahan',
        time: 'Waktu Acara',
        venue: 'Lokasi Acara'
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !formData[field])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Mohon lengkapi field berikut: ${missingFields.join(', ')}`);
      }

      // Deep clone data sebelum menyimpan
      const dataToSave = JSON.parse(JSON.stringify(formData));
      
      // Update customSlug jika ada
      if (customSlug) {
        dataToSave.customSlug = customSlug;
      }

      await onUpdate(dataToSave);
      setIsSaving(false);
      setSavedUrl(`/wedding/${currentSlug}`);
      alert('Data berhasil disimpan!');
    } catch (error: any) {
      console.error('Error saving invitation:', error);
      setIsSaving(false);
      setFieldErrors(prev => ({
        ...prev,
        submit: error.message || 'Error saving invitation. Please try again.'
      }));
      alert(error.message || 'Gagal menyimpan undangan. Silakan coba lagi.');
    }
  };

  const handleImageUpload = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGoogleMapsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        query = formData.venue;
      }

      if (query) {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      }
    }

    setFormData(prev => ({
      ...prev,
      googleMapsUrl: url,
      googleMapsEmbed: embedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(formData.venue)}&output=embed`,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
        onChange={(base64) => handleImageUpload('coverPhoto', base64)}
        onClear={() => handleImageUpload('coverPhoto', undefined)}
      />

      {/* Foto Mempelai */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageUpload
          label="Foto Mempelai Wanita"
          value={formData.bridePhoto}
          onChange={(base64) => handleImageUpload('bridePhoto', base64)}
          onClear={() => handleImageUpload('bridePhoto', undefined)}
        />
        <ImageUpload
          label="Foto Mempelai Pria"
          value={formData.groomPhoto}
          onChange={(base64) => handleImageUpload('groomPhoto', base64)}
          onClear={() => handleImageUpload('groomPhoto', undefined)}
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
          onChange={(value) => handleInputChange('openingText', value)}
          height={150}
        />
      </div>

      {/* Teks Undangan */}
      <div className="space-y-2">
        <RichTextEditor
          label="Teks Undangan"
          value={formData.invitationText || ''}
          onChange={(value) => handleInputChange('invitationText', value)}
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
        onChange={(urls) => {
          setFormData(prev => ({
            ...prev,
            gallery: urls
          }));
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
              onChange={(socialLinks) => {
                const newData = { ...formData, socialLinks };
                setFormData(newData);
              }}
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
              onChange={(bankAccounts) => {
                const newData = { ...formData, bankAccounts };
                setFormData(newData);
              }}
            />
          </div>
        )}
      </div>

      {/* Pesan Pribadi */}
      <div className="space-y-2">
        <RichTextEditor
          label="Pesan Pribadi"
          value={formData.message || ''}
          onChange={(value) => handleInputChange('message', value)}
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