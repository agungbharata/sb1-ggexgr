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
        className="block w-full px-4 py-2.5 text-base rounded-md border-gray-300 bg-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
      >
        {timeZones.map((tz) => (
          <option key={tz.value} value={tz.value} className="py-2">
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const getTimeWithZone = (time: string, timezone: TimeZone = 'WIB'): string => {
  if (!time) return '';
  const tz = timeZones.find(t => t.value === timezone);
  if (!tz) return `${time} ${timezone}`; // fallback to provided timezone
  return `${time} ${tz.value}`;
};

export default TimeZoneSelector;
