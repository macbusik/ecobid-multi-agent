import { useState } from 'react';
import { useToast } from '../../lib/toast/ToastContext';
import { apiClient } from '../../lib/api/client';

interface LotteryButtonProps {
  itemId: string;
  status: string;
  lotteryEndTime: string;
  isUserInLottery: boolean;
  onEnterSuccess?: () => void;
}

export function LotteryButton({
  itemId,
  status,
  lotteryEndTime,
  isUserInLottery,
  onEnterSuccess,
}: LotteryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasEntered, setHasEntered] = useState(isUserInLottery);
  const { showToast } = useToast();

  const handleEnterLottery = async () => {
    setIsLoading(true);
    try {
      await apiClient.enterLottery(itemId);
      
      setHasEntered(true);
      const hoursLeft = Math.floor((new Date(lotteryEndTime).getTime() - Date.now()) / (1000 * 60 * 60));
      showToast(`You're in the lottery! Winner announced in ${hoursLeft > 0 ? hoursLeft + ' hours' : 'soon'}`, 'success');
      onEnterSuccess?.();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to enter lottery', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show "Lottery Closed" if lottery ended
  if (status !== 'Available' || new Date(lotteryEndTime) < new Date()) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
        Lottery Closed
      </div>
    );
  }

  // Show "You're in lottery" if already entered
  if (hasEntered) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
      >
        <span>You're in lottery</span>
        <span className="text-lg">✓</span>
      </button>
    );
  }

  // Show "Enter Lottery" button
  return (
    <button
      onClick={handleEnterLottery}
      disabled={isLoading}
      className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Entering...</span>
        </span>
      ) : (
        'Enter Lottery'
      )}
    </button>
  );
}

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  try {
    const { fetchAuthSession } = await import('aws-amplify/auth');
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch {
    return null;
  }
}
