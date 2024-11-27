import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { InvitationData } from '../../types/invitation';
import BaseTemplate, { BaseTemplateProps } from './BaseTemplate';

interface ModernTemplateProps {
  data: Partial<InvitationData>;
  isViewOnly?: boolean;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, isViewOnly }) => {
  const theme = {
    backgroundColor: '#FFFFFF',
    textColor: '#2C3E50',
    accentColor: '#E67E22',
    fontFamily: '"Montserrat", sans-serif',
    pattern: 'url("/ornaments/modern-pattern.png")'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Modern Design */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url("/ornaments/modern-bg.jpg")',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C3E50]/50 to-transparent" />
        
        {/* Modern Frame */}
        <div className="relative z-10 text-center p-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-1 bg-[#E67E22] mx-auto mb-4" />
            <p className="text-white text-lg mb-4">We're Getting Married</p>
          </div>
          
          <h1 className="font-sans text-5xl font-light text-white mb-4">
            {data?.brideNames || 'Bride Name'}
          </h1>
          <div className="text-white text-3xl font-light mb-4">&</div>
          <h1 className="font-sans text-5xl font-light text-white mb-8">
            {data?.groomNames || 'Groom Name'}
          </h1>

          <div className="mt-8">
            <div className="w-16 h-1 bg-[#E67E22] mx-auto" />
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-[#2C3E50]">Save the Date</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Ceremony Section */}
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-light mb-4 text-[#E67E22]">The Ceremony</h3>
              <p className="mb-2 text-lg">{format(new Date(data?.akadDate || ''), 'EEEE, d MMMM yyyy', { locale: id })}</p>
              <p className="mb-4 text-gray-600">{data?.akadTime || '10:00'}</p>
              <p className="text-sm text-gray-500">{data?.akadLocation || 'Ceremony Location'}</p>
            </div>

            {/* Reception Section */}
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-light mb-4 text-[#E67E22]">The Reception</h3>
              <p className="mb-2 text-lg">{format(new Date(data?.receptionDate || ''), 'EEEE, d MMMM yyyy', { locale: id })}</p>
              <p className="mb-4 text-gray-600">{data?.receptionTime || '12:00'}</p>
              <p className="text-sm text-gray-500">{data?.receptionLocation || 'Reception Location'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {data?.gallery && data.gallery.length > 0 && (
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-12 text-[#2C3E50]">Our Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {data.gallery.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={photo} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RSVP Section */}
      {!isViewOnly && (
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-12 text-[#2C3E50]">RSVP</h2>
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                />
              </div>
              <div>
                <select className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent">
                  <option value="">Will you attend?</option>
                  <option value="hadir">Joyfully Accept</option>
                  <option value="tidak_hadir">Regretfully Decline</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Number of Guests"
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-[#E67E22] text-white px-12 py-3 rounded-lg hover:bg-[#D35400] transition-colors font-medium"
              >
                Send RSVP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
