import React, { useState, useEffect } from 'react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { InvitationData } from '../../types/invitation';
import { getTimeWithZone } from '../TimeZoneSelector';
import SocialMediaPreview from '../SocialMediaPreview';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import BackgroundMusic from '../BackgroundMusic';
import FloatingNavigation from '../FloatingNavigation';

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
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('opening');

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['opening', 'quotes', 'mempelai', 'akad', 'resepsi'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="relative min-h-screen bg-[#F6E6D9]">
      {/* Cover Section */}
      <section 
        id="opening"
        className="flex relative justify-center items-center min-h-screen bg-center bg-cover"
        style={{ 
          backgroundImage: data?.coverPhoto ? `url(${data.coverPhoto})` : 'url("/ornaments/batik-bg.jpg")'
        }}
      >
        {/* Background Music */}
        {data?.backgroundMusic && <BackgroundMusic audioUrl={data.backgroundMusic} />}
        
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 px-4 mx-auto w-full max-w-3xl text-center text-white">
          <h1 className="mb-4 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
            {data?.brideNames} 
            <span className="block my-2 text-2xl sm:text-3xl md:text-4xl">&</span> 
            {data?.groomNames}
          </h1>
          {data?.date && (
            <p className="text-base font-light sm:text-lg md:text-xl">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="px-8 py-24 mx-auto space-y-12 max-w-3xl bg-white/95">
        {/* Opening */}
        <div className="text-center">
          <div 
            className="prose prose-lg mx-auto text-[#2D1810]"
            dangerouslySetInnerHTML={{ 
              __html: data?.openingText || '' 
            }} 
          />
        </div>

      
        {/* Couple */}
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-3xl md:grid-cols-2">
          {/* Bride */}
          <div className="space-y-4 text-center">
            {data?.bridePhoto && (
              <div className="aspect-square w-32 sm:w-40 md:w-48 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.bridePhoto} 
                  alt={data.brideNames} 
                  className="object-cover w-full h-full"
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
          <div className="space-y-4 text-center">
            {data?.groomPhoto && (
              <div className="aspect-square w-32 sm:w-40 md:w-48 mx-auto overflow-hidden rounded-full border-4 border-[#2D1810]/20">
                <img 
                  src={data.groomPhoto} 
                  alt={data.groomNames} 
                  className="object-cover w-full h-full"
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
            className="prose prose-lg mx-auto text-[#2D1810]"
            dangerouslySetInnerHTML={{ 
              __html: data?.invitationText || '' 
            }} 
          />
        </div>

        {/* Events */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Akad */}
          {data?.showAkad && (
            <div className="p-4 space-y-4 bg-[rgb(248,241,235)] rounded-xl backdrop-blur-sm">
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
                  {data?.akadTime && (
                    <div className="flex gap-2 justify-center items-center">
                      <Clock className="w-5 h-5" />
                      <span>{getTimeWithZone(data.akadTime, data.timezone || 'WIB')}</span>
                    </div>
                  )}
                  {data.akadVenue && (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2 text-[#2D1810]">
                        <MapPin className="w-4 h-4" />
                        {data.akadMapsUrl ? (
                          <a 
                            href={data.akadMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base text-center hover:text-[#2D1810]/70 transition-colors duration-200 cursor-pointer"
                            title="Klik untuk membuka di Google Maps"
                          >
                            {data.akadVenue}
                          </a>
                        ) : (
                          <p className="text-sm text-center sm:text-base">
                            {data.akadVenue}
                          </p>
                        )}
                      </div>
                      {data.akadMapsUrl && (
                        <a 
                          href={data.akadMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-[#2D1810]/10 hover:bg-[#2D1810]/20 rounded-lg text-[#2D1810] text-sm transition-colors duration-200"
                        >
                          <MapPin className="mr-2 w-4 h-4" />
                          Buka di Google Maps
                        </a>
                      )}
                      {data.akadMapsEmbed && (
                        <div className="overflow-hidden mt-2 w-full h-48 rounded-lg">
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
                  )}
                </div>

                {akadCountdown && (
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.days}</div>
                      <div className="text-xs text-[#2D1810]/80">Hari</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.hours}</div>
                      <div className="text-xs text-[#2D1810]/80">Jam</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{akadCountdown.minutes}</div>
                      <div className="text-xs text-[#2D1810]/80">Menit</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
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
            <div className="p-4 space-y-4 rounded-xl backdrop-blur-sm bg-[rgb(248,241,235)]">
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
                  {data?.resepsiTime && (
                    <div className="flex gap-2 justify-center items-center">
                      <Clock className="w-5 h-5" />
                      <span>{getTimeWithZone(data.resepsiTime, data.timezone || 'WIB')}</span>
                    </div>
                  )}
                  {data.resepsiVenue && (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2 text-[#2D1810]">
                        <MapPin className="w-4 h-4" />
                        {data.resepsiMapsUrl ? (
                          <a 
                            href={data.resepsiMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base text-center hover:text-[#2D1810]/70 transition-colors duration-200 cursor-pointer"
                            title="Klik untuk membuka di Google Maps"
                          >
                            {data.resepsiVenue}
                          </a>
                        ) : (
                          <p className="text-sm text-center sm:text-base">
                            {data.resepsiVenue}
                          </p>
                        )}
                      </div>
                      {data.resepsiMapsUrl && (
                        <a 
                          href={data.resepsiMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-[#2D1810]/10 hover:bg-[#2D1810]/20 rounded-lg text-[#2D1810] text-sm transition-colors duration-200"
                        >
                          <MapPin className="mr-2 w-4 h-4" />
                          Buka di Google Maps
                        </a>
                      )}
                      {data.resepsiMapsEmbed && (
                        <div className="overflow-hidden mt-2 w-full h-48 rounded-lg">
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
                  )}
                </div>

                {resepsiCountdown && (
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.days}</div>
                      <div className="text-xs text-[#2D1810]/80">Hari</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.hours}</div>
                      <div className="text-xs text-[#2D1810]/80">Jam</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
                      <div className="text-base sm:text-lg font-bold text-[#2D1810]">{resepsiCountdown.minutes}</div>
                      <div className="text-xs text-[#2D1810]/80">Menit</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80">
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
            <h3 className="font-serif text-xl sm:text-2xl text-center text-[#2D1810] mb-4">
              Galeri Foto
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {data.gallery.map((photo, index) => (
                <div 
                  key={index}
                  className="overflow-hidden rounded-lg transition-opacity cursor-pointer aspect-square hover:opacity-90"
                  onClick={() => {
                    setPhotoIndex(index);
                    setIsOpen(true);
                  }}
                >
                  <img
                    src={photo}
                    alt={`Gallery photo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              index={photoIndex}
              slides={data.gallery.map(src => ({ src }))}
            />
          </div>
        )}

        {/* Social Links */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-center text-[#2D1810] mb-4">
              Media Sosial
            </h3>
            <div className="space-y-4 w-full">
              {data.socialLinks.map((link, index) => (
                <div key={index} className="p-4 w-full rounded-lg backdrop-blur-sm bg-white/80">
                  <div className="flex justify-between items-center mb-2">
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
            <div className="grid gap-6 mx-auto max-w-md">
              {data.bankAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="p-6 space-y-4 rounded-xl bg-white/50"
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
          <div className="px-4 py-8 text-center">
            <div 
              className="mb-4 text-lg leading-relaxed font-secondary"
              dangerouslySetInnerHTML={{ __html: data.message }}
            />
          </div>
        )}

        {/* Audio Player */}
        {data?.showMusicLibrary && data?.backgroundMusic && (
          <div className="fixed right-4 bottom-4 z-50">
            <audio
              controls
              autoPlay
              loop
              className="w-64 h-12 rounded-lg shadow-lg"
            >
              <source src={data.backgroundMusic} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Floating Navigation */}
      <FloatingNavigation 
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
    </div>
  );
};

export default JavaneseTemplate;
