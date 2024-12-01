import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { InvitationData } from '../../types/invitation';

interface ElegantTemplateProps {
  data?: InvitationData;
}

const ElegantTemplate: React.FC<ElegantTemplateProps> = ({ data }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'EEEE, d MMMM yyyy', { locale: id });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    return timeStr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="relative h-screen">
        {data?.coverPhoto ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.coverPhoto})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-violet-200" />
        )}
        
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-center">
            {data?.brideNames} & {data?.groomNames}
          </h1>
          {data?.date && (
            <p className="text-xl md:text-2xl font-light">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 space-y-24">
        {/* Opening Text */}
        <section className="text-center">
          <div 
            className="prose prose-lg mx-auto text-neutral-800"
            dangerouslySetInnerHTML={{ __html: data?.openingText || '' }}
          />
        </section>

        {/* Couple Information */}
        <section className="grid md:grid-cols-2 gap-16">
          {/* Bride */}
          <div className="text-center space-y-6">
            {data?.bridePhoto && (
              <div className="aspect-square w-64 mx-auto overflow-hidden rounded-full">
                <img 
                  src={data.bridePhoto} 
                  alt={data.brideNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl text-neutral-800 mb-2">
                {data?.brideNames}
              </h2>
              {data?.brideParents && (
                <p className="text-neutral-600">
                  Putri dari {data.brideParents}
                </p>
              )}
            </div>
          </div>

          {/* Groom */}
          <div className="text-center space-y-6">
            {data?.groomPhoto && (
              <div className="aspect-square w-64 mx-auto overflow-hidden rounded-full">
                <img 
                  src={data.groomPhoto} 
                  alt={data.groomNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl text-neutral-800 mb-2">
                {data?.groomNames}
              </h2>
              {data?.groomParents && (
                <p className="text-neutral-600">
                  Putra dari {data.groomParents}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Invitation Text */}
        <section className="text-center">
          <div 
            className="prose prose-lg mx-auto text-neutral-800"
            dangerouslySetInnerHTML={{ __html: data?.invitationText || '' }}
          />
        </section>

        {/* Events */}
        <section className="space-y-16">
          {/* Akad */}
          {data?.showAkad && (
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-3xl text-center text-neutral-800">
                Akad Nikah
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                  <p className="text-xl text-neutral-800">
                    {formatDate(data.akadDate)}
                  </p>
                  <p className="text-lg text-neutral-600">
                    {formatTime(data.akadTime)}
                  </p>
                  <p className="text-neutral-600">
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
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-3xl text-center text-neutral-800">
                Resepsi Pernikahan
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                  <p className="text-xl text-neutral-800">
                    {formatDate(data.resepsiDate)}
                  </p>
                  <p className="text-lg text-neutral-600">
                    {formatTime(data.resepsiTime)}
                  </p>
                  <p className="text-neutral-600">
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
        </section>

        {/* Personal Message */}
        {data?.message && (
          <section className="text-center bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="font-serif text-3xl text-neutral-800 mb-6">
              Pesan Pribadi
            </h3>
            <div 
              className="prose prose-lg mx-auto text-neutral-800"
              dangerouslySetInnerHTML={{ __html: data.message }}
            />
          </section>
        )}

        {/* Gallery */}
        {data?.gallery && data.gallery.length > 0 && (
          <section>
            <h3 className="font-serif text-3xl text-center text-neutral-800 mb-8">
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
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Media */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <section className="text-center">
            <h3 className="font-serif text-3xl text-neutral-800 mb-8">
              Media Sosial
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {data.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white rounded-full text-neutral-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ElegantTemplate;
