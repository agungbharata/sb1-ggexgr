import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  weddingDate: string;
  weddingTime: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate, weddingTime }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const [hours, minutes] = weddingTime.split(':');
      const weddingDateTime = new Date(weddingDate);
      weddingDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const difference = weddingDateTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate, weddingTime]);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-[#D4B996] to-[#DABDAD]/20 rounded-lg shadow-lg backdrop-blur-sm">
      <span className="text-3xl md:text-4xl font-bold text-[#D4B996]">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-sm md:text-base text-gray-600 mt-1 font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full p-6 rounded-xl bg-white/80 shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-serif text-center mb-6 text-[#D4B996]">
        Counting Down to Our Special Day
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
