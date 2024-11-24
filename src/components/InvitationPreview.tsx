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
    openingText = "Bersama keluarga mereka",
    invitationText = "Mengundang kehadiran Anda..",
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
    <div className="space-y-8 w-full max-w-2xl">
      <div className="overflow-hidden bg-white rounded-lg shadow-xl">
        <div 
          className="relative h-80 bg-center bg-cover"
          style={{
            backgroundImage: `url("${coverPhoto || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80'}")`,
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="flex absolute inset-0 justify-center items-center">
            <h1 className="px-4 font-serif text-4xl text-center text-white">
              {brideNames} & {groomNames}
            </h1>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="space-y-6 text-center">
            <h3 className="font-serif text-lg italic text-gray-600" dangerouslySetInnerHTML={{ __html: openingText }} />
            
            <div className="grid grid-cols-2 gap-8">
              {bridePhoto && (
                <div className="space-y-3">
                  <div className="overflow-hidden mx-auto w-40 h-40 rounded-full ring-4 ring-pink-100">
                    <img src={bridePhoto} alt={brideNames} className="object-cover w-full h-full" />
                  </div>
                  <h2 className="font-serif text-2xl text-gray-800">{brideNames}</h2>
                </div>
              )}
              {groomPhoto && (
                <div className="space-y-3">
                  <div className="overflow-hidden mx-auto w-40 h-40 rounded-full ring-4 ring-pink-100">
                    <img src={groomPhoto} alt={groomNames} className="object-cover w-full h-full" />
                  </div>
                  <h2 className="font-serif text-2xl text-gray-800">{groomNames}</h2>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center">
              <Heart className="mx-4 w-8 h-8 text-pink-500 animate-pulse" />
            </div>
            
            <p className="font-serif text-lg italic text-gray-600" dangerouslySetInnerHTML={{ __html: invitationText }} />
          </div>

          {/* Countdown Timer */}
          <div className="my-8">
            <CountdownTimer weddingDate={date} weddingTime={time} />
          </div>

          {/* Date and Time Cards - 2 columns */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            {/* Wedding Date Card */}
            <div className="p-6 text-center bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white rounded-full">
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
            <div className="p-6 text-center bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white rounded-full">
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
          <div className="p-6 bg-pink-50 rounded-xl transition-all duration-300 transform hover:shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white rounded-full">
                <MapPin className="w-6 h-6 text-pink-500" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-medium text-gray-900">Venue</h3>
                <p className="text-gray-600">{venue}</p>
              </div>
              {(googleMapsUrl || venue) && (
                <div className="mt-4 w-full">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <div className="relative" style={{ paddingBottom: '75%' }}>
                      <iframe
                        src={googleMapsEmbed}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex={0}
                      />
                    </div>
                  </div>
                  {googleMapsUrl && (
                    <div className="mt-2 text-center">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-500 transition-colors duration-200 hover:text-pink-600"
                      >
                        <Link className="mr-2 w-4 h-4" />
                        Lihat di Google Maps
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {gallery.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-center text-gray-800">Our Gallery</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {gallery.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg shadow-md transition-shadow duration-300 aspect-square hover:shadow-xl">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-center text-gray-800">Social Media</h3>
              <div className="space-y-8">
                {socialLinks.map((link, index) => (
                  <div key={index} className="p-6 space-y-3 bg-pink-50 rounded-xl">
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-gray-900">{link.title}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-500 transition-colors duration-200 hover:text-pink-600"
                      >
                        <Link className="mr-2 w-4 h-4" />
                        {link.platform}
                      </a>
                    </div>
                    {link.embedCode && (
                      <div className="overflow-hidden w-full rounded-lg shadow-lg">
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

          <div className="space-y-4 text-center">
            <p className="font-serif text-lg italic text-gray-600" dangerouslySetInnerHTML={{ __html: message }} />
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