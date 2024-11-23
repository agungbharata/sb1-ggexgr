import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Save, Link } from 'lucide-react';
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
    openingText: initialData.openingText || 'Together with their families',
    invitationText: initialData.invitationText || 'Request the pleasure of your company',
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
      setSlugError('This URL is already taken. Please choose another.');
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
    const embedUrl = url.replace('https://g.co/', 'https://www.google.com/maps/embed?pb=');

    const newData = {
      ...formData,
      googleMapsUrl: url,
      googleMapsEmbed: embedUrl,
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
      alert('Please fix the URL error before saving.');
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
    alert(isEditing ? 'Invitation updated successfully!' : 'Invitation created successfully!');

    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        brideNames: '',
        groomNames: '',
        date: '',
        time: '',
        venue: '',
        message: '',
        openingText: 'Together with their families',
        invitationText: 'Request the pleasure of your company',
      });
      setCustomSlug('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedUrl && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Share your invitation:</h3>
          <CopyLinkButton url={savedUrl} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          label="Bride's Photo"
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
          label="Groom's Photo"
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

      <ImageUpload
        label="Cover Photo"
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

      <RichTextEditor
        label="Opening Text"
        value={formData.openingText}
        onChange={(value) => {
          const newData = { ...formData, openingText: value };
          setFormData(newData);
          onUpdate(newData);
        }}
        height={150}
      />

      <RichTextEditor
        label="Invitation Text"
        value={formData.invitationText}
        onChange={(value) => {
          const newData = { ...formData, invitationText: value };
          setFormData(newData);
          onUpdate(newData);
        }}
        height={150}
      />

      <GalleryUpload
        images={formData.gallery || []}
        onChange={(images) => {
          const newData = { ...formData, gallery: images };
          setFormData(newData);
          onUpdate(newData);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bride's Names</label>
          <input
            type="text"
            name="brideNames"
            value={formData.brideNames}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter bride's names"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Groom's Names</label>
          <input
            type="text"
            name="groomNames"
            value={formData.groomNames}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter groom's names"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            <Link className="inline-block w-4 h-4 mr-2" />
            Custom URL
          </label>
          <button
            type="button"
            onClick={() => setCustomSlug('')}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
            Reset
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
              Leave empty to use the default URL based on names
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Wedding Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Clock className="inline-block w-4 h-4 mr-2" />
            Wedding Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Venue
        </label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Enter wedding venue"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Link className="inline-block w-4 h-4 mr-2" />
          Google Maps Link
        </label>
        <input
          type="url"
          name="googleMapsUrl"
          value={formData.googleMapsUrl || ''}
          onChange={handleGoogleMapsChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Paste Google Maps short link (g.co/...)"
        />
        {formData.googleMapsEmbed && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">Location Preview:</div>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={formData.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Venue Location"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Personal Message</label>
        <RichTextEditor
          value={formData.message || ''}
          onChange={(value) => handleChange({ target: { name: 'message', value } })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
          <button
            type="button"
            onClick={() => setShowSocialLinks(!showSocialLinks)}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
          >
            {showSocialLinks ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
                Hide Links
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
                Show Links
              </>
            )}
          </button>
        </div>
        {showSocialLinks && (
          <div className="mt-1 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            <SocialLinks
              links={formData.socialLinks || []}
              onChange={(links) => handleChange({ target: { name: 'socialLinks', value: links } } as any)}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Digital Gifts</label>
          <button
            type="button"
            onClick={() => setShowBankAccounts(!showBankAccounts)}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700"
          >
            {showBankAccounts ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
                Hide Accounts
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
                Show Accounts
              </>
            )}
          </button>
        </div>
        {showBankAccounts && (
          <div className="mt-1 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            <BankAccounts
              accounts={formData.bankAccounts || []}
              onChange={(accounts) => handleChange({ target: { name: 'bankAccounts', value: accounts } } as any)}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5 mr-2" />
        {isSaving ? 'Saving...' : isEditing ? 'Update Invitation' : 'Save Invitation'}
      </button>
    </form>
  );
};

export default InvitationForm;