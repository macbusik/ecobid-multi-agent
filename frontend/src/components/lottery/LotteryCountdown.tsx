import { useState, useEffect } from 'react';

interface LotteryCountdownProps {
  endTime: string;
  compact?: boolean;
}

export function LotteryCountdown({ endTime, compact = false }: LotteryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [colorClass, setColorClass] = useState('text-gray-600');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Closed');
        setColorClass('text-gray-600');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format as HH:MM:SS
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      const formatted = `${hh}:${mm}:${ss}`;

      // Set color based on time remaining
      if (diff < 5 * 60 * 1000) {
        setColorClass('text-red-600'); // <5 minutes
      } else if (diff < 30 * 60 * 1000) {
        setColorClass('text-yellow-600'); // <30 minutes
      } else {
        setColorClass('text-gray-600');
      }

      if (compact) {
        setTimeLeft(formatted);
      } else {
        setTimeLeft(`Closes in: ${formatted}`);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, compact]);

  if (!timeLeft) return null;

  const fontSize = compact ? 'text-sm' : 'text-base';

  return (
    <span className={`${colorClass} ${fontSize} font-medium font-mono`}>
      {timeLeft}
    </span>
  );
}
