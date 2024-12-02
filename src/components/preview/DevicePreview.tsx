import React from 'react';

interface DevicePreviewProps {
  children: React.ReactNode;
  device: 'mobile' | 'tablet' | 'desktop';
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children, device }) => {
  const deviceStyles = {
    mobile: {
      wrapper: "relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] shadow-xl border-[14px] border-black overflow-hidden",
      notch: "absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-3xl z-50",
      screen: "w-full h-full bg-white overflow-y-auto rounded-[2rem]",
      button: "absolute right-[-17px] top-[120px] w-3 h-16 bg-gray-800 rounded-r-lg"
    },
    tablet: {
      wrapper: "relative mx-auto w-[580px] h-[800px] bg-black rounded-[3rem] shadow-xl border-[14px] border-black overflow-hidden",
      notch: "absolute top-0 left-1/2 -translate-x-1/2 w-[15%] h-3 bg-black rounded-b-3xl z-50",
      screen: "w-full h-full bg-white overflow-y-auto rounded-[2rem]",
      button: "absolute right-[-17px] top-[200px] w-3 h-20 bg-gray-800 rounded-r-lg"
    },
    desktop: {
      wrapper: "relative mx-auto w-[1024px] h-[640px] bg-black rounded-2xl shadow-xl border-[14px] border-black overflow-hidden",
      notch: "",
      screen: "w-full h-full bg-white overflow-y-auto rounded-lg",
      button: ""
    }
  };

  return (
    <div className={deviceStyles[device].wrapper}>
      {deviceStyles[device].notch && (
        <div className={deviceStyles[device].notch} />
      )}
      {deviceStyles[device].button && (
        <div className={deviceStyles[device].button} />
      )}
      <div className={deviceStyles[device].screen}>
        {children}
      </div>
    </div>
  );
};

export default DevicePreview;
