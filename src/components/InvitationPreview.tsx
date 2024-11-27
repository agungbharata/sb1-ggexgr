import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { InvitationData } from '../types/invitation';

interface InvitationPreviewProps {
  data?: Partial<InvitationData>;
  selectedTheme?: string;
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  data = {}, 
  selectedTheme = 'javanese' 
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return format(date, 'EEEE, d MMMM yyyy', { locale: id });
    } catch (error) {
      return dateStr;
    }
  };

  const getThemeStyles = () => {
    switch (selectedTheme) {
      case 'javanese':
        return {
          backgroundColor: '#F3E5D7',
          textColor: '#4A3728',
          accentColor: '#8B6E4E',
          fontFamily: '"Playfair Display", serif',
          pattern: 'url("/patterns/batik-pattern.png")'
        };
      case 'sundanese':
        return {
          backgroundColor: '#E8F3E8',
          textColor: '#2C4F2C',
          accentColor: '#5B8C5B',
          fontFamily: '"Montserrat", sans-serif',
          pattern: 'url("/patterns/sunda-pattern.png")'
        };
      case 'minang':
        return {
          backgroundColor: '#F7E8D0',
          textColor: '#7D4427',
          accentColor: '#B87B3C',
          fontFamily: '"Cormorant Garamond", serif',
          pattern: 'url("/patterns/minang-pattern.png")'
        };
      case 'bali':
        return {
          backgroundColor: '#FFF5E6',
          textColor: '#8B4513',
          accentColor: '#CD853F',
          fontFamily: '"Poppins", sans-serif',
          pattern: 'url("/patterns/bali-pattern.png")'
        };
      default:
        return {
          backgroundColor: '#F3E5D7',
          textColor: '#4A3728',
          accentColor: '#8B6E4E',
          fontFamily: '"Playfair Display", serif',
          pattern: 'url("/patterns/batik-pattern.png")'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className="relative p-8 rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: theme.pattern,
            backgroundRepeat: 'repeat',
            zIndex: 0
          }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-8 text-center">
          {/* Cover Photo */}
          {data?.coverPhoto && (
            <div className="mb-8">
              <img
                src={data.coverPhoto}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Opening */}
          <div className="mb-8">
            <div 
              className="text-lg mb-4"
              dangerouslySetInnerHTML={{ __html: data?.openingText || 'Bersama keluarga mereka' }}
            />
          </div>

          {/* Couple Photos */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Bride */}
            <div className="text-center">
              {data?.bridePhoto && (
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="w-40 h-40 mx-auto rounded-full object-cover mb-4"
                />
              )}
              <h2 className="text-2xl font-semibold" style={{ color: theme.accentColor }}>
                {data?.brideNames || 'Nama Mempelai Wanita'}
              </h2>
            </div>

            {/* Groom */}
            <div className="text-center">
              {data?.groomPhoto && (
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="w-40 h-40 mx-auto rounded-full object-cover mb-4"
                />
              )}
              <h2 className="text-2xl font-semibold" style={{ color: theme.accentColor }}>
                {data?.groomNames || 'Nama Mempelai Pria'}
              </h2>
            </div>
          </div>

          {/* Invitation Text */}
          <div 
            className="text-lg mb-8"
            dangerouslySetInnerHTML={{ __html: data?.invitationText || 'Mengundang kehadiran Anda' }}
          />

          {/* Date & Time */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.accentColor }}>
              Waktu & Tempat
            </h3>
            <p className="text-lg mb-2">{formatDate(data?.date)}</p>
            <p className="text-lg mb-4">{data?.time || 'Waktu akan ditentukan'}</p>
            <p className="text-lg">{data?.venue || 'Lokasi akan ditentukan'}</p>
          </div>

          {/* Google Maps */}
          {data?.googleMapsEmbed && (
            <div className="mb-8">
              <iframe
                src={data.googleMapsEmbed}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
          )}

          {/* Gallery */}
          {data?.gallery && data.gallery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.accentColor }}>
                Galeri Foto
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.gallery.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          {data?.message && (
            <div className="mb-8">
              <div 
                className="text-lg italic"
                dangerouslySetInnerHTML={{ __html: data.message }}
              />
            </div>
          )}

          {/* Social Links */}
          {data?.socialLinks && data.socialLinks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.accentColor }}>
                Media Sosial
              </h3>
              <div className="flex justify-center space-x-4">
                {data.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:underline"
                    style={{ color: theme.accentColor }}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bank Accounts */}
          {data?.bankAccounts && data.bankAccounts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.accentColor }}>
                Rekening
              </h3>
              <div className="space-y-4">
                {data.bankAccounts.map((account, index) => (
                  <div key={index} className="text-lg">
                    <p className="font-semibold">{account.bankName}</p>
                    <p>{account.accountNumber}</p>
                    <p>{account.accountName}</p>
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

export default InvitationPreview;