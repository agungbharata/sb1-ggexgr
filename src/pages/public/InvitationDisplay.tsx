import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

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
  const [invitation, setInvitation] = useState<Invitation | null>(null);
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

        setInvitation(data);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      {invitation.cover_photo && (
        <div className="relative h-96">
          <img
            src={invitation.cover_photo}
            alt="Wedding Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {invitation.bride_names} & {invitation.groom_names}
          </h1>
          
          <p className="mt-4 text-xl text-gray-600">
            {invitation.opening_text}
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-lg text-gray-700">
              {invitation.invitation_text}
            </p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">When & Where</h2>
              <div className="mt-4">
                <p className="text-lg text-gray-700">{invitation.date}</p>
                <p className="text-lg text-gray-700">{invitation.time}</p>
                <p className="text-lg text-gray-700">{invitation.venue}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          {invitation.google_maps_embed && (
            <div className="mt-12">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={invitation.google_maps_embed}
                  className="w-full h-96 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {invitation.google_maps_url && (
                <a
                  href={invitation.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-emerald-600 hover:text-emerald-500"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          )}

          {/* Gallery */}
          {invitation.gallery && invitation.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {invitation.gallery.map((photo, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1">
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationDisplay;
