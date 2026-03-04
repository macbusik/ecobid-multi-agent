import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import type { Item } from '../../lib/types';

export function WinnerBanner() {
  const [wonItems] = useState<Item[]>([]); // Empty for now - backend not implemented
  const { user } = useAuth();

  // Skip loading - backend endpoint not implemented yet
  if (!user || wonItems.length === 0) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">
            🎉 You won {wonItems.length} {wonItems.length === 1 ? 'item' : 'items'}!
          </h3>
          <div className="mt-2 text-sm text-green-700">
            {wonItems.map((item) => (
              <Link
                key={item.itemId}
                to={`/items/${item.itemId}`}
                className="block hover:underline mb-1"
              >
                • {item.title} - Confirm pickup within 24 hours
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
