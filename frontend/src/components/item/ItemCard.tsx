import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../lib/types';
import { useAuth } from '../../lib/auth/AuthContext';
import { useToast } from '../../lib/toast/ToastContext';
import { useFavorites } from '../../lib/favorites/FavoritesContext';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        isFavorite(item.itemId) ? 'Removed from favorites' : 'Added to favorites',
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
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            aria-label={isFavorite(item.itemId) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-2xl">
              {isFavorite(item.itemId) ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {item.category}
            </span>
            <span className="text-sm text-gray-500">{item.city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
