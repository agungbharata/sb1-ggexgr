import React from 'react';
import { Calendar, Clock, MapPin, Heart, Gift, Link } from 'lucide-react';
import type { InvitationData } from '../types';
import Comments from './Comments';
import GiftSection from './GiftSection';
import CountdownTimer from './CountdownTimer';

interface PreviewProps {
  invitation: InvitationData;
}

export default function InvitationPreview({ invitation }: PreviewProps) {
  const {
    id,
    brideNames = "Bride's Name",
    groomNames = "Groom's Name",
    date = "2024-12-31",
    time = "18:00",
    venue = "Wedding Venue",
    message = "We invite you to share in our joy...",
    openingText = "Together with their families",
    invitationText = "Request the pleasure of your company",
    bridePhoto,
    groomPhoto,
    coverPhoto,
    gallery = [],
    bankAccounts = [],
    googleMapsUrl,
    googleMapsEmbed,
    socialLinks = []
  } = invitation;

  return (
    <div className="space-y-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url("${coverPhoto || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80'}")`
          }}
        />
        
        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-gray-500 text-lg" dangerouslySetInnerHTML={{ __html: openingText }} />
            
            <div className="grid grid-cols-2 gap-8">
              {bridePhoto && (
                <div className="space-y-2">
                  <img src={bridePhoto} alt={brideNames} className="w-32 h-32 mx-auto rounded-full object-cover" />
                  <h2 className="text-2xl font-serif text-gray-800">{brideNames}</h2>
                </div>
              )}
              {groomPhoto && (
                <div className="space-y-2">
                  <img src={groomPhoto} alt={groomNames} className="w-32 h-32 mx-auto rounded-full object-cover" />
                  <h2 className="text-2xl font-serif text-gray-800">{groomNames}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Heart className="text-pink-500 w-8 h-8 mx-4" />
            </div>
            
            <p className="text-gray-600 italic" dangerouslySetInnerHTML={{ __html: invitationText }} />
          </div>

          {/* Countdown Timer */}
          <div className="my-8">
            <CountdownTimer weddingDate={date} weddingTime={time} />
          </div>

          {/* Date and Time Cards - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Wedding Date Card */}
            <div className="bg-pink-50 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-pink-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Wedding Date</h3>
                  <p className="text-gray-600">{new Date(date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>

            {/* Wedding Time Card */}
            <div className="bg-pink-50 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white p-3 rounded-full">
                  <Clock className="w-6 h-6 text-pink-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Wedding Time</h3>
                  <p className="text-gray-600">{time} WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Card - Full width */}
          <div className="bg-pink-50 rounded-xl p-6 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-3 rounded-full">
                <MapPin className="w-6 h-6 text-pink-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium text-gray-900">Venue</h3>
                <p className="text-gray-600">{venue}</p>
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-sm text-pink-500 hover:text-pink-600 mt-2"
                  >
                    <Link className="w-4 h-4 mr-1" />
                    View on Google Maps
                  </a>
                )}
              </div>
              {googleMapsEmbed && (
                <div className="w-full mt-4 aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Wedding Venue Location"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 italic" dangerouslySetInnerHTML={{ __html: message }} />
          </div>

          {gallery.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">Our Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Social Media</h3>
              <div className="space-y-8">
                {socialLinks.map((link, index) => (
                  <div key={index} className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">{link.title}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-500 hover:text-pink-600"
                      >
                        <Link className="w-4 h-4 mr-1" />
                        {link.platform}
                      </a>
                    </div>
                    {link.embedCode && (
                      <div className="w-full rounded-lg overflow-hidden">
                        <div
                          className="aspect-video"
                          dangerouslySetInnerHTML={{ __html: link.embedCode }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {id && (
        <>
          <Comments invitationId={id} />
          {bankAccounts && bankAccounts.length > 0 && (
            <GiftSection bankAccounts={bankAccounts} />
          )}
        </>
      )}
    </div>
  );
}