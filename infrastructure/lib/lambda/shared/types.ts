/**
 * TypeScript type definitions for EcoBid marketplace entities.
 */

export type ItemStatus = 
  | 'Draft' 
  | 'Available' 
  | 'Lottery_Closed' 
  | 'Reserved' 
  | 'Pickup_Confirmed' 
  | 'Picked_Up' 
  | 'Expired';

export type ItemCategory = 
  | 'Furniture' 
  | 'Electronics' 
  | 'Clothing' 
  | 'Books' 
  | 'Toys' 
  | 'Kitchen' 
  | 'Sports' 
  | 'Other';

export interface User {
  PK: string; // USER#<userId>
  SK: string; // PROFILE
  userId: string;
  email: string;
  name: string;
  city: string;
  itemsGiven: number;
  itemsReceived: number;
  reputationScore: number;
  createdAt: string;
}

export interface Item {
  PK: string; // ITEM#<itemId>
  SK: string; // METADATA
  itemId: string;
  sellerId: string;
  title: string;
  description: string;
  category: ItemCategory;
  photoUrl: string;
  city: string;
  status: ItemStatus;
  lotteryWindowHours: number;
  lotteryCloseTime: string;
  winnerUserId?: string;
  reservationExpiryTime?: string;
  createdAt: string;
  updatedAt: string;
  // GSI1 attributes
  GSI1PK: string; // STATUS#<status>
  GSI1SK: string; // <createdAt>
  // GSI2 attributes
  GSI2PK: string; // CATEGORY#<category>#CITY#<city>
  GSI2SK: string; // <createdAt>
}

export interface LotteryEntry {
  PK: string; // ITEM#<itemId>
  SK: string; // LOTTERY#<userId>
  itemId: string;
  userId: string;
  enteredAt: string;
}

export interface Message {
  PK: string; // ITEM#<itemId>
  SK: string; // MESSAGE#<timestamp>#<messageId>
  messageId: string;
  itemId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}
