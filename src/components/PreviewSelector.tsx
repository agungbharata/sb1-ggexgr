import React from 'react';
import { Monitor, Smartphone, Tablet } from 'react-feather';

interface PreviewSelectorProps {
  selectedDevice: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

const PreviewSelector: React.FC<PreviewSelectorProps> = ({
  selectedDevice,
  onDeviceChange,
}) => {
  const devices = [
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' }
  ];

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
      {devices.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onDeviceChange(id)}
          className={`
            flex items-center px-4 py-2 rounded-full transition-all duration-200
            ${selectedDevice === id
              ? 'bg-[#D4B996] text-white shadow-md'
              : 'text-[#8B7355] hover:bg-[#F5E9E2] hover:text-[#D4B996]'
            }
          `}
        >
          <Icon className="w-5 h-5 mr-2" />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default PreviewSelector;
