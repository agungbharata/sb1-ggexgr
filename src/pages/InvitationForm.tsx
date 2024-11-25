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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-emerald-800 mb-2">Create Your Invitation</h1>
          <p className="text-gray-600">Design your perfect wedding invitation with our easy-to-use builder</p>
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-2xl font-serif font-semibold text-emerald-800">Couple Information</h2>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bride Names</label>
                <input
                  type="text"
                  name="brideNames"
                  value={formData.brideNames}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter bride's name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groom Names</label>
                <input
                  type="text"
                  name="groomNames"
                  value={formData.groomNames}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter groom's name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-serif font-semibold text-emerald-800">Event Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter Google Maps link"
                />
              </div>
            </div>
          </div>

          {/* Photo Uploads */}
          <div className="space-y-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-serif font-semibold text-emerald-800">Photos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CouplePhotoUpload formData={formData} setFormData={setFormData} />
              </div>
              <div>
                <VenuePhotoUpload formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div>
              <GalleryUpload formData={formData} setFormData={setFormData} />
            </div>
          </div>

          {/* Music Selection */}
          <div className="space-y-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <h2 className="text-2xl font-serif font-semibold text-emerald-800">Background Music</h2>
            </div>

            <MusicSelector formData={formData} setFormData={setFormData} />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                       bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                       disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Invitation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
