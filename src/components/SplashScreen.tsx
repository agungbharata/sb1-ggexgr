import React from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  brideNames: string;
  groomNames: string;
  guestName?: string;
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  brideNames,
  groomNames,
  guestName,
  onEnter
}) => {
  return (
    <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center min-h-screen">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/splash-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Top Border */}
        <div className="mb-8 animate-slideIn">
          <img src="/ornaments/border-top.svg" alt="" className="w-full h-auto mx-auto" />
        </div>

        {/* Wedding Title */}
        <h1 className="text-2xl md:text-3xl text-white font-serif mb-4 animate-fadeIn animate-delay-200">
          The Wedding Of
        </h1>

        {/* Couple Names */}
        <div className="space-y-6 mb-12">
          <h2 className="text-4xl md:text-6xl font-serif text-white animate-fadeIn animate-delay-300">
            {brideNames}
          </h2>
          <div className="flex items-center justify-center gap-4 animate-scaleIn animate-delay-400">
            <div className="w-20 h-px bg-white/50" />
            <Heart className="w-8 h-8 text-pink-300 animate-pulse" />
            <div className="w-20 h-px bg-white/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white animate-fadeIn animate-delay-300">
            {groomNames}
          </h2>
        </div>

        {/* Guest Section */}
        {guestName && (
          <div className="mb-12 animate-fadeIn animate-delay-400">
            <p className="text-white text-lg mb-2 font-serif">Dear,</p>
            <p className="text-2xl md:text-3xl font-serif text-white">
              {decodeURIComponent(guestName)}
            </p>
            <p className="text-white/80 mt-2 italic">You are invited to our wedding celebration</p>
          </div>
        )}

        {/* Open Invitation Button */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition duration-300 ease-out border-2 border-pink-500/50 animate-scaleIn animate-delay-500"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Open Invitation</span>
        </button>

        {/* Bottom Border */}
        <div className="mt-12 animate-slideIn animate-delay-200">
          <img src="/ornaments/border-bottom.svg" alt="" className="w-full h-auto mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
