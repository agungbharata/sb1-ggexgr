import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import type { InvitationData } from '../../types/invitation';
import { supabase } from '../../lib/supabase';

const EditInvitation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        if (!id) {
          throw new Error('Invitation ID is missing');
        }

        console.log('Current ID:', id);

        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching invitation:', error);
          throw new Error(`Failed to fetch invitation: ${error.message}`);
        }

        if (!invitation) {
          throw new Error('Invitation not found');
        }

        console.log('Fetched raw data:', invitation);

        // Transform snake_case to camelCase
        const transformedData = {
          id: invitation.id,
          brideNames: invitation.bride_names || '',
          groomNames: invitation.groom_names || '',
          brideParents: invitation.bride_parents || '',
          groomParents: invitation.groom_parents || '',
          showAkad: Boolean(invitation.show_akad),
          akadDate: invitation.akad_date || '',
          akadTime: invitation.akad_time || '',
          akadVenue: invitation.akad_venue || '',
          akadMapsUrl: invitation.akad_maps_url || '',
          showResepsi: Boolean(invitation.show_resepsi),
          resepsiDate: invitation.resepsi_date || '',
          resepsiTime: invitation.resepsi_time || '',
          resepsiVenue: invitation.resepsi_venue || '',
          resepsiMapsUrl: invitation.resepsi_maps_url || '',
          openingText: invitation.opening_text || '',
          invitationText: invitation.invitation_text || '',
          message: invitation.message || '',
          coverPhoto: invitation.cover_photo || '',
          bridePhoto: invitation.bride_photo || '',
          groomPhoto: invitation.groom_photo || '',
          gallery: Array.isArray(invitation.gallery) ? invitation.gallery : [],
          socialLinks: Array.isArray(invitation.social_links) ? invitation.social_links : [],
          bankAccounts: Array.isArray(invitation.bank_accounts) ? invitation.bank_accounts : [],
          template: invitation.template || 'javanese',
          customSlug: invitation.custom_slug || '',
          backgroundMusic: invitation.background_music || '',
          timeZone: invitation.time_zone || 'WIB',
          createdAt: invitation.created_at,
          updatedAt: invitation.updated_at
        };

        console.log('Transformed data:', transformedData);
        setFormData(transformedData);
        
        // Set invitation URL
        const slug = invitation.custom_slug || invitation.id;
        const baseUrl = window.location.origin;
        setInvitationUrl(`${baseUrl}/${slug}`);
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchInvitation:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
          alert(`Error: ${error.message}`);
        } else {
          console.error('Unknown error:', error);
          alert('Terjadi kesalahan saat mengambil data undangan. Silakan cek console untuk detail.');
        }
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id]);

  const handleUpdate = async (data: InvitationData) => {
    try {
      setSaving(true);
      setShowSuccessMessage(false);
      
      if (!id) {
        throw new Error('Invitation ID is missing');
      }

      console.log('Current ID:', id);
      console.log('Current form data:', JSON.stringify(data, null, 2));

      // Transform camelCase to snake_case
      const transformedData = {
        bride_names: data.brideNames,
        groom_names: data.groomNames,
        bride_parents: data.brideParents || '',
        groom_parents: data.groomParents || '',
        show_akad: Boolean(data.showAkad),
        akad_date: data.akadDate || '',
        akad_time: data.akadTime || '',
        akad_venue: data.akadVenue || '',
        akad_maps_url: data.akadMapsUrl || '',
        show_resepsi: Boolean(data.showResepsi),
        resepsi_date: data.resepsiDate || '',
        resepsi_time: data.resepsiTime || '',
        resepsi_venue: data.resepsiVenue || '',
        resepsi_maps_url: data.resepsiMapsUrl || '',
        opening_text: data.openingText || '',
        invitation_text: data.invitationText || '',
        message: data.message || '',
        cover_photo: data.coverPhoto || '',
        bride_photo: data.bridePhoto || '',
        groom_photo: data.groomPhoto || '',
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        social_links: Array.isArray(data.socialLinks) ? data.socialLinks : [],
        bank_accounts: Array.isArray(data.bankAccounts) ? data.bankAccounts : [],
        template: data.template || 'javanese',
        custom_slug: data.customSlug || '',
        background_music: data.backgroundMusic || ''
      };

      console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

      // Update the invitation
      const { data: updatedData, error: updateError } = await supabase
        .from('invitations')
        .update(transformedData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating invitation:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw new Error(`Failed to update invitation: ${updateError.message}`);
      }

      if (!updatedData) {
        throw new Error('No data returned after update');
      }

      console.log('Update successful:', JSON.stringify(updatedData, null, 2));
      
      // Update form data with the latest changes
      setFormData({
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Show success message and scroll to top
      setShowSuccessMessage(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error in handleUpdate:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        alert(`Error: ${error.message}`);
      } else {
        console.error('Unknown error:', error);
        alert('Terjadi kesalahan saat memperbarui undangan. Silakan cek console untuk detail.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      {showSuccessMessage && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Undangan berhasil diperbarui!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Lihat undangan Anda di:</p>
                <a
                  href={invitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-green-900"
                >
                  {invitationUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Undangan</h1>
        <button
          type="button"
          onClick={() => navigate('/admin/invitations')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Kembali
        </button>
      </div>

      {formData && (
        <InvitationForm
          initialData={formData}
          onSubmit={handleUpdate}
          isSubmitting={saving}
        />
      )}
    </div>
  );
};

export default EditInvitation;
