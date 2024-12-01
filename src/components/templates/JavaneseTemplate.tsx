import React, { useState, useEffect } from 'react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, MapPin } from 'react-feather';
import type { InvitationData } from '../../types/invitation';
import { getTimeWithZone } from '../TimeZoneSelector';
import SocialMediaPreview from '../SocialMediaPreview';

interface JavaneseTemplateProps {
  data: Partial<InvitationData>;
  isViewOnly?: boolean;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const JavaneseTemplate: React.FC<JavaneseTemplateProps> = ({ data, isViewOnly }) => {
  const [akadCountdown, setAkadCountdown] = useState<CountdownValues | null>(null);
  const [resepsiCountdown, setResepsiCountdown] = useState<CountdownValues | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'EEEE, d MMMM yyyy', { locale: id });
    } catch {
      return dateStr;
    }
  };

  const calculateCountdown = (dateStr?: string, timeStr?: string): CountdownValues | null => {
    if (!dateStr || !timeStr) return null;

    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const eventDate = new Date(dateStr);
      eventDate.setHours(hours, minutes, 0);

      const now = new Date();
      if (eventDate <= now) return null;

      const days = differenceInDays(eventDate, now);
      const remainingHours = differenceInHours(eventDate, now) % 24;
      const remainingMinutes = differenceInMinutes(eventDate, now) % 60;
      const remainingSeconds = differenceInSeconds(eventDate, now) % 60;

      return {
        days,
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (data?.showAkad && data.akadDate && data.akadTime) {
        setAkadCountdown(calculateCountdown(data.akadDate, data.akadTime));
      }
      if (data?.showResepsi && data.resepsiDate && data.resepsiTime) {
        setResepsiCountdown(calculateCountdown(data.resepsiDate, data.resepsiTime));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.akadDate, data?.akadTime, data?.resepsiDate, data?.resepsiTime]);

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
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-lg">
              <h3 className="font-serif text-3xl text-center text-[#2D1810] mb-8">
                Akad Nikah
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-6 w-full">
                  <div className="flex items-center space-x-3 text-[#2D1810]">
                    <Calendar className="w-5 h-5" />
                    <p className="text-xl">
                      {formatDate(data.akadDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[#2D1810]">
                    <Clock className="w-5 h-5" />
                    <p className="text-lg">
                      {getTimeWithZone(data.akadTime || '', data.timezone)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[#2D1810] text-center">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <p className="text-lg">
                      {data.akadVenue}
                    </p>
                  </div>
                </div>
                
                {akadCountdown && (
                  <div className="w-full p-6 bg-white/70 rounded-xl shadow-sm">
                    <p className="font-medium text-[#2D1810] mb-4 text-center">Menuju Akad Nikah:</p>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{akadCountdown.days}</p>
                        <p className="text-sm text-[#2D1810]/80">Hari</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{akadCountdown.hours}</p>
                        <p className="text-sm text-[#2D1810]/80">Jam</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{akadCountdown.minutes}</p>
                        <p className="text-sm text-[#2D1810]/80">Menit</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{akadCountdown.seconds}</p>
                        <p className="text-sm text-[#2D1810]/80">Detik</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.akadMapsEmbed && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
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
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-lg">
              <h3 className="font-serif text-3xl text-center text-[#2D1810] mb-8">
                Resepsi Pernikahan
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-6 w-full">
                  <div className="flex items-center space-x-3 text-[#2D1810]">
                    <Calendar className="w-5 h-5" />
                    <p className="text-xl">
                      {formatDate(data.resepsiDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[#2D1810]">
                    <Clock className="w-5 h-5" />
                    <p className="text-lg">
                      {getTimeWithZone(data.resepsiTime || '', data.timezone)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[#2D1810] text-center">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <p className="text-lg">
                      {data.resepsiVenue}
                    </p>
                  </div>
                </div>
                
                {resepsiCountdown && (
                  <div className="w-full p-6 bg-white/70 rounded-xl shadow-sm">
                    <p className="font-medium text-[#2D1810] mb-4 text-center">Menuju Resepsi Pernikahan:</p>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{resepsiCountdown.days}</p>
                        <p className="text-sm text-[#2D1810]/80">Hari</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{resepsiCountdown.hours}</p>
                        <p className="text-sm text-[#2D1810]/80">Jam</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{resepsiCountdown.minutes}</p>
                        <p className="text-sm text-[#2D1810]/80">Menit</p>
                      </div>
                      <div className="text-center bg-white/50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-[#2D1810]">{resepsiCountdown.seconds}</p>
                        <p className="text-sm text-[#2D1810]/80">Detik</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.resepsiMapsEmbed && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
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
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2D1810] hover:text-[#2D1810]/80"
                    >
                      {link.title || link.url}
                    </a>
                  </div>
                  <SocialMediaPreview url={link.url} width={328} className="bg-[#F6E6D9]/50" />
                </div>
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
