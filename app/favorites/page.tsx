'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ItemCard from '@/components/item/ItemCard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useFavorites } from '@/lib/favorites/FavoritesContext';
import { items as itemsApi } from '@/lib/api/client';
import { Item } from '@/lib/types';

export default function FavoritesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const { favoriteIds } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const loadFavorites = async () => {
      if (!user?.userId || favoriteIds.size === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const itemPromises = Array.from(favoriteIds).map(id => itemsApi.getById(id));
        const loadedItems = await Promise.all(itemPromises);
        setItems(loadedItems.filter(Boolean));
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, isLoading, router, favoriteIds]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Favorites
        </h1>
        <p className="text-gray-600">
          Items you've saved for later
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">
            Start browsing items and save your favorites for easy access later
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}