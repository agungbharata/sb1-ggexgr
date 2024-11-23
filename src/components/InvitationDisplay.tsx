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
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Invitation Not Found</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={loadInvitation}>
      <div className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        {invitation.coverPhoto && (
          <div className="relative h-96">
            <img
              src={invitation.coverPhoto}
              alt="Wedding Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {invitation.brideNames} & {invitation.groomNames}
            </h1>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              {invitation.bankAccounts?.length > 0 && (
                <button
                  onClick={() => setShowBankAccounts(!showBankAccounts)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Digital Gift
                </button>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold text-center mb-4">Countdown to the Big Day</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-pink-600">{timeLeft.days}</div>
                  <div className="text-sm text-gray-500">Days</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600">{timeLeft.hours}</div>
                  <div className="text-sm text-gray-500">Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600">{timeLeft.minutes}</div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600">{timeLeft.seconds}</div>
                  <div className="text-sm text-gray-500">Seconds</div>
                </div>
              </div>
            </div>
          )}

          {/* Quote */}
          {invitation.quote?.showQuote && invitation.quote.text && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <blockquote className="text-center">
                <p className="text-xl italic text-gray-900 mb-4">"{invitation.quote.text}"</p>
                {invitation.quote.source && (
                  <footer className="text-gray-600">— {invitation.quote.source}</footer>
                )}
              </blockquote>
            </div>
          )}

          {/* Opening Text */}
          <div className="prose prose-pink mx-auto mb-8">
            <RichTextDisplay content={invitation.openingText} />
          </div>

          {/* Invitation Text */}
          <div className="prose prose-pink mx-auto mb-8">
            <RichTextDisplay content={invitation.invitationText} />
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Date</h3>
                  <p className="text-gray-500">
                    {new Date(invitation.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Time</h3>
                  <p className="text-gray-500">
                    {invitation.time && new Date(`2000-01-01T${invitation.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Venue</h3>
                  <p className="text-gray-500">{invitation.venue}</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            {invitation.googleMapsEmbed && (
              <div className="mt-6">
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={invitation.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Wedding Venue Location"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {invitation.message && (
            <div className="prose prose-pink mx-auto mb-8">
              <RichTextDisplay content={invitation.message} />
            </div>
          )}

          {/* Gallery */}
          {invitation.gallery && invitation.gallery.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-center mb-4">Our Gallery</h2>
              <Gallery images={invitation.gallery} />
            </div>
          )}

          {/* Bank Accounts */}
          {showBankAccounts && invitation.bankAccounts && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold text-center mb-4">Digital Gifts</h2>
              <BankAccounts accounts={invitation.bankAccounts} readOnly />
            </div>
          )}

          {/* Social Links */}
          {invitation.socialLinks && invitation.socialLinks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold text-center mb-4">Follow Our Journey</h2>
              <SocialLinks links={invitation.socialLinks} readOnly />
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12">
            <CommentSection invitationId={invitation.id} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InvitationDisplay;
