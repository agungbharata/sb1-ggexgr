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

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        console.log('Fetched invitation data:', invitation);

        if (invitation) {
          const transformedData = {
            id: invitation.id,
            brideNames: invitation.bride_names || '',
            groomNames: invitation.groom_names || '',
            brideParents: invitation.bride_parents || '',
            groomParents: invitation.groom_parents || '',
            showAkad: invitation.show_akad || false,
            akadDate: invitation.akad_date || '',
            akadTime: invitation.akad_time || '',
            akadVenue: invitation.akad_venue || '',
            akadMapsUrl: invitation.akad_maps_url || '',
            showResepsi: invitation.show_resepsi || false,
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
            gallery: invitation.gallery || [],
            socialLinks: invitation.social_links || [],
            bankAccounts: invitation.bank_accounts || [],
            template: invitation.template || 'javanese',
            customSlug: invitation.custom_slug || '',
            backgroundMusic: invitation.background_music || '',
            timezone: invitation.timezone || 'WIB',
            createdAt: invitation.created_at,
            updatedAt: invitation.updated_at
          };

          console.log('Transformed invitation data:', transformedData);
          setFormData(transformedData);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        alert(`Error fetching invitation: ${error.message}`);
        setLoading(false);
      }
    };

    if (id) {
      fetchInvitation();
    }
  }, [id]);

  const handleUpdate = async (updatedData: InvitationData) => {
    setSaving(true);
    try {
      // Transform back to database format
      const dbData = {
        bride_names: updatedData.brideNames || '',
        groom_names: updatedData.groomNames || '',
        bride_parents: updatedData.brideParents || '',
        groom_parents: updatedData.groomParents || '',
        show_akad: updatedData.showAkad || false,
        akad_date: updatedData.akadDate || '',
        akad_time: updatedData.akadTime || '',
        akad_venue: updatedData.akadVenue || '',
        akad_maps_url: updatedData.akadMapsUrl || '',
        show_resepsi: updatedData.showResepsi || false,
        resepsi_date: updatedData.resepsiDate || '',
        resepsi_time: updatedData.resepsiTime || '',
        resepsi_venue: updatedData.resepsiVenue || '',
        resepsi_maps_url: updatedData.resepsiMapsUrl || '',
        opening_text: updatedData.openingText || '',
        invitation_text: updatedData.invitationText || '',
        message: updatedData.message || '',
        cover_photo: updatedData.coverPhoto || '',
        bride_photo: updatedData.bridePhoto || '',
        groom_photo: updatedData.groomPhoto || '',
        gallery: updatedData.gallery || [],
        social_links: updatedData.socialLinks || [],
        bank_accounts: updatedData.bankAccounts || [],
        template: updatedData.template || 'javanese',
        custom_slug: updatedData.customSlug || '',
        background_music: updatedData.backgroundMusic || '',
        timezone: updatedData.timezone || 'WIB',
        updated_at: new Date().toISOString()
      };

      console.log('Updating invitation with data:', dbData);

      const { data, error } = await supabase
        .from('invitations')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      alert('Invitation updated successfully');
      
      // Refresh form data with the updated data
      const transformedData: InvitationData = {
        id: data.id,
        brideNames: data.bride_names || '',
        groomNames: data.groom_names || '',
        brideParents: data.bride_parents || '',
        groomParents: data.groom_parents || '',
        showAkad: data.show_akad || false,
        akadDate: data.akad_date || '',
        akadTime: data.akad_time || '',
        akadVenue: data.akad_venue || '',
        akadMapsUrl: data.akad_maps_url || '',
        showResepsi: data.show_resepsi || false,
        resepsiDate: data.resepsi_date || '',
        resepsiTime: data.resepsi_time || '',
        resepsiVenue: data.resepsi_venue || '',
        resepsiMapsUrl: data.resepsi_maps_url || '',
        openingText: data.opening_text || '',
        invitationText: data.invitation_text || '',
        message: data.message || '',
        coverPhoto: data.cover_photo || '',
        bridePhoto: data.bride_photo || '',
        groomPhoto: data.groom_photo || '',
        gallery: data.gallery || [],
        socialLinks: data.social_links || [],
        bankAccounts: data.bank_accounts || [],
        template: data.template || 'javanese',
        customSlug: data.custom_slug || '',
        backgroundMusic: data.background_music || '',
        timezone: data.timezone || 'WIB',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setFormData(transformedData);

    } catch (error: any) {
      console.error('Error updating invitation:', error);
      alert(`Error updating invitation: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((data: InvitationData) => {
    setFormData(data);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invitation not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Invitation</h1>
      </div>
      
      <InvitationForm 
        initialData={formData}
        onUpdate={handleUpdate}
        onChange={handleChange}
        isEditing={true}
      />
    </div>
  );
};

export default EditInvitation;
