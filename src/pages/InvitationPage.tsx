import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvitationPreview from '../components/InvitationPreview';
import type { InvitationData } from '../types';
import { generateSlug } from '../utils/slug';

export default function InvitationPage() {
  const { invitationSlug } = useParams();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvitation = () => {
      const savedInvitations: InvitationData[] = JSON.parse(localStorage.getItem('invitations') || '[]');
      const foundInvitation = savedInvitations.find(inv => {
        if (inv.customSlug) {
          return inv.customSlug === invitationSlug;
        }
        const defaultSlug = generateSlug(inv.brideNames, inv.groomNames);
        return defaultSlug === invitationSlug;
      });
      
      setInvitation(foundInvitation || null);
      setLoading(false);
    };

    loadInvitation();
  }, [invitationSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-pink-500">Loading...</div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-pink-500">Invitation not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <InvitationPreview invitation={invitation} />
      </div>
    </div>
  );
}