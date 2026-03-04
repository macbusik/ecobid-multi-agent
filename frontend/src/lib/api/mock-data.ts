import type { Item, User, Message, ItemCategory, ItemStatus } from '../types';

const categories: ItemCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Sports', 'Other'];
const cities = ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'];
const statuses: ItemStatus[] = ['Active', 'Lottery_Closed', 'Reserved', 'Picked_Up'];

export const mockUsers: User[] = [
  { userId: 'u1', email: 'anna@test.com', name: 'Anna', city: 'Warsaw', itemsGivenCount: 5, itemsReceivedCount: 3, reputationScore: 8, createdAt: '2024-01-01T00:00:00Z' },
  { userId: 'u2', email: 'jan@test.com', name: 'Jan', city: 'Krakow', itemsGivenCount: 2, itemsReceivedCount: 4, reputationScore: 6, createdAt: '2024-01-02T00:00:00Z' },
];

export const mockItems: Item[] = [
  // ACTIVE LOTTERY #1 - Ending in 2 minutes
  {
    itemId: 'item-001',
    sellerId: 'user-seller-1',
    title: 'IKEA Standing Desk - White',
    description: 'Adjustable height desk in excellent condition. Moving to smaller apartment. Includes cable management tray. 120x60cm surface.',
    category: 'Furniture',
    photoUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800',
    status: 'Available',
    city: 'Berlin',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes - ACTIVE
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  
  // ACTIVE LOTTERY #2 - Ending in 5 minutes
  {
    itemId: 'item-002',
    sellerId: 'user-seller-2',
    title: 'MacBook Pro 2019 - 13 inch',
    description: 'Works perfectly, battery health 85%. Upgraded to M3. Includes original charger and case. Some minor scratches on bottom.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    status: 'Available',
    city: 'Munich',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes - ACTIVE
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  
  // ACTIVE LOTTERY #3 - Just started (1 hour 50 minutes left)
  {
    itemId: 'item-003',
    sellerId: 'user-seller-3',
    title: 'Nespresso Coffee Machine',
    description: 'Barely used Nespresso Vertuo. Switched to manual espresso. Includes milk frother and 20 capsules. Works perfectly.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
    status: 'Available',
    city: 'Hamburg',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() + 110 * 60 * 1000).toISOString(), // 1h 50min - ACTIVE
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  
  // LOTTERY CLOSED - Winner selected (Reserved status)
  {
    itemId: 'item-004',
    sellerId: 'user-seller-1',
    title: 'Yoga Mat + Blocks Set',
    description: 'Premium yoga mat (6mm thick) with 2 cork blocks and carrying strap. Used only few times. Switching to Pilates.',
    category: 'Sports',
    photoUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    status: 'Reserved',
    city: 'Berlin',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Ended 30 min ago
    winnerId: 'user-winner-1',
    reservationExpiry: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(), // 23.5 hours left
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  
  // LOTTERY CLOSED - Just ended (Lottery_Closed status)
  {
    itemId: 'item-005',
    sellerId: 'user-seller-4',
    title: 'Kids Books Collection (Ages 5-8)',
    description: '15 children books including Harry Potter series, Roald Dahl classics. All in great condition. Kids outgrew them.',
    category: 'Books',
    photoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    status: 'Lottery_Closed',
    city: 'Frankfurt',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Ended 5 min ago
    createdAt: new Date(Date.now() - 2.08 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  
  // COMPLETED - Picked up
  {
    itemId: 'item-006',
    sellerId: 'user-seller-2',
    title: 'Vintage Leather Armchair',
    description: 'Classic brown leather armchair. Some wear on armrests but very comfortable. Perfect for reading corner.',
    category: 'Furniture',
    photoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    status: 'Picked_Up',
    city: 'Munich',
    lotteryWindowHours: 2,
    lotteryEndTime: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // Ended yesterday
    winnerId: 'user-winner-2',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockMessages: Message[] = [
  { messageId: 'm1', itemId: 'item1', senderId: 'u1', recipientId: 'u2', content: 'When can you pick it up?', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { messageId: 'm2', itemId: 'item1', senderId: 'u2', recipientId: 'u1', content: 'Tomorrow at 3pm works for me', timestamp: new Date(Date.now() - 1800000).toISOString() },
];

// Helper functions
export const getMockItems = () => mockItems.map(item => {
  const seller = mockUsers.find(u => u.userId === item.sellerId);
  return {
    ...item,
    sellerName: seller?.name || 'Unknown',
    sellerReputation: seller?.reputationScore || 0,
  };
});
