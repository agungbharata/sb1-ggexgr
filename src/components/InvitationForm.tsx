import React, { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState<InvitationData>({
    ...initialData,
    openingText: initialData.openingText || 'Bersama keluarga mereka',
    invitationText: initialData.invitationText || 'Mengundang kehadiran Anda',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string>('');
  const [customSlug, setCustomSlug] = useState(initialData.customSlug || '');
  const [slugError, setSlugError] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);

  const defaultSlug = generateSlug(formData.brideNames, formData.groomNames);
  const currentSlug = customSlug || defaultSlug;

  useEffect(() => {
    if (!customSlug && (formData.brideNames || formData.groomNames)) {
      const newSlug = generateSlug(formData.brideNames, formData.groomNames);
      setCustomSlug('');
      setSlugError('');
    }
  }, [formData.brideNames, formData.groomNames]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = sanitizeSlug(e.target.value);
    setCustomSlug(newSlug);

    if (newSlug && !isSlugUnique(newSlug) && newSlug !== initialData.customSlug) {
      setSlugError('URL ini sudah digunakan. Silakan pilih yang lain.');
    } else {
      setSlugError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleGoogleMapsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    let embedUrl = '';

    if (url) {
      // Extract the location query from the URL
      let query = '';
      
      if (url.includes('place/')) {
        // Get location name from place URL
        const placePath = url.split('place/')[1];
        query = placePath.split('/')[0].split('?')[0];
      } else if (url.includes('@')) {
        // Get coordinates from URL
        const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          query = `${match[1]},${match[2]}`;
        }
      } else if (url.includes('g.co/') || url.includes('goo.gl/')) {
        // For short URLs, use the venue name
        query = formData.venue;
      }

      // Create a simple embed URL
      if (query) {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      }
    }

    const newData = {
      ...formData,
      googleMapsUrl: url,
      googleMapsEmbed: embedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(formData.venue)}&output=embed`,
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = {
      ...formData,
      [field]: value,
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (slugError) {
      alert('Silakan perbaiki kesalahan URL sebelum menyimpan.');
      return;
    }

    const invitationData = {
      ...formData,
      id: isEditing ? formData.id : crypto.randomUUID(),
      customSlug: customSlug || undefined,
      createdAt: isEditing ? formData.createdAt : new Date().toISOString(),
    };

    // Get existing invitations
    const existingInvitations = JSON.parse(localStorage.getItem('invitations') || '[]');

    let updatedInvitations;
    if (isEditing) {
      // Update existing invitation
      updatedInvitations = existingInvitations.map((inv: InvitationData) =>
        inv.id === invitationData.id ? invitationData : inv
      );
    } else {
      // Add new invitation
      updatedInvitations = [...existingInvitations, invitationData];
    }

    // Save to localStorage
    localStorage.setItem('invitations', JSON.stringify(updatedInvitations));

    // Update URL
    const finalSlug = generateSlug(invitationData.brideNames, invitationData.groomNames, invitationData.customSlug);
    const invitationUrl = `${window.location.origin}/${finalSlug}`;
    setSavedUrl(invitationUrl);

    // Show success message
    alert(isEditing ? 'Undangan berhasil diperbarui!' : 'Undangan berhasil disimpan!');

    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        brideNames: '',
        groomNames: '',
        date: '',
        time: '',
        venue: '',
        message: '',
        openingText: 'Bersama keluarga mereka',
        invitationText: 'Mengundang kehadiran Anda',
      });
      setCustomSlug('');
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
          const newData = { ...formData, coverPhoto: base64 };
          setFormData(newData);
          onUpdate(newData);
        }}
        onClear={() => {
          const newData = { ...formData, coverPhoto: undefined };
          setFormData(newData);
          onUpdate(newData);
        }}
      />

      {/* Foto Mempelai */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageUpload
          label="Foto Mempelai Wanita"
          value={formData.bridePhoto}
          onChange={(base64) => {
            const newData = { ...formData, bridePhoto: base64 };
            setFormData(newData);
            onUpdate(newData);
          }}
          onClear={() => {
            const newData = { ...formData, bridePhoto: undefined };
            setFormData(newData);
            onUpdate(newData);
          }}
        />
        <ImageUpload
          label="Foto Mempelai Pria"
          value={formData.groomPhoto}
          onChange={(base64) => {
            const newData = { ...formData, groomPhoto: base64 };
            setFormData(newData);
            onUpdate(newData);
          }}
          onClear={() => {
            const newData = { ...formData, groomPhoto: undefined };
            setFormData(newData);
            onUpdate(newData);
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
            onChange={handleChange}
            placeholder="Nama Mempelai Wanita"
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="text"
            name="groomNames"
            value={formData.groomNames}
            onChange={handleChange}
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
            onChange={handleChange}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
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
            onChange={handleChange}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
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
          onChange={handleChange}
          placeholder="Masukkan lokasi acara pernikahan"
          className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
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
          const newData = { ...formData, gallery };
          setFormData(newData);
          onUpdate(newData);
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
                onUpdate(newData);
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
                onUpdate(newData);
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