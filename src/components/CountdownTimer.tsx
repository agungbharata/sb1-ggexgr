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

  return (
    <div className="w-full">
      <h3 className="text-center text-lg font-medium text-gray-900 mb-4">Counting down to the big day</h3>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <div className="flex flex-col items-center p-2 md:p-4 bg-pink-50 rounded-lg">
          <span className="text-2xl md:text-4xl font-bold text-pink-600">{timeLeft.days}</span>
          <span className="text-sm md:text-base text-gray-600">Days</span>
        </div>
        <div className="flex flex-col items-center p-2 md:p-4 bg-pink-50 rounded-lg">
          <span className="text-2xl md:text-4xl font-bold text-pink-600">{timeLeft.hours}</span>
          <span className="text-sm md:text-base text-gray-600">Hours</span>
        </div>
        <div className="flex flex-col items-center p-2 md:p-4 bg-pink-50 rounded-lg">
          <span className="text-2xl md:text-4xl font-bold text-pink-600">{timeLeft.minutes}</span>
          <span className="text-sm md:text-base text-gray-600">Minutes</span>
        </div>
        <div className="flex flex-col items-center p-2 md:p-4 bg-pink-50 rounded-lg">
          <span className="text-2xl md:text-4xl font-bold text-pink-600">{timeLeft.seconds}</span>
          <span className="text-sm md:text-base text-gray-600">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
