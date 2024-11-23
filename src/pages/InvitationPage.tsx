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
        const slug = generateSlug(inv.brideNames, inv.groomNames);
        return slug === invitationSlug;
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
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invitation Not Found</h1>
          <p className="text-gray-600">The invitation you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <InvitationPreview {...invitation} />
      </div>
    </div>
  );
}