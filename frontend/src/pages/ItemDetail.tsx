import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { items as itemsApi, apiClient } from '../lib/api/client';
import { Item } from '../lib/types';
import Button from '../components/ui/Button';
import { useFavorites } from '../lib/favorites/FavoritesContext';
import { useLottery } from '../lib/lottery/LotteryContext';
import { useAuth } from '../lib/auth/AuthContext';
import { useToast } from '../lib/toast/ToastContext';
import { LotteryButton } from '../components/lottery/LotteryButton';
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
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeleting(true);
    try {
      await itemsApi.delete(id!);
      navigate('/profile');
    } catch (error: any) {
      alert(error.message || 'Failed to delete item');
      setDeleting(false);
    }
  };

  const handleMarkPickedUp = async () => {
    if (!confirm('Confirm that the item has been picked up?')) return;
    
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
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
            <h1 className="text-3xl font-bold">{item.title}</h1>
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
                onClick={handleDelete}
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
                onClick={handleMarkPickedUp}
                disabled={markingPickedUp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {markingPickedUp ? 'Marking...' : 'Mark as Picked Up'}
              </Button>
            </div>
          )}

          {/* Winner Reservation Card */}
          {isWinner && isReserved && item.reservationExpiry && (
            <ReservationCard
              itemId={item.itemId}
              reservationExpiry={item.reservationExpiry}
              onConfirmSuccess={async () => {
                const data = await itemsApi.getById(id!);
                setItem(data);
              }}
            />
          )}

          {/* Buyer Actions */}
          {!isOwner && item.status === 'Available' && (
            <div className="mt-6 space-y-3">
              <LotteryCountdown endTime={item.lotteryEndTime} />
              <LotteryButton
                itemId={item.itemId}
                status={item.status}
                lotteryEndTime={item.lotteryEndTime}
                isUserInLottery={isInLottery(item.itemId)}
                onEnterSuccess={loadLotteryEntries}
              />
            </div>
          )}

          {/* Owner Message */}
          {isOwner && item.status === 'Available' && (
            <div className="mt-6 space-y-3">
              <LotteryCountdown endTime={item.lotteryEndTime} />
              <div className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                You can't enter your own lottery
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
