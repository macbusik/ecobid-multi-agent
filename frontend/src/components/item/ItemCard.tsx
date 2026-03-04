import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../lib/types';
import { useAuth } from '../../lib/auth/AuthContext';
import { useToast } from '../../lib/toast/ToastContext';
import { useFavorites } from '../../lib/favorites/FavoritesContext';
import { useLottery } from '../../lib/lottery/LotteryContext';
import { LotteryCountdown } from '../lottery/LotteryCountdown';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInLottery } = useLottery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const favorited = isFavorite(item.itemId);
  const entered = isInLottery(item.itemId);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      await toggleFavorite(item.itemId);
      showToast(
        favorited ? 'Removed from favorites' : 'Added to favorites',
        'success'
      );
    } catch (error: any) {
      showToast(`Failed: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/items/${item.itemId}`} aria-label={`View details for ${item.title}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <img
            src={item.photoUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {entered && item.status === 'Available' && (
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span>✓</span>
                <span>Entered</span>
              </div>
            )}
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {item.category}
            </div>
            {item.status !== 'Available' && (
              <div className={`text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                item.status === 'Reserved' ? 'bg-orange-500' :
                item.status === 'Lottery_Closed' ? 'bg-yellow-500' :
                item.status === 'Pickup_Confirmed' ? 'bg-blue-500' :
                item.status === 'Picked_Up' ? 'bg-gray-500' :
                'bg-gray-500'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>
                  {item.status === 'Reserved' ? 'Reserved' :
                   item.status === 'Lottery_Closed' ? 'Closed' :
                   item.status === 'Pickup_Confirmed' ? 'Confirmed' :
                   item.status === 'Picked_Up' ? 'Completed' :
                   item.status}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            className="absolute top-2 left-2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {loading ? (
              <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg
                className={`w-6 h-6 ${favorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">📍 {item.city}</span>
            {item.status === 'Available' && item.lotteryEndTime && (
              <LotteryCountdown endTime={item.lotteryEndTime} compact />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
