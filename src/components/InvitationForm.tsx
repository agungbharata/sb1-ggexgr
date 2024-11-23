import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Save, Link } from 'lucide-react';
import type { InvitationData } from '../types';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import BankAccounts from './BankAccounts';
import SocialLinks from './SocialLinks';
import RichTextEditor from './RichTextEditor';
import { generateSlug } from '../utils/slug';
import CopyLinkButton from './CopyLinkButton';

interface FormProps {
  onUpdate: (data: InvitationData) => void;
  initialData: InvitationData;
}

export default function InvitationForm({ onUpdate, initialData }: FormProps) {
  const [formData, setFormData] = useState<InvitationData>({
    ...initialData,
    openingText: initialData.openingText || 'Together with their families',
    invitationText: initialData.invitationText || 'Request the pleasure of your company'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value
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
      googleMapsEmbed: embedUrl
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brideNames || !formData.groomNames) {
      alert('Please enter both bride and groom names');
      return;
    }

    setIsSaving(true);
    
    try {
      const invitations: InvitationData[] = JSON.parse(localStorage.getItem('invitations') || '[]');
      const slug = generateSlug(formData.brideNames, formData.groomNames);
      
      const newInvitation: InvitationData = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      const existingIndex = invitations.findIndex(inv => 
        generateSlug(inv.brideNames, inv.groomNames) === slug
      );

      if (existingIndex >= 0) {
        invitations[existingIndex] = newInvitation;
      } else {
        invitations.push(newInvitation);
      }

      localStorage.setItem('invitations', JSON.stringify(invitations));
      const invitationUrl = `${window.location.origin}/${slug}`;
      setSavedUrl(invitationUrl);
      
      setFormData({
        brideNames: '',
        groomNames: '',
        date: '',
        time: '',
        venue: '',
        message: '',
        openingText: 'Together with their families',
        invitationText: 'Request the pleasure of your company',
        gallery: [],
        bankAccounts: []
      });
      onUpdate({
        brideNames: '',
        groomNames: '',
        date: '',
        time: '',
        venue: '',
        message: '',
        openingText: 'Together with their families',
        invitationText: 'Request the pleasure of your company',
        gallery: [],
        bankAccounts: []
      });
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save invitation. Please try again.');
    } finally {
      setIsSaving(false);
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
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Enter your personal message"
          required
        />
      </div>

      <SocialLinks
        links={formData.socialLinks || []}
        onChange={(links) => {
          const newData = { ...formData, socialLinks: links };
          setFormData(newData);
          onUpdate(newData);
        }}
      />

      <BankAccounts
        accounts={formData.bankAccounts || []}
        onChange={(accounts) => {
          const newData = { ...formData, bankAccounts: accounts };
          setFormData(newData);
          onUpdate(newData);
        }}
      />

      <button
        type="submit"
        disabled={isSaving}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5 mr-2" />
        {isSaving ? 'Saving...' : 'Save Invitation'}
      </button>
    </form>
  );
}