import { Item } from '../../lib/types';

interface LotteryStatusProps {
  item: Item;
  userId: string;
  compact?: boolean;
}

type StatusType = 'won' | 'queue' | 'not_selected' | 'active' | 'not_entered';

interface QueueStatus {
  type: 'queue';
  position: number;
}

function getLotteryStatus(item: Item, userId: string): StatusType | QueueStatus {
  // Lottery still active
  if (item.status === 'Available') {
    return 'active';
  }
  
  // Check if user won
  if (item.winnerId === userId) {
    return 'won';
  }
  
  // Check if user is in queue
  const queuePosition = item.queueUsers?.find(q => q.userId === userId)?.position;
  if (queuePosition) {
    return { type: 'queue', position: queuePosition };
  }
  
  // Check if user entered lottery
  const lotteryEntries = localStorage.getItem('ecobid_lottery_entries');
  const entries = lotteryEntries ? JSON.parse(lotteryEntries) : [];
  if (entries.includes(item.itemId)) {
    return 'not_selected';
  }
  
  return 'not_entered';
}

export function LotteryStatus({ item, userId, compact = false }: LotteryStatusProps) {
  const status = getLotteryStatus(item, userId);
  
  // Don't show anything if lottery is active or user didn't enter
  if (status === 'active' || status === 'not_entered') {
    return null;
  }
  
  // Won status
  if (status === 'won') {
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
          <span>🎉</span>
          <span>You won! Confirm pickup</span>
        </div>
      );
    }
    
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎉</span>
          <h3 className="font-bold text-green-900">You Won!</h3>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Confirm pickup within 24 hours or item goes to next in queue
        </p>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium">
          Confirm Pickup
        </button>
      </div>
    );
  }
  
  // Queue status
  if (typeof status === 'object' && status.type === 'queue') {
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-yellow-600 font-medium text-sm">
          <span>⏳</span>
          <span>In queue (Position #{status.position})</span>
        </div>
      );
    }
    
    return (
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⏳</span>
          <h3 className="font-bold text-yellow-900">You're in Queue</h3>
        </div>
        <p className="text-sm text-yellow-700">
          Position #{status.position} • You'll be notified if winner doesn't confirm
        </p>
      </div>
    );
  }
  
  // Not selected status
  if (status === 'not_selected') {
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>❌</span>
          <span>Not selected</span>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">❌</span>
          <h3 className="font-bold text-gray-900">Not Selected This Time</h3>
        </div>
        <p className="text-sm text-gray-600">
          Keep trying! More items are added daily
        </p>
      </div>
    );
  }
  
  return null;
}
