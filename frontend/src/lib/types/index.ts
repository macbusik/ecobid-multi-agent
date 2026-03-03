// User entity
export interface User {
  userId: string;
  email: string;
  name: string;
  city: string;
  itemsGivenCount: number;
  itemsReceivedCount: number;
  reputationScore: number;
  createdAt: string;
}

// Item status types
export type ItemStatus = 
  | 'Draft' 
  | 'Available'
  | 'Active' 
  | 'Lottery_Closed' 
  | 'Reserved' 
  | 'Pickup_Confirmed' 
  | 'Picked_Up' 
  | 'Expired';

export type ItemCategory = 
  | 'Electronics' 
  | 'Furniture' 
  | 'Clothing' 
  | 'Books' 
  | 'Toys' 
  | 'Sports' 
  | 'Other';

// Item entity
export interface Item {
  itemId: string;
  sellerId: string;
  title: string;
  description: string;
  category: ItemCategory;
  photoUrl: string;
  status: ItemStatus;
  city: string;
  lotteryWindowHours: number;
  lotteryCloseTime: string;
  winnerUserId?: string;
  reservationExpiryTime?: string;
  createdAt: string;
  updatedAt: string;
}

// Message entity
export interface Message {
  messageId: string;
  itemId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

// API Request types
export interface CreateItemRequest {
  title: string;
  description: string;
  category: string;
  city: string;
  photoUrl: string;
  lotteryWindowHours: number;
  aiGenerated?: boolean;
}

export interface UpdateItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
}

export interface ListItemsRequest {
  category?: ItemCategory;
  search?: string;
  city?: string;
  limit?: number;
  lastKey?: string;
}

export interface SendMessageRequest {
  content: string;
}

// API Response types
export interface CreateItemResponse {
  itemId: string;
  photoUrl: string;
  aiSuggestions: {
    title: string;
    description: string;
    category: ItemCategory;
  };
}

export interface ListItemsResponse {
  items: Item[];
  lastKey?: string;
}

export interface ListMessagesResponse {
  messages: Message[];
}

export interface ApiError {
  message: string;
  code?: string;
}
