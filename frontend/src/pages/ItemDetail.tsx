import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { items as itemsApi } from '../lib/api/client';
import { Item } from '../lib/types';
import Button from '../components/ui/Button';
import { useFavorites } from '../lib/favorites/FavoritesContext';
import { useAuth } from '../lib/auth/AuthContext';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isOwner = user && item && item.sellerId === user.userId;

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

          {/* Buyer Actions */}
          {!isOwner && item.status === 'Available' && (
            <div className="mt-6">
              <Button className="w-full">Enter Lottery</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
