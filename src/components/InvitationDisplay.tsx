import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Heart, Share2, Gift } from 'lucide-react';
import type { InvitationData } from '../types';
import RichTextDisplay from './RichTextDisplay';
import Gallery from './Gallery';
import CommentSection from './CommentSection';
import SocialLinks from './SocialLinks';
import BankAccounts from './BankAccounts';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Oops! Something went wrong</h2>
        <p className="mt-2 text-sm text-gray-600">{error.message}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D4B996] hover:bg-[#DABDAD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4B996]"
      >
        Try again
      </button>
    </div>
  </div>
);

const InvitationDisplay: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const loadInvitation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get invitations from localStorage
      const invitations: InvitationData[] = JSON.parse(localStorage.getItem('invitations') || '[]');
      
      // Find invitation by slug
      const found = invitations.find(inv => {
        const invSlug = inv.customSlug || `${inv.brideNames}-${inv.groomNames}`.toLowerCase().replace(/\s+/g, '-');
        return invSlug === slug;
      });

      if (!found) {
        throw new Error('Invitation not found');
      }

      setInvitation(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
      console.error('Error loading invitation:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const calculateTimeLeft = useCallback(() => {
    if (!invitation?.date) return null;

    const weddingDate = new Date(invitation.date + 'T' + (invitation.time || '00:00'));
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, [invitation?.date, invitation?.time]);

  useEffect(() => {
    loadInvitation();
  }, [loadInvitation]);

  useEffect(() => {
    if (!invitation?.date) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [invitation?.date, calculateTimeLeft]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${invitation?.brideNames} & ${invitation?.groomNames} Wedding Invitation`,
          text: 'You are cordially invited to our wedding celebration!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Invitation link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing invitation:', err);
      alert('Failed to share invitation. Please try again.');
    }
  }, [invitation?.brideNames, invitation?.groomNames]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4B996]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={loadInvitation}>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#DABDAD]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="relative h-96">
              <div className="absolute inset-0">
                <img
                  src={invitation.coverPhoto}
                  alt="Wedding Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 w-full p-8">
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                  {invitation.brideNames} & {invitation.groomNames}
                </h1>
                <p className="text-[#D4B996] text-xl">
                  {new Date(invitation.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-8">
              {/* Event Details */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 text-[#D4B996]">
                  <Calendar className="w-6 h-6" />
                  <span className="text-lg">{invitation.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-[#D4B996]">
                  <Clock className="w-6 h-6" />
                  <span className="text-lg">{invitation.time}</span>
                </div>
                <div className="flex items-center space-x-4 text-[#D4B996]">
                  <MapPin className="w-6 h-6" />
                  <span className="text-lg">{invitation.venue}</span>
                </div>
              </div>

              {/* Love Story */}
              <div className="mt-12">
                <h2 className="text-3xl font-serif text-[#D4B996] mb-6">Our Love Story</h2>
                <div className="prose max-w-none">
                  <RichTextDisplay content={invitation.openingText} />
                </div>
              </div>

              {/* Gallery */}
              {invitation.gallery && invitation.gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-3xl font-serif text-[#D4B996] mb-6">Our Moments</h2>
                  <Gallery images={invitation.gallery} />
                </div>
              )}

              {/* Gift Registry */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-serif text-[#D4B996]">Wedding Gift</h2>
                  <button
                    onClick={() => setShowBankAccounts(!showBankAccounts)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#D4B996] text-white hover:bg-[#DABDAD] transition-colors"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Send Gift</span>
                  </button>
                </div>
                {showBankAccounts && <BankAccounts accounts={invitation.bankAccounts} readOnly />}
              </div>

              {/* Social Sharing */}
              <div className="mt-12 flex items-center justify-center space-x-4">
                <button className="p-2 rounded-full bg-[#D4B996]/10 text-[#D4B996] hover:bg-[#D4B996]/20">
                  <Heart className="w-6 h-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-[#D4B996]/10 text-[#D4B996] hover:bg-[#D4B996]/20"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h2 className="text-3xl font-serif text-[#D4B996] mb-6">Wishes</h2>
                <CommentSection invitationId={invitation.id} />
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <SocialLinks links={invitation.socialLinks} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InvitationDisplay;
