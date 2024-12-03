import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import type { InvitationData } from '../../types/invitation';
import JavaneseTemplate from '../../components/templates/JavaneseTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';

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
      if (!slug) {
        setError('Invalid invitation URL');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching invitation with slug:', slug);
        
        // Try to find by custom_slug first
        let { data: invitation, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('custom_slug', slug)
          .single();

        // If not found by custom_slug, try the generated slug
        if (!invitation) {
          const { data, error: slugError } = await supabase
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .single();

          if (slugError) throw slugError;
          invitation = data;
        }

        if (!invitation) {
          throw new Error('Invitation not found');
        }

        console.log('Fetched invitation data:', invitation);

        const transformedData: InvitationData = {
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
          timeZone: invitation.time_zone || 'WIB'
        };

        console.log('Transformed invitation data:', transformedData);
        setInvitation(transformedData);
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        setError(error.message);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Invitation Not Found</h1>
        <p className="text-gray-600">The invitation you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Render template based on invitation.template
  switch (invitation.template) {
    case 'modern':
      return <ModernTemplate data={invitation} isViewOnly={true} />;
    case 'javanese':
    default:
      return <JavaneseTemplate data={invitation} isViewOnly={true} />;
  }
};

export default InvitationDisplay;
