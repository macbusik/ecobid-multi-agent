
import Button from '../ui/Button';
import { ItemStatus } from '../../lib/types';

interface LotteryButtonProps {
  status: ItemStatus;
  isEntered: boolean;
  isWinner: boolean;
  onEnter: () => void;
}

export default function LotteryButton({ status, isEntered, isWinner, onEnter }: LotteryButtonProps) {
  if (status !== 'Active') {
    return (
      <div className="text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
        Lottery Closed
      </div>
    );
  }

  if (isEntered) {
    return (
      <div className="text-center py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium">
        ✓ You're in the lottery
      </div>
    );
  }

  return (
    <Button onClick={onEnter} fullWidth>
      I'm Interested
    </Button>
  );
}
