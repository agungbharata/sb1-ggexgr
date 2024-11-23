import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface SplashScreenProps {
  brideNames: string;
  groomNames: string;
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ brideNames, groomNames, onEnter }) => {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || '';
  const decodedGuestName = decodeURIComponent(guestName).replace(/\+/g, ' ');

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4 z-50">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        {/* Wedding Text */}
        <div className="space-y-2">
          <h2 className="text-xl text-gray-600 font-light">The Wedding Of</h2>
          <h1 className="text-3xl md:text-4xl font-serif text-pink-600">{brideNames}</h1>
          <h1 className="text-3xl md:text-4xl font-serif text-pink-600">&</h1>
          <h1 className="text-3xl md:text-4xl font-serif text-pink-600">{groomNames}</h1>
        </div>

        {/* Invitation Text */}
        <div className="space-y-2">
          <p className="text-gray-600">Kepada Yth:</p>
          <p className="text-xl md:text-2xl font-medium text-gray-800">
            Bpk/Ibu/Saudara/i
          </p>
          <p className="text-2xl md:text-3xl font-serif text-pink-600">
            {decodedGuestName}
          </p>
        </div>

        {/* Open Invitation Button */}
        <div className="pt-8">
          <button
            onClick={onEnter}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full 
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200
                     flex items-center justify-center space-x-2"
          >
            <span>Buka Undangan</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
