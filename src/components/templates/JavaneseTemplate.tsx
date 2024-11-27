import React from 'react';
import { InvitationData } from '../../types/invitation';
import BaseTemplate, { TemplateTheme, formatDate } from './BaseTemplate';

const theme: TemplateTheme = {
  backgroundColor: '#F3E5D7',
  textColor: '#4A3728',
  accentColor: '#8B6E4E',
  fontFamily: '"Playfair Display", serif',
  pattern: 'url("/patterns/batik-pattern.png")'
};

interface JavaneseTemplateProps {
  data: Partial<InvitationData>;
}

const JavaneseTemplate: React.FC<JavaneseTemplateProps> = ({ data }) => {
  return (
    <BaseTemplate data={data} theme={theme}>
      <div className="space-y-8 text-center">
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
            className="text-lg mb-4 font-serif"
            dangerouslySetInnerHTML={{ __html: data?.openingText || 'Bersama keluarga mereka' }}
          />
        </div>

        {/* Couple Photos */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Bride */}
          <div className="text-center">
            {data?.bridePhoto && (
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-[#8B6E4E] opacity-20 rounded-full" />
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="w-full h-full rounded-full object-cover relative z-10"
                />
              </div>
            )}
            <h2 className="text-2xl font-semibold font-serif" style={{ color: theme.accentColor }}>
              {data?.brideNames || 'Nama Mempelai Wanita'}
            </h2>
          </div>

          {/* Groom */}
          <div className="text-center">
            {data?.groomPhoto && (
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-[#8B6E4E] opacity-20 rounded-full" />
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="w-full h-full rounded-full object-cover relative z-10"
                />
              </div>
            )}
            <h2 className="text-2xl font-semibold font-serif" style={{ color: theme.accentColor }}>
              {data?.groomNames || 'Nama Mempelai Pria'}
            </h2>
          </div>
        </div>

        {/* Invitation Text */}
        <div 
          className="text-lg mb-8 font-serif"
          dangerouslySetInnerHTML={{ __html: data?.invitationText || 'Mengundang kehadiran Anda' }}
        />

        {/* Date & Time */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold font-serif" style={{ color: theme.accentColor }}>
            Waktu & Tempat
          </h3>
          <div className="space-y-2">
            <p className="text-lg">{formatDate(data?.date)}</p>
            <p className="text-lg">{data?.time || 'Waktu akan ditentukan'}</p>
            <p className="text-lg">{data?.venue || 'Lokasi akan ditentukan'}</p>
          </div>
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
            <h3 className="text-xl font-semibold mb-4 font-serif" style={{ color: theme.accentColor }}>
              Galeri Foto
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-[#8B6E4E] opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        {data?.message && (
          <div className="mb-8">
            <div 
              className="text-lg italic font-serif"
              dangerouslySetInnerHTML={{ __html: data.message }}
            />
          </div>
        )}

        {/* Social Links */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 font-serif" style={{ color: theme.accentColor }}>
              Media Sosial
            </h3>
            <div className="flex justify-center space-x-4">
              {data.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:underline font-serif"
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
            <h3 className="text-xl font-semibold mb-4 font-serif" style={{ color: theme.accentColor }}>
              Rekening
            </h3>
            <div className="space-y-4">
              {data.bankAccounts.map((account, index) => (
                <div key={index} className="text-lg font-serif">
                  <p className="font-semibold">{account.bankName}</p>
                  <p>{account.accountNumber}</p>
                  <p>{account.accountName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default JavaneseTemplate;
