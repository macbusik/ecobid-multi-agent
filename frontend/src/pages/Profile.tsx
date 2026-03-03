import { useAuth } from '../lib/auth/AuthContext';
import Button from '../components/ui/Button';
import { items } from '../lib/api/client';
import { Item } from '../lib/types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMyItems();
    }
  }, [user]);

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

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">My Items</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : myItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
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
                      item.status === 'Active' ? 'bg-green-100 text-green-800' :
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
                  {item.status === 'Active' && (
                    <Button 
                      variant="secondary" 
                      onClick={() => handleDelete(item.itemId)}
                      disabled={deleting === item.itemId}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {deleting === item.itemId ? 'Deleting...' : 'Delete'}
                    </Button>
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
