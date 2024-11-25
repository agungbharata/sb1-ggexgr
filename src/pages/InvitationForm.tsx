import React, { useState, useEffect } from 'react'
import { InvitationData, defaultFormData } from '../types/invitation'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CouplePhotoUpload from '../components/CouplePhotoUpload'
import GalleryUpload from '../components/GalleryUpload'
import VenuePhotoUpload from '../components/VenuePhotoUpload'
import MusicSelector from '../components/MusicSelector'

export default function InvitationForm() {
  const [formData, setFormData] = useState<InvitationData>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      loadInvitation(id)
    }
  }, [id])

  const loadInvitation = async (invitationId: string) => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single()

      if (error) throw error
      if (data) setFormData(data)
    } catch (error) {
      console.error('Error loading invitation:', error)
      alert('Error loading invitation. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = supabase.auth.user()
      if (!user) throw new Error('Not authenticated')

      const invitation = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('invitations')
        .upsert(invitation)
        .select()
        .single()

      if (error) throw error

      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving invitation:', error)
      alert('Error saving invitation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Create Your Invitation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bride Names</label>
              <input
                type="text"
                name="brideNames"
                value={formData.brideNames}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Groom Names</label>
              <input
                type="text"
                name="groomNames"
                value={formData.groomNames}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="https://goo.gl/maps/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Google Maps Embed</label>
              <input
                type="text"
                name="googleMapsEmbed"
                value={formData.googleMapsEmbed}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="<iframe>...</iframe>"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CouplePhotoUpload
              label="Bride Photo"
              imageUrl={formData.bridePhoto || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, bridePhoto: url }))}
            />
            
            <CouplePhotoUpload
              label="Groom Photo"
              imageUrl={formData.groomPhoto || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, groomPhoto: url }))}
            />
          </div>

          <VenuePhotoUpload
            images={formData.gallery || []}
            onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
          />

          <GalleryUpload
            images={formData.gallery || []}
            onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
          />
        </div>

        {/* Music */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Background Music</h2>
          <MusicSelector
            value={formData.backgroundMusic}
            onChange={(url) => setFormData(prev => ({ ...prev, backgroundMusic: url }))}
          />
        </div>

        {/* Custom Text */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Custom Text</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Text</label>
            <input
              type="text"
              name="openingText"
              value={formData.openingText}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="Bersama keluarga mereka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Invitation Text</label>
            <input
              type="text"
              name="invitationText"
              value={formData.invitationText}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="Mengundang kehadiran Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="Pesan tambahan..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Invitation'}
          </button>
        </div>
      </form>
    </div>
  )
}
