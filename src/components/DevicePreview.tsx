import React from 'react';

interface DevicePreviewProps {
  children: React.ReactNode;
  device: 'mobile' | 'tablet' | 'desktop';
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children, device }) => {
  const deviceStyles = {
    mobile: {
      frame: 'w-[375px] h-[812px]',
      scale: 'scale-[0.7] lg:scale-[0.8]',
      wrapper: 'rounded-[60px]',
      notch: 'w-[150px] h-[30px]'
    },
    tablet: {
      frame: 'w-[768px] h-[1024px]',
      scale: 'scale-[0.65] lg:scale-[0.75]',
      wrapper: 'rounded-[40px]',
      notch: 'w-[20px] h-[3px]'
    },
    desktop: {
      frame: 'w-[1200px] h-[750px]',
      scale: 'scale-[0.65] lg:scale-[0.75]',
      wrapper: 'rounded-[20px]',
      notch: 'hidden'
    }
  };

  const style = deviceStyles[device];

  return (
    <div className={`origin-top ${style.scale}`}>
      <div 
        className={`
          ${style.frame} 
          ${style.wrapper}
          bg-gray-800 
          p-3
          shadow-[0_0_0_2px_rgba(255,255,255,0.1)]
          mx-auto
          relative
        `}
      >
        {/* Notch for mobile */}
        {device === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className={`
              ${style.notch}
              bg-black 
              rounded-b-3xl
              flex items-center justify-center
              overflow-hidden
            `}>
              <div className="w-16 h-4 bg-black rounded-lg absolute top-0" />
            </div>
          </div>
        )}

        {/* Device Screen */}
        <div className={`
          w-full 
          h-full 
          ${style.wrapper} 
          bg-white 
          overflow-hidden
          relative
        `}>
          {children}
        </div>

        {/* Home Indicator */}
        {device === 'mobile' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default DevicePreview;
