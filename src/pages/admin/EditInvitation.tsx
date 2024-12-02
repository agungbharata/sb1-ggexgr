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
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        console.log('Fetched invitation data:', data);

        if (data) {
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
            akadMapsEmbed: data.akad_maps_embed || '',
            showResepsi: data.show_resepsi || false,
            resepsiDate: data.resepsi_date || '',
            resepsiTime: data.resepsi_time || '',
            resepsiVenue: data.resepsi_venue || '',
            resepsiMapsUrl: data.resepsi_maps_url || '',
            resepsiMapsEmbed: data.resepsi_maps_embed || '',
            openingText: data.opening_text || '',
            invitationText: data.invitation_text || '',
            coverPhoto: data.cover_photo || '',
            bridePhoto: data.bride_photo || '',
            groomPhoto: data.groom_photo || '',
            gallery: data.gallery || [],
            socialLinks: data.social_links || [],
            bankAccounts: data.bank_accounts || [],
            googleMapsUrl: data.google_maps_url || '',
            googleMapsEmbed: data.google_maps_embed || '',
            template: data.template || 'javanese',
            customSlug: data.custom_slug || '',
            showMusicLibrary: data.show_music_library || false,
            backgroundMusic: data.background_music || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };

          console.log('Transformed data:', transformedData);
          setFormData(transformedData);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        alert('Error fetching invitation data: ' + error.message);
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
        bride_names: updatedData.brideNames,
        groom_names: updatedData.groomNames,
        bride_parents: updatedData.brideParents,
        groom_parents: updatedData.groomParents,
        show_akad: updatedData.showAkad,
        akad_date: updatedData.akadDate,
        akad_time: updatedData.akadTime,
        akad_venue: updatedData.akadVenue,
        akad_maps_url: updatedData.akadMapsUrl,
        akad_maps_embed: updatedData.akadMapsEmbed,
        show_resepsi: updatedData.showResepsi,
        resepsi_date: updatedData.resepsiDate,
        resepsi_time: updatedData.resepsiTime,
        resepsi_venue: updatedData.resepsiVenue,
        resepsi_maps_url: updatedData.resepsiMapsUrl,
        resepsi_maps_embed: updatedData.resepsiMapsEmbed,
        opening_text: updatedData.openingText,
        invitation_text: updatedData.invitationText,
        cover_photo: updatedData.coverPhoto,
        bride_photo: updatedData.bridePhoto,
        groom_photo: updatedData.groomPhoto,
        gallery: updatedData.gallery,
        social_links: updatedData.socialLinks,
        bank_accounts: updatedData.bankAccounts,
        google_maps_url: updatedData.googleMapsUrl,
        google_maps_embed: updatedData.googleMapsEmbed,
        template: updatedData.template,
        custom_slug: updatedData.customSlug,
        show_music_library: updatedData.showMusicLibrary,
        background_music: updatedData.backgroundMusic,
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
        brideNames: data.bride_names,
        groomNames: data.groom_names,
        brideParents: data.bride_parents,
        groomParents: data.groom_parents,
        showAkad: data.show_akad,
        akadDate: data.akad_date,
        akadTime: data.akad_time,
        akadVenue: data.akad_venue,
        akadMapsUrl: data.akad_maps_url,
        akadMapsEmbed: data.akad_maps_embed,
        showResepsi: data.show_resepsi,
        resepsiDate: data.resepsi_date,
        resepsiTime: data.resepsi_time,
        resepsiVenue: data.resepsi_venue,
        resepsiMapsUrl: data.resepsi_maps_url,
        resepsiMapsEmbed: data.resepsi_maps_embed,
        openingText: data.opening_text,
        invitationText: data.invitation_text,
        coverPhoto: data.cover_photo,
        bridePhoto: data.bride_photo,
        groomPhoto: data.groom_photo,
        gallery: data.gallery || [],
        socialLinks: data.social_links || [],
        bankAccounts: data.bank_accounts || [],
        googleMapsUrl: data.google_maps_url,
        googleMapsEmbed: data.google_maps_embed,
        template: data.template || 'javanese',
        customSlug: data.custom_slug,
        showMusicLibrary: data.show_music_library,
        backgroundMusic: data.background_music,
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
