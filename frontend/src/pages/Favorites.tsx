import { useFavorites } from '../lib/favorites/FavoritesContext';
import ItemCard from '../components/item/ItemCard';

export default function Favorites() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorites yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
