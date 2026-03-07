import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  Item,
  User,
  Message,
  CreateItemRequest,
  CreateItemResponse,
  UpdateItemRequest,
  ListItemsRequest,
  ListItemsResponse,
  SendMessageRequest,
  ListMessagesResponse,
} from '../types';
import { mockApi } from './mock-client';

const API_URL = import.meta.env.VITE_API_URL!;
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

async function getAuthToken(): Promise<string | null> {
  if (USE_MOCK) return 'mock-token';
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch {
    return null;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  
  console.log('🌐 API Request:', {
    endpoint,
    method: options.method || 'GET',
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Only add Authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('📡 API Response:', {
    endpoint,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    console.error('❌ API Error Response:', error);
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ API Success:', { endpoint, data });
  return data;
}

// Items methods
export const items = USE_MOCK ? mockApi.items : {
  create: (data: CreateItemRequest) =>
    apiRequest<CreateItemResponse>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (itemId: string, data: UpdateItemRequest) =>
    apiRequest<Item>(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getById: (itemId: string) => apiRequest<Item>(`/items/${itemId}`),

  list: (params: ListItemsRequest = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.city) query.set('city', params.city);
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.lastKey) query.set('lastKey', params.lastKey);
    return apiRequest<ListItemsResponse>(`/items?${query}`);
  },

  delete: (itemId: string) =>
    apiRequest<{ message: string }>(`/items/${itemId}`, { method: 'DELETE' }),

  enterLottery: (itemId: string) =>
    apiRequest<{ message: string }>(`/items/${itemId}/lottery`, { method: 'POST' }),

  confirmPickup: (itemId: string) =>
    apiRequest<{ message: string }>(`/items/${itemId}/confirm-pickup`, { method: 'POST' }),

  markPickedUp: (itemId: string) =>
    apiRequest<{ message: string }>(`/items/${itemId}/mark-picked-up`, { method: 'POST' }),
};

// Messages methods
export const messages = USE_MOCK ? mockApi.messages : {
  send: (itemId: string, data: SendMessageRequest) =>
    apiRequest<Message>(`/items/${itemId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: (itemId: string) => apiRequest<ListMessagesResponse>(`/items/${itemId}/messages`),
};

// Users methods
export const users = USE_MOCK ? mockApi.users : {
  getProfile: (userId: string) => apiRequest<User>(`/users/${userId}`),
  getMe: () => apiRequest<User>('/users/me'),
  getFavorites: (userId: string) => apiRequest<ListItemsResponse>(`/users/${userId}/favorites`),
};

// Favorites methods
export const favorites = USE_MOCK ? mockApi.favorites : {
  list: (userId: string) =>
    apiRequest<Item[]>(`/users/${userId}/favorites`, { method: 'GET' }),
  
  add: (userId: string, itemId: string) =>
    apiRequest<{ message: string }>(`/users/${userId}/favorites/${itemId}`, { method: 'POST' }),
  
  remove: (userId: string, itemId: string) =>
    apiRequest<{ message: string }>(`/users/${userId}/favorites/${itemId}`, { method: 'DELETE' }),
};

// Photo upload methods
export const photos = {
  getUploadUrl: async (fileName: string, fileType: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        uploadUrl: 'mock-upload-url',
        s3Key: `mock-photos/${Date.now()}-${fileName}`,
        expiresIn: 3600
      };
    }
    return apiRequest<{ uploadUrl: string; s3Key: string; expiresIn: number }>('/items/upload-url', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileType }),
    });
  },

  upload: async (uploadUrl: string, file: File) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return; // Mock upload - do nothing
    }
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
  },

  analyze: async (s3Key: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
      return {
        title: 'Vintage Wooden Chair',
        description: 'Beautiful vintage wooden chair in excellent condition. Perfect for dining room or home office. Solid construction with comfortable seat.',
        category: 'Furniture',
        aiGenerated: true
      };
    }
    return apiRequest<{
      title: string;
      description: string;
      category: string;
      aiGenerated: boolean;
    }>('/items/analyze', {
      method: 'POST',
      body: JSON.stringify({ s3Key }),
    });
  },

  // Lottery methods
  enterLottery: async (itemId: string) => {
    if (USE_MOCK) {
      return mockApi.items.enterLottery(itemId);
    }
    return apiRequest<{ success: boolean }>(`/items/${itemId}/lottery`, {
      method: 'POST',
    });
  },

  leaveLottery: async (itemId: string) => {
    if (USE_MOCK) {
      return mockApi.items.leaveLottery(itemId);
    }
    return apiRequest<{ success: boolean }>(`/items/${itemId}/lottery`, {
      method: 'DELETE',
    });
  },

  listLotteryEntries: async () => {
    if (USE_MOCK) {
      return mockApi.items.listLotteryEntries();
    }
    return apiRequest<{ itemIds: string[] }>('/lottery/entries', {
      method: 'GET',
    });
  },

  getWonItems: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    return apiRequest<Item[]>('/lottery/won', {
      method: 'GET',
    });
  },

  confirmPickup: async (itemId: string) => {
    if (USE_MOCK) {
      return mockApi.items.confirmPickup(itemId);
    }
    return apiRequest<{ success: boolean }>(`/items/${itemId}/confirm-pickup`, {
      method: 'POST',
    });
  },

  markPickedUp: async (itemId: string) => {
    if (USE_MOCK) {
      return mockApi.items.markPickedUp(itemId);
    }
    return apiRequest<{ success: boolean }>(`/items/${itemId}/mark-picked-up`, {
      method: 'POST',
    });
  },
};

// Unified API client export (same as items for now)
export const apiClient = items;
