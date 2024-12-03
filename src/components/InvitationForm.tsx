import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Calendar, Clock, MapPin, Save, Link, Plus, Minus, Music } from 'lucide-react';
import type { InvitationData } from '../types/invitation';
import { supabase } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import TimeZoneSelector from './TimeZoneSelector';
import GalleryUpload from './GalleryUpload';
import BankAccounts from './BankAccounts';
import SocialLinks from './SocialLinks';
import RichTextEditor from './RichTextEditor';
import TemplatePreview from './TemplatePreview';
import { TemplateType } from './TemplateSelector';
import { generateSlug, isSlugUnique, sanitizeSlug } from '../utils/slug';
import CopyLinkButton from './CopyLinkButton';
import { useParams, useNavigate } from 'react-router-dom';
import { MusicLibrary } from './MusicLibrary';
import { colors } from '../styles/colors';
import { TimeZone } from '../types/invitation';

interface InvitationFormProps {
  onSubmit: (data: InvitationData) => void;
  initialData: InvitationData;
  isSubmitting?: boolean;
  isViewOnly?: boolean;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
  isViewOnly = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<InvitationData>(() => {
    console.log('Initializing form with data:', initialData);
    return initialData;
  });

  useEffect(() => {
    console.log('Initial data changed:', initialData);
    setFormData(initialData);
  }, [initialData]);

  const [error, setError] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState(initialData.customSlug || '');
  const [slugError, setSlugError] = useState('');
  const [savedUrl, setSavedUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Submitting form with data:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    console.log(`Field changed: ${name} = ${newValue}`);

    const updatedData = {
      ...formData,
      [name]: newValue,
    };

    setFormData(updatedData);
  };

  const handleRichTextChange = (field: string) => (value: string) => {
    console.log(`Rich text changed: ${field} = ${value}`);

    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);
  };

  const handleImageUpload = (field: string, base64: string | undefined) => {
    const updatedData = {
      ...formData,
      [field]: base64,
    };

    setFormData(updatedData);
  };

  const handleSocialLinksChange = (links: string[]) => {
    const updatedData = {
      ...formData,
      socialLinks: links,
    };

    setFormData(updatedData);
  };

  const handleBankAccountsChange = (accounts: string[]) => {
    const updatedData = {
      ...formData,
      bankAccounts: accounts,
    };

    setFormData(updatedData);
  };

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);

  return (
    <div className="space-y-6">
      {savedUrl && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Bagikan undangan Anda:</h3>
          <CopyLinkButton url={savedUrl} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Pilih Template Undangan</h3>
          <select
            value={formData.template}
            onChange={(e) => handleFieldChange({
              target: { name: 'template', value: e.target.value }
            } as any)}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="javanese">Template Jawa</option>
            <option value="sundanese">Template Sunda</option>
            <option value="minang">Template Minang</option>
            <option value="bali">Template Bali</option>
            <option value="modern">Template Modern</option>
          </select>
        </div>

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
              className="px-4 py-2 w-full rounded-md border border-gray-300 focus:border-transparent"
            />
            <input
              type="text"
              name="groomNames"
              value={formData.groomNames}
              onChange={handleFieldChange}
              placeholder="Nama Mempelai Pria"
              className="px-4 py-2 w-full rounded-md border border-gray-300 focus:border-transparent"
            />
          </div>
        </div>

        {/* Nama Orang Tua */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nama Orang Tua</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="brideParents"
              value={formData.brideParents}
              onChange={handleFieldChange}
              placeholder="Nama Orang Tua Mempelai Wanita"
              className="px-4 py-2 w-full rounded-md border border-gray-300 focus:border-transparent"
            />
            <input
              type="text"
              name="groomParents"
              value={formData.groomParents}
              onChange={handleFieldChange}
              placeholder="Nama Orang Tua Mempelai Pria"
              className="px-4 py-2 w-full rounded-md border border-gray-300 focus:border-transparent"
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
                name="customSlug"
                value={formData.customSlug || ''}
                onChange={handleFieldChange}
                placeholder="tautan-khusus"
                className="flex-1 px-4 py-2 border rounded-md focus:border-transparent"
              />
            </div>
            {slugError && (
              <p className="text-sm text-red-500">{slugError}</p>
            )}
          </div>
        </div>

        {/* Teks Pembuka */}
        <div className="space-y-2">
          <RichTextEditor
            label="Teks Pembuka"
            value={formData.openingText || ''}
            onChange={(value) => handleRichTextChange('openingText')(value)}
            height={150}
          />
        </div>

        {/* Teks Undangan */}
        <div className="space-y-2">
          <RichTextEditor
            label="Teks Undangan"
            value={formData.invitationText || ''}
            onChange={(value) => handleRichTextChange('invitationText')(value)}
            height={150}
          />
        </div>

        {/* Detail Acara */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">Detail Acara</h3>

          {/* Timezone Selection */}
          <TimeZoneSelector
            value={formData.timeZone || 'WIB'}
            onChange={(timezone) => {
              const updatedData = {
                ...formData,
                timeZone: timezone,
              };
              setFormData(updatedData);
            }}
            className="mb-4"
          />

          {/* Akad Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showAkad"
                name="showAkad"
                checked={formData.showAkad}
                onChange={handleFieldChange}
                className="mr-2"
              />
              <label htmlFor="showAkad">Tampilkan Acara Akad</label>
            </div>

            {formData.showAkad && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tanggal Akad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Akad
                    </label>
                    <input
                      type="date"
                      name="akadDate"
                      value={formData.akadDate || ''}
                      onChange={handleFieldChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                  </div>

                  {/* Waktu Akad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Akad
                    </label>
                    <input
                      type="time"
                      name="akadTime"
                      value={formData.akadTime || ''}
                      onChange={handleFieldChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                  </div>
                </div>

                {/* Lokasi Akad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi Akad
                  </label>
                  <input
                    type="text"
                    name="akadVenue"
                    value={formData.akadVenue || ''}
                    onChange={handleFieldChange}
                    placeholder="Masukkan lokasi akad nikah"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>

                {/* Google Maps Akad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tautan Google Maps Akad
                  </label>
                  <input
                    type="text"
                    name="akadMapsUrl"
                    value={formData.akadMapsUrl || ''}
                    onChange={handleFieldChange}
                    placeholder="Tempel tautan Google Maps untuk lokasi akad"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resepsi Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showResepsi"
                name="showResepsi"
                checked={formData.showResepsi}
                onChange={handleFieldChange}
                className="mr-2"
              />
              <label htmlFor="showResepsi">Tampilkan Acara Resepsi</label>
            </div>

            {formData.showResepsi && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tanggal Resepsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Resepsi
                    </label>
                    <input
                      type="date"
                      name="resepsiDate"
                      value={formData.resepsiDate || ''}
                      onChange={handleFieldChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                  </div>

                  {/* Waktu Resepsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Resepsi
                    </label>
                    <input
                      type="time"
                      name="resepsiTime"
                      value={formData.resepsiTime || ''}
                      onChange={handleFieldChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                  </div>
                </div>

                {/* Lokasi Resepsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi Resepsi
                  </label>
                  <input
                    type="text"
                    name="resepsiVenue"
                    value={formData.resepsiVenue || ''}
                    onChange={handleFieldChange}
                    placeholder="Masukkan lokasi resepsi"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>

                {/* Google Maps Resepsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tautan Google Maps Resepsi
                  </label>
                  <input
                    type="text"
                    name="resepsiMapsUrl"
                    value={formData.resepsiMapsUrl || ''}
                    onChange={handleFieldChange}
                    placeholder="Tempel tautan Google Maps untuk lokasi resepsi"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pesan Pribadi */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Pesan Pribadi</h3>
            <div className="mt-1">
              <RichTextEditor
                value={formData.message || ''}
                onChange={(value) => handleRichTextChange('message')(value)}
                height={200}
                placeholder="Tulis pesan pribadi Anda di sini..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Pesan ini akan ditampilkan di halaman undangan Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Music Library Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Music className="w-4 h-4" />
              <span>Musik Latar</span>
            </label>
          </div>
          <div className="mt-4">
            <MusicLibrary
              selectedMusic={formData.backgroundMusic || ''}
              onSelect={(url) => {
                setFormData((prev) => ({
                  ...prev,
                  backgroundMusic: url || undefined
                }));
              }}
            />
          </div>
        </div>

        {/* Galeri Foto */}
        <GalleryUpload
          images={formData.gallery || []}
          onChange={(gallery) => handleImageUpload('gallery', gallery)}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center items-center px-6 py-3 w-full text-base font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-md border border-transparent hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="mr-2 w-5 h-5" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Undangan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvitationForm;