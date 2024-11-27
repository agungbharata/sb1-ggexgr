import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { InvitationData } from '../../types/invitation';

interface JavaneseTemplateProps {
  data: Partial<InvitationData>;
  isViewOnly?: boolean;
}

const JavaneseTemplate: React.FC<JavaneseTemplateProps> = ({ data, isViewOnly }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Tanggal akan ditentukan';
    try {
      const date = new Date(dateStr);
      return format(date, 'EEEE, d MMMM yyyy', { locale: id });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6E6D9]">
      {/* Hero Section with Batik Background */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url("/ornaments/batik-bg.jpg")',
          backgroundColor: 'rgba(246, 230, 217, 0.95)'
        }}
      >
        <div className="absolute inset-0 bg-[#2D1810]/30" />
        
        {/* Ornamental Frame */}
        <div className="relative z-10 text-center p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <img src="/ornaments/javanese-ornament-top.png" alt="ornament" className="w-64 mx-auto" />
          </div>
          
          <h1 className="font-serif text-4xl text-[#2D1810] mb-4">
            {data?.brideNames || 'Nama Mempelai Wanita'}
          </h1>
          <div className="text-[#2D1810] text-2xl mb-4">&</div>
          <h1 className="font-serif text-4xl text-[#2D1810] mb-8">
            {data?.groomNames || 'Nama Mempelai Pria'}
          </h1>

          <div className="mb-6">
            <img src="/ornaments/javanese-ornament-bottom.png" alt="ornament" className="w-64 mx-auto" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#2D1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 bg-[#F6E6D9]">
        {/* Cover Photo */}
        {data?.coverPhoto && (
          <div className="mb-16">
            <img
              src={data.coverPhoto}
              alt="Cover"
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Opening */}
        <div className="text-center mb-16">
          <div 
            className="prose prose-lg mx-auto text-[#2D1810]"
            dangerouslySetInnerHTML={{ __html: data?.openingText || 'Bersama keluarga mereka' }}
          />
        </div>

        {/* Couple Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Bride */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#2D1810]/10 rounded-full" />
              {data?.bridePhoto ? (
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="w-64 h-64 mx-auto rounded-full object-cover border-4 border-[#2D1810]/20"
                />
              ) : (
                <div className="w-64 h-64 mx-auto rounded-full bg-[#2D1810]/5 flex items-center justify-center">
                  <span className="text-[#2D1810]/50">Foto Mempelai Wanita</span>
                </div>
              )}
            </div>
            <h2 className="font-serif text-2xl text-[#2D1810] mb-2">{data?.brideNames}</h2>
            <p className="text-[#2D1810]/80">Putri dari Bapak/Ibu ...</p>
          </div>

          {/* Groom */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#2D1810]/10 rounded-full" />
              {data?.groomPhoto ? (
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="w-64 h-64 mx-auto rounded-full object-cover border-4 border-[#2D1810]/20"
                />
              ) : (
                <div className="w-64 h-64 mx-auto rounded-full bg-[#2D1810]/5 flex items-center justify-center">
                  <span className="text-[#2D1810]/50">Foto Mempelai Pria</span>
                </div>
              )}
            </div>
            <h2 className="font-serif text-2xl text-[#2D1810] mb-2">{data?.groomNames}</h2>
            <p className="text-[#2D1810]/80">Putra dari Bapak/Ibu ...</p>
          </div>
        </div>

        {/* Akad Nikah */}
        {(data?.showAkad !== false) && (
          <div className="text-center mb-16">
            <div className="inline-block">
              <img src="/ornaments/javanese-divider.png" alt="divider" className="w-48 mb-8" />
            </div>
            
            <div className="space-y-4 text-[#2D1810]">
              <h3 className="font-serif text-2xl mb-4">Akad Nikah</h3>
              <p className="text-xl">{formatDate(data?.akadDate || data?.date)}</p>
              <p className="text-xl">{data?.akadTime || data?.time || 'Waktu akan ditentukan'}</p>
              <p className="text-xl">{data?.akadVenue || data?.venue || 'Lokasi akan ditentukan'}</p>
            </div>

            <div className="inline-block mt-8">
              <img src="/ornaments/javanese-divider.png" alt="divider" className="w-48 transform rotate-180" />
            </div>
          </div>
        )}

        {/* Resepsi */}
        {(data?.showResepsi !== false) && (
          <div className="text-center mb-16">
            <div className="inline-block">
              <img src="/ornaments/javanese-divider.png" alt="divider" className="w-48 mb-8" />
            </div>
            
            <div className="space-y-4 text-[#2D1810]">
              <h3 className="font-serif text-2xl mb-4">Resepsi</h3>
              <p className="text-xl">{formatDate(data?.resepsiDate || data?.date)}</p>
              <p className="text-xl">{data?.resepsiTime || data?.time || 'Waktu akan ditentukan'}</p>
              <p className="text-xl">{data?.resepsiVenue || data?.venue || 'Lokasi akan ditentukan'}</p>
            </div>

            <div className="inline-block mt-8">
              <img src="/ornaments/javanese-divider.png" alt="divider" className="w-48 transform rotate-180" />
            </div>
          </div>
        )}

        {/* Google Maps */}
        {(data?.googleMapsEmbed || data?.googleMapsUrl) && (
          <div className="mb-16">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={data.googleMapsEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(data.googleMapsUrl || '')}&output=embed`}
                className="w-full rounded-lg shadow-lg"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {data?.gallery && data.gallery.length > 0 && (
          <div className="mb-16">
            <h3 className="font-serif text-2xl text-[#2D1810] text-center mb-8">Galeri Foto</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        {data?.bankAccounts && data.bankAccounts.length > 0 && (
          <div className="text-center mb-16">
            <h3 className="font-serif text-2xl text-[#2D1810] mb-8">Amplop Digital</h3>
            <div className="space-y-6">
              {data.bankAccounts.map((account, index) => (
                <div key={index} className="bg-white/50 p-6 rounded-lg shadow-lg">
                  <p className="text-lg text-[#2D1810] mb-2">{account.bankName}</p>
                  <p className="text-lg text-[#2D1810] mb-2">{account.accountNumber}</p>
                  <p className="text-[#2D1810]/80">a.n {account.accountHolder}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <div className="mb-16">
            <h3 className="font-serif text-2xl text-[#2D1810] mb-8 text-center">Media Sosial</h3>
            <div className="grid grid-cols-1 gap-4">
              {data.socialLinks.map((link, index) => (
                <div key={index} className="w-full">
                  {link.embedCode ? (
                    <div 
                      className="w-full overflow-hidden rounded-lg shadow-lg"
                      dangerouslySetInnerHTML={{ __html: link.embedCode }}
                    />
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-white/50 py-3 rounded-lg shadow-md hover:bg-white/70 transition-colors text-[#2D1810]"
                    >
                      {link.platform}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JavaneseTemplate;
