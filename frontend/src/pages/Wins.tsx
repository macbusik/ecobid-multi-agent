import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { items } from '../lib/api/client';
import { Item } from '../lib/types';
import { LotteryCountdown } from '../components/lottery/LotteryCountdown';

export default function Wins() {
  const { user } = useAuth();
  const [wonItems, setWonItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWonItems = async () => {
      if (!user) return;
      try {
        const wonItemsList = await (items as any).getWonItems();
        setWonItems(wonItemsList);
      } catch (error) {
        console.error('Failed to load won items:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWonItems();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const pending = wonItems.filter(item => item.status === 'Reserved');
  const confirmed = wonItems.filter(item => item.status === 'Pickup_Confirmed');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🎉 My Wins</h1>

      {wonItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No wins yet</h2>
          <p className="text-gray-600 mb-6">Keep entering lotteries!</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-orange-600">⏰ Pending Confirmation</h2>
              <div className="space-y-4">
                {pending.map(item => (
                  <Link
                    key={item.itemId}
                    to={`/items/${item.itemId}`}
                    className="block bg-white rounded-lg shadow-sm border border-orange-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.photoUrl} alt={item.title} className="w-24 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.category} • {item.city}</p>
                        {item.reservationExpiry && (
                          <div className="mt-2">
                            <span className="text-sm text-red-600 font-medium">
                              Expires in: <LotteryCountdown endTime={item.reservationExpiry} compact />
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium">
                          Confirm Pickup →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {confirmed.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-600">✅ Confirmed</h2>
              <div className="space-y-4">
                {confirmed.map(item => (
                  <Link
                    key={item.itemId}
                    to={`/items/${item.itemId}`}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.photoUrl} alt={item.title} className="w-24 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.category} • {item.city}</p>
                        <p className="text-sm text-blue-600 mt-1">Pickup confirmed</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
