import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { favorites } from '../api/client';
import { Item } from '../types';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  favorites: Item[];
  loading: boolean;
  addFavorite: (itemId: string) => Promise<void>;
  removeFavorite: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavoriteIds(new Set());
      setFavoriteItems([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const items = await favorites.list(user.userId);
      const ids = new Set(items.map((item: Item) => item.itemId));
      setFavoriteIds(ids);
      setFavoriteItems(items);
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (itemId: string) => {
    if (!user) return;
    
    await favorites.add(user.userId, itemId);
    setFavoriteIds(prev => new Set([...prev, itemId]));
  };

  const removeFavorite = async (itemId: string) => {
    if (!user) return;
    
    await favorites.remove(user.userId, itemId);
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const isFavorite = (itemId: string) => favoriteIds.has(itemId);
  
  const toggleFavorite = async (itemId: string) => {
    if (isFavorite(itemId)) {
      await removeFavorite(itemId);
    } else {
      await addFavorite(itemId);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favoriteIds, 
      favorites: favoriteItems,
      loading, 
      addFavorite, 
      removeFavorite, 
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
