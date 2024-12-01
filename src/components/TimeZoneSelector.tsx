import React from 'react';
import { TimeZone } from '../types/invitation';

interface TimeZoneSelectorProps {
  value: TimeZone;
  onChange: (timezone: TimeZone) => void;
  className?: string;
}

const timeZones: { value: TimeZone; label: string; offset: number }[] = [
  { value: 'WIB', label: 'WIB (Jakarta, Surabaya)', offset: 7 },
  { value: 'WITA', label: 'WITA (Bali, Makassar)', offset: 8 },
  { value: 'WIT', label: 'WIT (Jayapura, Ambon)', offset: 9 },
];

export const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Zona Waktu</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeZone)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      >
        {timeZones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const getTimeWithZone = (time: string, timezone: TimeZone = 'WIB'): string => {
  if (!time) return '';
  return `${time} ${timezone}`;
};

export default TimeZoneSelector;
