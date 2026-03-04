import { useState, useEffect } from 'react';

interface LotteryCountdownProps {
  endTime: string;
  compact?: boolean;
}

export function LotteryCountdown({ endTime, compact = false }: LotteryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Closed');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Mark as urgent if less than 1 hour left
      setIsUrgent(hours < 1);

      if (compact) {
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        if (hours > 0) {
          setTimeLeft(`Lottery closes in ${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`Lottery closes in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every minute
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [endTime, compact]);

  if (!timeLeft) return null;

  const textColor = isUrgent ? 'text-red-600' : 'text-gray-600';
  const fontSize = compact ? 'text-sm' : 'text-base';

  return (
    <span className={`${textColor} ${fontSize} font-medium`}>
      {timeLeft}
    </span>
  );
}
