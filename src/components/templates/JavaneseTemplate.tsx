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
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'EEEE, d MMMM yyyy', { locale: id });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6E6D9]">
      {/* Cover Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: data?.coverPhoto ? `url(${data.coverPhoto})` : 'url("/ornaments/batik-bg.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            {data?.brideNames} & {data?.groomNames}
          </h1>
          {data?.date && (
            <p className="text-xl md:text-2xl font-light">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-24">
        {/* Opening */}
        <div className="text-center">
          <div 
            className="prose prose-lg mx-auto text-[#2D1810]"
            dangerouslySetInnerHTML={{ __html: data?.openingText || '' }}
          />
        </div>

        {/* Couple */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Bride */}
          <div className="text-center space-y-6">
            {data?.bridePhoto && (
              <div className="aspect-square w-64 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.bridePhoto} 
                  alt={data.brideNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl text-[#2D1810] mb-2">
                {data?.brideNames}
              </h2>
              {data?.brideParents && (
                <div className="text-[#2D1810]/80 space-y-1">
                  <p className="font-medium">Putri dari:</p>
                  <p className="font-serif">{data.brideParents}</p>
                </div>
              )}
            </div>
          </div>

          {/* Groom */}
          <div className="text-center space-y-6">
            {data?.groomPhoto && (
              <div className="aspect-square w-64 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.groomPhoto} 
                  alt={data.groomNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl text-[#2D1810] mb-2">
                {data?.groomNames}
              </h2>
              {data?.groomParents && (
                <div className="text-[#2D1810]/80 space-y-1">
                  <p className="font-medium">Putra dari:</p>
                  <p className="font-serif">{data.groomParents}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invitation Text */}
        <div className="text-center">
          <div 
            className="prose prose-lg mx-auto text-[#2D1810]"
            dangerouslySetInnerHTML={{ __html: data?.invitationText || '' }}
          />
        </div>

        {/* Events */}
        <div className="space-y-16">
          {/* Akad */}
          {data?.showAkad && (
            <div className="bg-white/50 rounded-2xl p-8 space-y-6">
              <h3 className="font-serif text-3xl text-center text-[#2D1810]">
                Akad Nikah
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                  <p className="text-xl text-[#2D1810]">
                    {formatDate(data.akadDate)}
                  </p>
                  <p className="text-lg text-[#2D1810]/80">
                    {data.akadTime}
                  </p>
                  <p className="text-[#2D1810]/80">
                    {data.akadVenue}
                  </p>
                </div>
                {data.akadMapsEmbed && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={data.akadMapsEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resepsi */}
          {data?.showResepsi && (
            <div className="bg-white/50 rounded-2xl p-8 space-y-6">
              <h3 className="font-serif text-3xl text-center text-[#2D1810]">
                Resepsi Pernikahan
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                  <p className="text-xl text-[#2D1810]">
                    {formatDate(data.resepsiDate)}
                  </p>
                  <p className="text-lg text-[#2D1810]/80">
                    {data.resepsiTime}
                  </p>
                  <p className="text-[#2D1810]/80">
                    {data.resepsiVenue}
                  </p>
                </div>
                {data.resepsiMapsEmbed && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={data.resepsiMapsEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        {data?.gallery && data.gallery.length > 0 && (
          <div>
            <h3 className="font-serif text-3xl text-center text-[#2D1810] mb-8">
              Galeri Foto
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((photo, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-center">
            <h3 className="font-serif text-3xl text-[#2D1810] mb-8">
              Media Sosial
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {data.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/50 rounded-full text-[#2D1810] hover:bg-white/70 transition-colors"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        {data?.bankAccounts && data.bankAccounts.length > 0 && (
          <div className="text-center">
            <h3 className="font-serif text-3xl text-[#2D1810] mb-8">
              Amplop Digital
            </h3>
            <div className="grid gap-6 max-w-md mx-auto">
              {data.bankAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="bg-white/50 p-6 rounded-xl space-y-2"
                >
                  <p className="text-lg font-medium text-[#2D1810]">
                    {account.bank_name}
                  </p>
                  <p className="text-[#2D1810]">
                    {account.account_number}
                  </p>
                  <p className="text-[#2D1810]/80">
                    a.n {account.account_holder}
                  </p>
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
