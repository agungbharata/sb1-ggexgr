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
    <div className="w-full max-w-2xl space-y-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div 
          className="h-80 bg-cover bg-center relative"
          style={{
            backgroundImage: `url("${coverPhoto || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80'}")`,
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-serif text-white text-center px-4">
              {brideNames} & {groomNames}
            </h1>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="text-center space-y-6">
            <h3 className="text-gray-600 text-lg font-serif italic" dangerouslySetInnerHTML={{ __html: openingText }} />
            
            <div className="grid grid-cols-2 gap-8">
              {bridePhoto && (
                <div className="space-y-3">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-pink-100">
                    <img src={bridePhoto} alt={brideNames} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-serif text-gray-800">{brideNames}</h2>
                </div>
              )}
              {groomPhoto && (
                <div className="space-y-3">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-pink-100">
                    <img src={groomPhoto} alt={groomNames} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-serif text-gray-800">{groomNames}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Heart className="text-pink-500 w-8 h-8 mx-4 animate-pulse" />
            </div>
            
            <p className="text-gray-600 italic font-serif text-lg" dangerouslySetInnerHTML={{ __html: invitationText }} />
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
                    className="inline-flex items-center text-pink-500 hover:text-pink-600 transition-colors duration-200"
                  >
                    <Link className="w-4 h-4 mr-2" />
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

          {gallery.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-gray-800 text-center">Our Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-gray-800 text-center">Social Media</h3>
              <div className="space-y-8">
                {socialLinks.map((link, index) => (
                  <div key={index} className="space-y-3 bg-pink-50 p-6 rounded-xl">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-lg">{link.title}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-500 hover:text-pink-600 transition-colors duration-200"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        {link.platform}
                      </a>
                    </div>
                    {link.embedCode && (
                      <div className="w-full rounded-lg overflow-hidden shadow-lg">
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

          {/* Wedding Gift Section */}
          {bankAccounts && bankAccounts.length > 0 && (
            <div className="space-y-6">
              <GiftSection bankAccounts={bankAccounts} />
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-gray-600 italic font-serif text-lg" dangerouslySetInnerHTML={{ __html: message }} />
            <div className="pt-4">
              <p className="text-sm text-gray-500">Made with ❤️ by Walimah.Me</p>
            </div>
          </div>
        </div>
      </div>

      {id && (
        <>
          <Comments invitationId={id} />
        </>
      )}
    </div>
  );
}