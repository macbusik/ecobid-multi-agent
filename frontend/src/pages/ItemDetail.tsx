import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { items as itemsApi, apiClient } from '../lib/api/client';
import { Item } from '../lib/types';
import Button from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useFavorites } from '../lib/favorites/FavoritesContext';
import { useLottery } from '../lib/lottery/LotteryContext';
import { useAuth } from '../lib/auth/AuthContext';
import { useToast } from '../lib/toast/ToastContext';
import { LotteryButton } from '../components/lottery/LotteryButton';
import { LotteryStatus } from '../components/lottery/LotteryStatus';
import { LotteryCountdown } from '../components/lottery/LotteryCountdown';
import { ReservationCard } from '../components/lottery/ReservationCard';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInLottery, loadLotteryEntries } = useLottery();
  const { showToast } = useToast();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [markingPickedUp, setMarkingPickedUp] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPickupDialog, setShowPickupDialog] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isOwner = user && item && item.sellerId === user.userId;
  const isWinner = user && item && item.winnerId === user.userId;
  const isReserved = item?.status === 'Reserved';

  useEffect(() => {
    const loadItem = async () => {
      if (!id) return;
      try {
        const data = await itemsApi.getById(id);
        setItem(data);
      } catch (err) {
        console.error('Error loading item:', err);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await itemsApi.delete(id!);
      navigate('/profile');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
      setDeleting(false);
    }
    setShowDeleteDialog(false);
  };

  const handleMarkPickedUp = async () => {
    setMarkingPickedUp(true);
    try {
      await apiClient.markPickedUp(id!);
      showToast('Item marked as picked up!', 'success');
      const data = await itemsApi.getById(id!);
      setItem(data);
    } catch (error) {
      showToast('Failed to mark as picked up', 'error');
    } finally {
      setMarkingPickedUp(false);
    }
    setShowPickupDialog(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full h-96 bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="flex gap-4 mt-6">
              <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return <div className="flex justify-center items-center min-h-screen">Item not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img src={item.photoUrl} alt={item.title} className="w-full h-96 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{item.title}</h1>
              {item.status !== 'Available' && (
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Reserved' ? 'bg-orange-100 text-orange-800' :
                    item.status === 'Lottery_Closed' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'Pickup_Confirmed' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'Picked_Up' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'Reserved' ? 'bg-orange-500' :
                      item.status === 'Lottery_Closed' ? 'bg-yellow-500' :
                      item.status === 'Pickup_Confirmed' ? 'bg-blue-500' :
                      item.status === 'Picked_Up' ? 'bg-gray-500' :
                      'bg-gray-500'
                    }`}></span>
                    {item.status === 'Reserved' ? 'Reserved' :
                     item.status === 'Lottery_Closed' ? 'Selecting Winner...' :
                     item.status === 'Pickup_Confirmed' ? 'Pickup Confirmed' :
                     item.status === 'Picked_Up' ? 'Completed' :
                     item.status}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => toggleFavorite(item.itemId)}
              className="text-2xl hover:scale-110 transition-transform"
              aria-label={isFavorite(item.itemId) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(item.itemId) ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {item.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {item.city}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              item.status === 'Available' ? 'bg-green-100 text-green-800' :
              item.status === 'Lottery_Closed' ? 'bg-yellow-100 text-yellow-800' :
              item.status === 'Reserved' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
          </div>

          {/* Owner Actions */}
          {isOwner && item.status === 'Available' && (
            <div className="flex gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <Link to={`/items/${item.itemId}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Edit Item
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleting}
                className="flex-1 text-red-600 hover:bg-red-50"
              >
                {deleting ? 'Deleting...' : 'Delete Item'}
              </Button>
            </div>
          )}

          {/* Seller Actions - Mark Picked Up */}
          {isOwner && isReserved && (
            <div className="mb-6">
              <Button
                onClick={() => setShowPickupDialog(true)}
                disabled={markingPickedUp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {markingPickedUp ? 'Marking...' : 'Mark as Picked Up'}
              </Button>
            </div>
          )}

          {/* Winner Reservation Card */}
          {isWinner && isReserved && item.reservationExpiry && (
            <ErrorBoundary fallback={<div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">Unable to load reservation info. Please refresh.</div>}>
              <ReservationCard
                itemId={item.itemId}
                reservationExpiry={item.reservationExpiry}
                onConfirmSuccess={async () => {
                  const data = await itemsApi.getById(id!);
                  setItem(data);
                }}
              />
            </ErrorBoundary>
          )}

          {/* Buyer Actions */}
          {!isOwner && item.status === 'Available' && (
            <ErrorBoundary fallback={<div className="mt-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">Unable to load lottery info. Please refresh.</div>}>
              <div className="mt-6 space-y-3">
                <LotteryCountdown endTime={item.lotteryEndTime} />
                <LotteryButton
                  itemId={item.itemId}
                  status={item.status}
                  lotteryEndTime={item.lotteryEndTime}
                  isUserInLottery={isInLottery(item.itemId)}
                  onEnterSuccess={loadLotteryEntries}
                  onLeaveSuccess={loadLotteryEntries}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* Lottery Result Status */}
          {!isOwner && (item.status === 'Reserved' || item.status === 'Lottery_Closed') && user && (
            <div className="mt-6">
              <LotteryStatus item={item} userId={user.userId} />
            </div>
          )}

          {/* Owner Message */}
          {isOwner && item.status === 'Available' && (
            <ErrorBoundary>
              <div className="mt-6 space-y-3">
                <LotteryCountdown endTime={item.lotteryEndTime} />
                <div className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  You can't enter your own lottery
                </div>
              </div>
            </ErrorBoundary>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <ConfirmDialog
        isOpen={showPickupDialog}
        title="Mark as Picked Up"
        message="Confirm that the item has been picked up?"
        confirmText="Confirm"
        cancelText="Cancel"
        variant="success"
        onConfirm={handleMarkPickedUp}
        onCancel={() => setShowPickupDialog(false)}
      />
    </div>
  );
}
