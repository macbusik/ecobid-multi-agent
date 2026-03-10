import { useAuth } from '../lib/auth/AuthContext';
import Button from '../components/ui/Button';
import { items } from '../lib/api/client';
import { useLottery } from '../lib/lottery/LotteryContext';
import { Item } from '../lib/types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LotteryCountdown } from '../components/lottery/LotteryCountdown';
import { LotteryStatus } from '../components/lottery/LotteryStatus';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { lotteryEntries } = useLottery();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [lotteryItems, setLotteryItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMyItems();
      loadLotteryItems();
    }
  }, [user, lotteryEntries]);

  const loadMyItems = async () => {
    try {
      const response = await items.list({ limit: 50 });
      // Filter items by current user
      const userItems = response.items.filter(item => item.sellerId === user?.userId);
      setMyItems(userItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLotteryItems = async () => {
    try {
      const response = await items.list({ limit: 50 });
      // Filter items user entered lottery for
      const enteredItems = response.items.filter(item => lotteryEntries.has(item.itemId));
      setLotteryItems(enteredItems);
    } catch (error) {
      console.error('Failed to load lottery items:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeleting(itemId);
    try {
      await items.delete(itemId);
      setMyItems(prev => prev.filter(item => item.itemId !== itemId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete item');
    } finally {
      setDeleting(null);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Please login</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 mb-8">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">User ID</label>
          <p className="text-lg font-mono text-sm">{user.userId}</p>
        </div>
        <div className="pt-4">
          <Button onClick={signOut} className="w-full">
            Sign Out
          </Button>
        </div>
      </div>

      {/* My Lottery Entries */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">My Lottery Entries</h2>
        
        {lotteryItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎲</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No lottery entries yet</h3>
            <p className="text-gray-600 mb-6">Browse items and join a lottery!</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Browse Items
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {lotteryItems.map(item => (
              <Link key={item.itemId} to={`/items/${item.itemId}`}>
                <div className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  item.status === 'Reserved' && item.winnerId === user?.userId ? 'bg-green-50 border-green-200' : ''
                }`}>
                  <img 
                    src={item.photoUrl} 
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.category} • {item.city}</p>
                    {item.status === 'Available' && item.lotteryEndTime && (
                      <div className="mt-1">
                        <LotteryCountdown endTime={item.lotteryEndTime} compact />
                      </div>
                    )}
                    {(item.status === 'Reserved' || item.status === 'Lottery_Closed') && user && (
                      <div className="mt-1">
                        <LotteryStatus item={item} userId={user.userId} compact />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Available' ? 'bg-green-100 text-green-800' :
                      item.status === 'Lottery_Closed' ? 'bg-orange-100 text-orange-800' :
                      item.status === 'Reserved' && item.winnerId === user?.userId ? 'bg-green-100 text-green-800' :
                      item.status === 'Reserved' && item.queueUsers?.some(q => q.userId === user?.userId) ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'Reserved' ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'Available' ? 'Active' :
                       item.status === 'Lottery_Closed' ? 'Closed' :
                       item.status === 'Reserved' && item.winnerId === user?.userId ? 'Won' :
                       item.status === 'Reserved' && item.queueUsers?.some(q => q.userId === user?.userId) ? 'Queue' :
                       item.status === 'Reserved' ? 'Lost' :
                       item.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">My Items</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : myItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items listed yet</h3>
            <p className="text-gray-600 mb-6">Tap 'New Item' to get started!</p>
            <Link to="/items/new">
              <Button>Create Your First Item</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myItems.map(item => (
              <div key={item.itemId} className="flex items-center gap-4 p-4 border rounded-lg">
                <img 
                  src={item.photoUrl} 
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category} • {item.city}</p>
                  <p className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      item.status === 'Available' ? 'bg-green-100 text-green-800' :
                      item.status === 'Lottery_Closed' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'Reserved' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/items/${item.itemId}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                  {item.status === 'Available' && (
                    <>
                      <Link to={`/items/${item.itemId}/edit`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleDelete(item.itemId)}
                        disabled={deleting === item.itemId}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {deleting === item.itemId ? 'Deleting...' : 'Delete'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
