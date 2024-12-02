import React, { useState } from 'react';
import DevicePreview from './DevicePreview';
import { Phone, Tablet, Monitor } from 'react-feather';

interface InvitationPreviewProps {
  children: React.ReactNode;
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ children }) => {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const devices = [
    { id: 'mobile', icon: Phone, label: 'Mobile' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'desktop', icon: Monitor, label: 'Desktop' }
  ] as const;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      {/* Device Selector */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {devices.map((device) => {
              const Icon = device.icon;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedDevice === device.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{device.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="w-full overflow-x-auto py-8">
        <div className={`
          transition-all duration-500 ease-in-out
          ${selectedDevice === 'mobile' ? 'max-w-[320px]' : ''}
          ${selectedDevice === 'tablet' ? 'max-w-[768px]' : ''}
          ${selectedDevice === 'desktop' ? 'max-w-[1280px]' : ''}
          mx-auto
        `}>
          <DevicePreview device={selectedDevice}>
            {children}
          </DevicePreview>
        </div>
      </div>
    </div>
  );
};

export default InvitationPreview;
