import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { items as itemsApi } from '../lib/api/client';
import { Item } from '../lib/types';
import Button from '../components/ui/Button';
import { useFavorites } from '../lib/favorites/FavoritesContext';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

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
              className="text-2xl"
            >
              {isFavorite(item.itemId) ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {item.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {item.city}
            </span>
          </div>
          <div className="mt-6">
            <Button className="w-full">Enter Lottery</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
