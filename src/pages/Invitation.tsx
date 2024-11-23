import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InvitationPreview from '../components/InvitationPreview';
import SplashScreen from '../components/SplashScreen';
import { InvitationData } from '../types';
import { generateSlug } from '../utils/slug';

const Invitation: React.FC = () => {
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    // Get invitation data from localStorage
    const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
    const currentInvitation = invitations.find((inv: InvitationData) => 
      (inv.customSlug || generateSlug(inv.brideNames, inv.groomNames)) === slug
    );
    
    if (currentInvitation) {
      setInvitation(currentInvitation);
    }
  }, [slug]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Undangan Tidak Ditemukan</h2>
          <p className="text-gray-600">Maaf, undangan yang Anda cari tidak tersedia.</p>
        </div>
      </div>
    );
  }

  if (!showInvitation) {
    return (
      <div className="min-h-screen">
        <SplashScreen
          brideNames={invitation.brideNames}
          groomNames={invitation.groomNames}
          onEnter={() => setShowInvitation(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="container mx-auto flex justify-center">
        <InvitationPreview invitation={invitation} />
      </div>
    </div>
  );
};

export default Invitation;
