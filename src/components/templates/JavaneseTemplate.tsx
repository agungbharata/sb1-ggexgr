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
  const [visibleAccounts, setVisibleAccounts] = useState<{ [key: string]: boolean }>({});
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

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

  const toggleAccountVisibility = (accountId: string) => {
    setVisibleAccounts(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
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
        <div className="relative z-10 text-center text-white px-4 w-full max-w-lg mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight">
            {data?.brideNames} 
            <span className="block text-2xl sm:text-3xl md:text-4xl my-2">&</span> 
            {data?.groomNames}
          </h1>
          {data?.date && (
            <p className="text-base sm:text-lg md:text-xl font-light">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-8 space-y-12">
        {/* Opening */}
        <div className="text-center">
          <div 
            className="prose-sm sm:prose max-w-none text-[#2D1810]"
            dangerouslySetInnerHTML={{ __html: data?.openingText || '' }}
          />
        </div>

        {/* Couple */}
        <div className="space-y-12">
          {/* Bride */}
          <div className="text-center space-y-4">
            {data?.bridePhoto && (
              <div className="aspect-square w-32 sm:w-40 md:w-48 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.bridePhoto} 
                  alt={data.brideNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#2D1810] mb-2">
                {data?.brideNames}
              </h2>
              {data?.brideParents && (
                <div className="text-[#2D1810]/80">
                  <p className="text-sm sm:text-base">Putri dari:</p>
                  <p className="font-serif text-sm sm:text-base">{data.brideParents}</p>
                </div>
              )}
            </div>
          </div>

          {/* Groom */}
          <div className="text-center space-y-4">
            {data?.groomPhoto && (
              <div className="aspect-square w-32 sm:w-40 md:w-48 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.groomPhoto} 
                  alt={data.groomNames} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#2D1810] mb-2">
                {data?.groomNames}
              </h2>
              {data?.groomParents && (
                <div className="text-[#2D1810]/80">
                  <p className="text-sm sm:text-base">Putra dari:</p>
                  <p className="font-serif text-sm sm:text-base">{data.groomParents}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invitation Text */}
        <div className="text-center">
          <div 
            className="prose-sm sm:prose max-w-none text-[#2D1810]"
            dangerouslySetInnerHTML={{ __html: data?.invitationText || '' }}
          />
        </div>

        {/* Events */}
        <div className="space-y-8">
          {/* Akad */}
          {data?.showAkad && (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl text-center text-[#2D1810] mb-4">
                Akad Nikah
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2 text-[#2D1810]">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm sm:text-base">
                      {formatDate(data.akadDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#2D1810]">
                    <Clock className="w-4 h-4" />
                    <p className="text-sm sm:text-base">
                      {data.akadTime ? getTimeWithZone(data.akadTime, data.timezone) : ''}
                    </p>
                  </div>
                  {data.akadLocation && (
                    <div className="flex items-center space-x-2 text-[#2D1810]">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm sm:text-base text-center">{data.akadLocation}</p>
                    </div>
                  )}
                </div>

                {akadCountdown && (
                  <div className="grid grid-cols-4 gap-2 text-center mt-4">
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.days}</div>
                      <div className="text-xs text-[#2D1810]/80">Hari</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.hours}</div>
                      <div className="text-xs text-[#2D1810]/80">Jam</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.minutes}</div>
                      <div className="text-xs text-[#2D1810]/80">Menit</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.seconds}</div>
                      <div className="text-xs text-[#2D1810]/80">Detik</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resepsi */}
          {data?.showResepsi && (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl text-center text-[#2D1810] mb-4">
                Resepsi Pernikahan
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2 text-[#2D1810]">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm sm:text-base">
                      {formatDate(data.resepsiDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#2D1810]">
                    <Clock className="w-4 h-4" />
                    <p className="text-sm sm:text-base">
                      {data.resepsiTime ? getTimeWithZone(data.resepsiTime, data.timezone) : ''}
                    </p>
                  </div>
                  {data.resepsiLocation && (
                    <div className="flex items-center space-x-2 text-[#2D1810]">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm sm:text-base text-center">{data.resepsiLocation}</p>
                    </div>
                  )}
                </div>

                {resepsiCountdown && (
                  <div className="grid grid-cols-4 gap-2 text-center mt-4">
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.days}</div>
                      <div className="text-xs text-[#2D1810]/80">Hari</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.hours}</div>
                      <div className="text-xs text-[#2D1810]/80">Jam</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.minutes}</div>
                      <div className="text-xs text-[#2D1810]/80">Menit</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.seconds}</div>
                      <div className="text-xs text-[#2D1810]/80">Detik</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        {data?.gallery && data.gallery.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl text-center text-[#2D1810] mb-4">
              Galeri Foto
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <h3 className="font-serif text-2xl sm:text-3xl text-center text-[#2D1810] mb-4">
              Media Sosial
            </h3>
            <div className="space-y-4 w-full">
              {data.socialLinks.map((link, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 w-full">
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
                  <SocialMediaPreview url={link.url} className="bg-[#F6E6D9]/50" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        {data?.bankAccounts && data.bankAccounts.length > 0 && (
          <div className="text-center">
            <h3 className="font-serif text-2xl sm:text-3xl text-center text-[#2D1810] mb-4">
              Amplop Digital
            </h3>
            <div className="prose-sm sm:prose max-w-none text-[#2D1810] mb-8">
              <p>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless melalui:</p>
            </div>
            <div className="grid gap-6 max-w-md mx-auto">
              {data.bankAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="bg-white/50 p-6 rounded-xl space-y-4"
                >
                  <p className="text-lg font-medium text-[#2D1810]">
                    {account.bank}
                  </p>
                  <div className="space-y-2">
                    {visibleAccounts[account.accountNumber] ? (
                      <>
                        <div className="relative group">
                          <p className="text-[#2D1810] font-mono text-lg tracking-wider">
                            {account.accountNumber}
                          </p>
                          <button
                            onClick={() => handleCopyAccount(account.accountNumber)}
                            className={`absolute -right-2 top-1/2 -translate-y-1/2 p-2 text-xs rounded-md transition-all duration-200 ${
                              copiedAccount === account.accountNumber
                                ? 'bg-green-500 text-white'
                                : 'bg-[#2D1810]/10 hover:bg-[#2D1810]/20 text-[#2D1810]'
                            }`}
                          >
                            {copiedAccount === account.accountNumber ? 'Tersalin!' : 'Salin'}
                          </button>
                        </div>
                        <p className="text-[#2D1810]/80">
                          a.n {account.accountName}
                        </p>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleAccountVisibility(account.accountNumber)}
                        className="px-4 py-2 bg-[#2D1810]/10 hover:bg-[#2D1810]/20 rounded-lg text-[#2D1810] transition-colors duration-200"
                      >
                        Tampilkan Rekening
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-[#2D1810]/80 text-sm">
              <p>Setiap doa dan pemberian Anda akan sangat berarti bagi perjalanan kami ke depan.</p>
              <p>Terima kasih atas perhatian dan kebaikan hati Anda.</p>
            </div>
          </div>
        )}

        {/* Pesan Pribadi */}
        {data?.message && (
          <div className="text-center mt-16 mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl text-center text-[#2D1810] mb-4">
              Pesan Pribadi
            </h3>
            <div className="prose-sm sm:prose max-w-none text-[#2D1810] max-w-2xl px-4">
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: data.message }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JavaneseTemplate;
