import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import type { InvitationData } from '../../types/invitation';
import JavaneseTemplate from '../../components/templates/JavaneseTemplate';

interface Invitation {
  id: string;
  bride_names: string;
  groom_names: string;
  date: string;
  time: string;
  venue: string;
  opening_text: string;
  invitation_text: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery?: string[];
  google_maps_url?: string;
  google_maps_embed?: string;
}

const InvitationDisplay: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('custom_slug', slug)
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
            akadMapsEmbed: invitation.akad_maps_embed || '',
            showResepsi: invitation.show_resepsi || false,
            resepsiDate: invitation.resepsi_date || '',
            resepsiTime: invitation.resepsi_time || '',
            resepsiVenue: invitation.resepsi_venue || '',
            resepsiMapsUrl: invitation.resepsi_maps_url || '',
            resepsiMapsEmbed: invitation.resepsi_maps_embed || '',
            openingText: invitation.opening_text || '',
            invitationText: invitation.invitation_text || '',
            message: invitation.message || '',
            coverPhoto: invitation.cover_photo || '',
            bridePhoto: invitation.bride_photo || '',
            groomPhoto: invitation.groom_photo || '',
            gallery: invitation.gallery || [],
            socialLinks: invitation.social_links || [],
            bankAccounts: invitation.bank_accounts || [],
            googleMapsUrl: invitation.google_maps_url || '',
            googleMapsEmbed: invitation.google_maps_embed || '',
            template: invitation.template || 'javanese',
            customSlug: invitation.custom_slug || '',
            showMusicLibrary: invitation.show_music_library || false,
            backgroundMusic: invitation.background_music || '',
            timezone: invitation.timezone || 'WIB',
            createdAt: invitation.created_at,
            updatedAt: invitation.updated_at
          };

          console.log('Transformed invitation data:', transformedData);
          setInvitation(transformedData);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (slug) {
      fetchInvitation();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Invitation Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The invitation you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Render the invitation using JavaneseTemplate
  return <JavaneseTemplate data={invitation} isViewOnly={true} />;
};

export default InvitationDisplay;
