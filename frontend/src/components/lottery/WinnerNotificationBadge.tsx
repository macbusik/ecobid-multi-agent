import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { apiClient } from '../../lib/api/client';
import { Item } from '../../lib/types';

export function WinnerNotificationBadge() {
  const { user } = useAuth();
  const [wonItems, setWonItems] = useState<Item[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadWonItems = async () => {
      try {
        const items = await (apiClient as any).getWonItems();
        // Only show items that are Reserved (not yet confirmed)
        const pending = items.filter((item: Item) => item.status === 'Reserved');
        setWonItems(pending);
      } catch (error) {
        console.error('Failed to load won items:', error);
      }
    };

    loadWonItems();
    const interval = setInterval(loadWonItems, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  if (!user || wonItems.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
        aria-label={`${wonItems.length} won items`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {wonItems.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {wonItems.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">🎉 You Won!</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {wonItems.map(item => (
                <Link
                  key={item.itemId}
                  to={`/items/${item.itemId}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <img src={item.photoUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-sm text-green-600">Confirm pickup</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
