import React from 'react';

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
    <div 
      className="fixed inset-0 bg-gradient-to-b from-pink-100 to-white flex items-center justify-center"
      style={{ 
        backgroundImage: "url('/splash-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="relative z-10 text-center p-8 max-w-lg mx-auto">
        <h1 className="text-white font-serif mb-4">The Wedding Of</h1>
        
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-relaxed">
          {brideNames}
          <br />
          <span className="text-2xl">&</span>
          <br />
          {groomNames}
        </h2>

        {guestName && (
          <div className="mb-8 text-center">
            <p className="text-white text-lg mb-2">Kepada Yth:</p>
            <p className="text-2xl font-serif text-white">
              {decodeURIComponent(guestName)}
            </p>
          </div>
        )}
        
        <button
          onClick={onEnter}
          className="bg-white text-pink-500 px-8 py-3 rounded-full font-medium hover:bg-pink-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
