import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as api from '../api/client';

interface LotteryContextType {
  lotteryEntries: Set<string>;
  isInLottery: (itemId: string) => boolean;
  enterLottery: (itemId: string) => Promise<void>;
  loadLotteryEntries: () => Promise<void>;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

export function LotteryProvider({ children }: { children: ReactNode }) {
  const [lotteryEntries, setLotteryEntries] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const loadLotteryEntries = async () => {
    if (!user) {
      setLotteryEntries(new Set());
      return;
    }

    try {
      console.log('🎲 Loading lottery entries for user:', user.userId);
      const response = await (api.items as any).listLotteryEntries();
      setLotteryEntries(new Set(response.itemIds));
      console.log('🎲 Loaded lottery entries:', response.itemIds);
    } catch (error) {
      console.error('🎲 Failed to load lottery entries:', error);
    }
  };

  const isInLottery = (itemId: string): boolean => {
    return lotteryEntries.has(itemId);
  };

  const enterLottery = async (itemId: string) => {
    await api.items.enterLottery(itemId);
    setLotteryEntries(prev => new Set(prev).add(itemId));
    console.log('🎲 Entered lottery for item:', itemId);
  };

  useEffect(() => {
    loadLotteryEntries();
  }, [user]);

  return (
    <LotteryContext.Provider value={{ lotteryEntries, isInLottery, enterLottery, loadLotteryEntries }}>
      {children}
    </LotteryContext.Provider>
  );
}

export function useLottery() {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error('useLottery must be used within LotteryProvider');
  }
  return context;
}
