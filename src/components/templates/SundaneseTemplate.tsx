import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { InvitationData } from '../../types/invitation';
import BaseTemplate, { BaseTemplateProps } from './BaseTemplate';

interface SundaneseTemplateProps {
  data: Partial<InvitationData>;
  isViewOnly?: boolean;
}

const SundaneseTemplate: React.FC<SundaneseTemplateProps> = ({ data, isViewOnly }) => {
  const theme = {
    backgroundColor: '#F5E6E8',
    textColor: '#2C3639',
    accentColor: '#A27B5C',
    fontFamily: '"Playfair Display", serif',
    pattern: 'url("/ornaments/sundanese-pattern.png")'
  };

  return (
    <div className="min-h-screen bg-[#F5E6E8]">
      {/* Hero Section with Sundanese Pattern */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url("/ornaments/sundanese-bg.jpg")',
          backgroundColor: 'rgba(245, 230, 232, 0.95)'
        }}
      >
        <div className="absolute inset-0 bg-[#2C3639]/20" />
        
        {/* Ornamental Frame */}
        <div className="relative z-10 text-center p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <img src="/ornaments/sundanese-ornament-top.png" alt="ornament" className="w-64 mx-auto" />
          </div>
          
          <h1 className="font-serif text-4xl text-[#2C3639] mb-4">
            {data?.brideNames || 'Nama Panganten Istri'}
          </h1>
          <div className="text-[#2C3639] text-2xl mb-4">&</div>
          <h1 className="font-serif text-4xl text-[#2C3639] mb-8">
            {data?.groomNames || 'Nama Panganten Pameget'}
          </h1>

          <div className="mb-6">
            <img src="/ornaments/sundanese-ornament-bottom.png" alt="ornament" className="w-64 mx-auto" />
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-serif text-center mb-8 text-[#2C3639]">Acara Nikah</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Akad Section */}
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-4 text-[#A27B5C]">Akad Nikah</h3>
              <p className="mb-2">{format(new Date(data?.akadDate || ''), 'EEEE, d MMMM yyyy', { locale: id })}</p>
              <p className="mb-4">{data?.akadTime || '08:00 WIB'}</p>
              <p className="text-sm">{data?.akadLocation || 'Lokasi Akad'}</p>
            </div>

            {/* Reception Section */}
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-4 text-[#A27B5C]">Resepsi</h3>
              <p className="mb-2">{format(new Date(data?.receptionDate || ''), 'EEEE, d MMMM yyyy', { locale: id })}</p>
              <p className="mb-4">{data?.receptionTime || '11:00 WIB'}</p>
              <p className="text-sm">{data?.receptionLocation || 'Lokasi Resepsi'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {data?.gallery && data.gallery.length > 0 && (
        <div className="py-16 px-4 bg-[#F5E6E8]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-8 text-[#2C3639]">Galeri Foto</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={photo} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RSVP Section */}
      {!isViewOnly && (
        <div className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-8 text-[#2C3639]">RSVP</h2>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2 rounded-lg border border-[#A27B5C] focus:outline-none focus:ring-2 focus:ring-[#A27B5C]"
                />
              </div>
              <div>
                <select className="w-full px-4 py-2 rounded-lg border border-[#A27B5C] focus:outline-none focus:ring-2 focus:ring-[#A27B5C]">
                  <option value="">Konfirmasi Kehadiran</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Jumlah Tamu"
                  className="w-full px-4 py-2 rounded-lg border border-[#A27B5C] focus:outline-none focus:ring-2 focus:ring-[#A27B5C]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#A27B5C] text-white px-8 py-2 rounded-lg hover:bg-[#8B6B4F] transition-colors"
              >
                Kirim RSVP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SundaneseTemplate;
