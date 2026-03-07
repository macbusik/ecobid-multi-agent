import type {
  CreateItemRequest,
  CreateItemResponse,
  UpdateItemRequest,
  ListItemsRequest,
  ListItemsResponse,
  SendMessageRequest,
  Item,
  User,
  Message,
} from '../types';
import { mockItems, mockUsers, mockMessages } from './mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage keys for mock persistence
const STORAGE_KEYS = {
  LOTTERY_ENTRIES: 'ecobid_lottery_entries',
  FAVORITES: 'ecobid_favorites',
};

// Mock lottery entries storage
const getLotteryEntries = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOTTERY_ENTRIES);
  return stored ? JSON.parse(stored) : [];
};

const saveLotteryEntry = (itemId: string): void => {
  const entries = getLotteryEntries();
  if (!entries.includes(itemId)) {
    entries.push(itemId);
    localStorage.setItem(STORAGE_KEYS.LOTTERY_ENTRIES, JSON.stringify(entries));
  }
};

const removeLotteryEntry = (itemId: string): void => {
  const entries = getLotteryEntries();
  const filtered = entries.filter(id => id !== itemId);
  localStorage.setItem(STORAGE_KEYS.LOTTERY_ENTRIES, JSON.stringify(filtered));
};

export const mockApi = {
  auth: {
    register: async () => { await delay(500); },
    login: async () => { await delay(500); },
    logout: async () => { await delay(200); },
  },

  items: {
    create: async (data: CreateItemRequest): Promise<CreateItemResponse> => {
      await delay(1500);
      const newItem: Item = {
        itemId: `item-${Date.now()}`,
        sellerId: 'current-user',
        title: data.title,
        description: data.description,
        category: data.category as any,
        city: data.city,
        photoUrl: data.photoUrl,
        status: 'Available',
        lotteryWindowHours: data.lotteryWindowHours,
        lotteryEndTime: new Date(Date.now() + data.lotteryWindowHours * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Add to mock items list
      mockItems.unshift(newItem);
      return {
        itemId: newItem.itemId,
        photoUrl: newItem.photoUrl,
        aiSuggestions: {
          title: data.title,
          description: data.description,
          category: data.category as any,
        },
      };
    },

    update: async (itemId: string, data: UpdateItemRequest): Promise<Item> => {
      await delay(500);
      const item = mockItems.find(i => i.itemId === itemId);
      if (!item) throw new Error('Item not found');
      return { ...item, ...data, updatedAt: new Date().toISOString() };
    },

    getById: async (itemId: string): Promise<Item> => {
      await delay(300);
      const item = mockItems.find(i => i.itemId === itemId);
      if (!item) throw new Error('Item not found');
      return item;
    },

    list: async (params: ListItemsRequest = {}): Promise<ListItemsResponse> => {
      await delay(400);
      let filtered = [...mockItems];
      if (params.category) filtered = filtered.filter(i => i.category === params.category);
      if (params.search) filtered = filtered.filter(i => i.title.toLowerCase().includes(params.search!.toLowerCase()));
      if (params.city) filtered = filtered.filter(i => i.city === params.city);
      return { items: filtered.slice(0, params.limit || 20) };
    },

    delete: async (itemId: string) => { 
      await delay(300); 
      return { message: 'Item deleted' }; 
    },

    enterLottery: async (itemId: string) => { 
      await delay(300);
      saveLotteryEntry(itemId);
      return { success: true }; 
    },

    leaveLottery: async (itemId: string) => {
      await delay(300);
      const entries = getLotteryEntries();
      const filtered = entries.filter(id => id !== itemId);
      localStorage.setItem(STORAGE_KEYS.LOTTERY_ENTRIES, JSON.stringify(filtered));
      return { success: true };
    },
    
    listLotteryEntries: async () => {
      await delay(300);
      return { itemIds: getLotteryEntries() };
    },

    getWonItems: async () => {
      await delay(300);
      // Return empty array for mock (no backend lottery execution)
      return [];
    },
    
    confirmPickup: async (itemId: string) => { 
      await delay(300); 
      return { success: true }; 
    },
    
    markPickedUp: async (itemId: string) => { 
      await delay(300); 
      return { success: true }; 
    },
  },

  messages: {
    send: async (itemId: string, data: SendMessageRequest): Promise<Message> => {
      await delay(400);
      return {
        messageId: `m${Date.now()}`,
        itemId,
        senderId: 'u1',
        recipientId: 'u2',
        content: data.content,
        timestamp: new Date().toISOString(),
      };
    },

    list: async (itemId: string) => {
      await delay(300);
      return { messages: mockMessages.filter(m => m.itemId === itemId) };
    },
  },

  users: {
    getProfile: async (userId: string): Promise<User> => {
      await delay(300);
      const user = mockUsers.find(u => u.userId === userId);
      if (!user) throw new Error('User not found');
      return user;
    },

    getMe: async (): Promise<User> => {
      await delay(300);
      return mockUsers[0];
    },

    getFavorites: async () => {
      await delay(300);
      return { items: mockItems.slice(0, 3) };
    },
  },

  favorites: {
    list: async (userId: string) => { 
      await delay(300); 
      return mockItems.slice(0, 3); 
    },
    add: async (userId: string, itemId: string) => { 
      await delay(300); 
      return { message: 'Added to favorites' }; 
    },
    remove: async (userId: string, itemId: string) => { 
      await delay(300); 
      return { message: 'Removed from favorites' }; 
    },
  },
};
