import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TemplateSelector from '../components/TemplateSelector';
import SplashScreen from '../components/SplashScreen';
import { InvitationData } from '../types';
import { generateSlug } from '../utils/slug';

const Invitation: React.FC = () => {
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || '';

  useEffect(() => {
    const loadInvitation = () => {
      try {
        // Get invitation data from localStorage
        const invitationsStr = localStorage.getItem('invitations');
        console.log('Raw invitations from localStorage:', invitationsStr);
        
        if (!invitationsStr) {
          console.log('No invitations found in localStorage');
          return;
        }

        const invitations = JSON.parse(invitationsStr);
        console.log('Parsed invitations:', invitations);
        console.log('Looking for slug:', slug);

        const currentInvitation = invitations.find((inv: InvitationData) => {
          const generatedSlug = inv.customSlug || generateSlug(inv.brideNames, inv.groomNames);
          console.log('Comparing:', generatedSlug, 'with:', slug);
          return generatedSlug === slug;
        });
        
        console.log('Found invitation:', currentInvitation);
        
        if (currentInvitation) {
          setInvitation(currentInvitation);
        }
      } catch (error) {
        console.error('Error loading invitation:', error);
      }
    };

    if (slug) {
      loadInvitation();
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
          guestName={guestName}
          onEnter={() => setShowInvitation(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TemplateSelector
        templateId={invitation.theme || 'javanese'}
        data={invitation}
        isViewOnly={true}
      />
    </div>
  );
};

export default Invitation;
