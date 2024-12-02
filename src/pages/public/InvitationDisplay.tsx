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
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        // Transform database fields to match InvitationData type
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
          date: data.date,
          time: data.time,
          venue: data.venue,
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
          timezone: data.timezone,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setInvitation(transformedData);
      } catch (err: any) {
        console.error('Error fetching invitation:', err);
        setError('Invitation not found');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
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
