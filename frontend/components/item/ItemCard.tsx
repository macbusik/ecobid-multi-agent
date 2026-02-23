'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Item } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { favorites } from '@/lib/api/client';

interface ItemCardProps {
  item: Item;
  isFavorited?: boolean;
}

export default function ItemCard({ item, isFavorited = false }: ItemCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  const timeLeft = new Date(item.lotteryCloseTime).getTime() - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    const originalState = favorited;
    setFavorited(!favorited);

    try {
      if (favorited) {
        await favorites.remove(user.userId, item.itemId);
      } else {
        await favorites.add(user.userId, item.itemId);
      }
    } catch (error) {
      setFavorited(originalState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/items/${item.itemId}`} aria-label={`View details for ${item.title}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={item.photoUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {item.category}
          </div>
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            className="absolute top-2 left-2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
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
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{item.city}</span>
          </div>
          
          {item.status === 'Active' && (
            <div className="flex items-center text-sm">
              <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{hoursLeft}h {minutesLeft}m left</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{(item as any).sellerName || 'Unknown'}</span>
            <span className="ml-2">⭐ {(item as any).sellerReputation || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
