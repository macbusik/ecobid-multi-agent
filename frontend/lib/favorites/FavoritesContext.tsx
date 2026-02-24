'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { favorites } from '@/lib/api/client';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  isLoading: boolean;
  addFavorite: (itemId: string) => Promise<void>;
  removeFavorite: (itemId: string) => Promise<void>;
  isFavorited: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites when user logs in
  useEffect(() => {
    console.log('❤️ FavoritesContext: User changed', { hasUser: !!user, userId: user?.userId });
    if (user) {
      loadFavorites();
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    console.log('❤️ FavoritesContext: Loading favorites for user', user.userId);
    setIsLoading(true);
    try {
      const items = await favorites.list(user.userId);
      const ids = new Set(items.map(item => item.itemId));
      console.log('✅ FavoritesContext: Loaded favorites', { count: ids.size, ids: Array.from(ids) });
      setFavoriteIds(ids);
    } catch (error) {
      console.error('❌ FavoritesContext: Failed to load favorites', error);
    } finally {
      setIsLoading(false);
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

  const isFavorited = (itemId: string) => favoriteIds.has(itemId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, addFavorite, removeFavorite, isFavorited }}>
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
