import { useState } from 'react';
import { useToast } from '../../lib/toast/ToastContext';
import { apiClient } from '../../lib/api/client';

interface ReservationCardProps {
  itemId: string;
  reservationExpiry: string;
  onConfirmSuccess?: () => void;
}

export function ReservationCard({ itemId, reservationExpiry, onConfirmSuccess }: ReservationCardProps) {
  const [confirming, setConfirming] = useState(false);
  const { showToast } = useToast();

  const timeLeft = new Date(reservationExpiry).getTime() - Date.now();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await apiClient.confirmPickup(itemId);
      showToast('Pickup confirmed! Contact the seller to arrange details.', 'success');
      onConfirmSuccess?.();
    } catch (error) {
      showToast('Failed to confirm pickup. Please try again.', 'error');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            You won this item!
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Confirm pickup within {hoursLeft}h {minutesLeft}m or the item will be re-listed.
          </p>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="mt-3 w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {confirming ? 'Confirming...' : 'Confirm Pickup'}
          </button>
        </div>
      </div>
    </div>
  );
}
