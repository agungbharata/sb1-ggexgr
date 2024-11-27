import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TemplateSelector from '../components/TemplateSelector';
import type { InvitationData } from '../types';
import { supabase } from '../lib/supabase';

export default function InvitationPage() {
  const { invitationSlug } = useParams();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', invitationSlug)
          .single();

        if (error) throw error;

        if (data) {
          // Convert database format to frontend format
          const invitationData: InvitationData = {
            id: data.id,
            brideNames: data.bride_names,
            groomNames: data.groom_names,
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
            customSlug: data.slug,
            googleMapsUrl: data.google_maps_url,
            googleMapsEmbed: data.google_maps_embed,
            message: data.message,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          setInvitation(invitationData);
        } else {
          setError('Undangan tidak ditemukan');
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Gagal memuat undangan');
      } finally {
        setLoading(false);
      }
    };

    if (invitationSlug) {
      loadInvitation();
    }
  }, [invitationSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-pink-500">{error || 'Undangan tidak ditemukan'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      ) : invitation ? (
        <TemplateSelector
          invitation={invitation}
          onUpdate={(data) => setInvitation(data)}
          isViewOnly={true}
        />
      ) : null}
    </div>
  );
}