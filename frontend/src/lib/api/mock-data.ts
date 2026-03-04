import type { Item, User, Message, ItemCategory, ItemStatus } from '../types';

const categories: ItemCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Sports', 'Other'];
const cities = ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'];
const statuses: ItemStatus[] = ['Active', 'Lottery_Closed', 'Reserved', 'Picked_Up'];

export const mockUsers: User[] = [
  { userId: 'u1', email: 'anna@test.com', name: 'Anna', city: 'Warsaw', itemsGivenCount: 5, itemsReceivedCount: 3, reputationScore: 8, createdAt: '2024-01-01T00:00:00Z' },
  { userId: 'u2', email: 'jan@test.com', name: 'Jan', city: 'Krakow', itemsGivenCount: 2, itemsReceivedCount: 4, reputationScore: 6, createdAt: '2024-01-02T00:00:00Z' },
];

export const mockItems: Item[] = [
  // Scenario 1: Ending very soon (5 seconds) - for testing countdown
  {
    itemId: 'item-001',
    sellerId: 'user-seller-1',
    title: 'IKEA Standing Desk - White',
    description: 'Adjustable height desk in excellent condition. Moving to smaller apartment. Includes cable management tray. 120x60cm surface.',
    category: 'Furniture',
    photoUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800',
    status: 'Available',
    city: 'Berlin',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 5 * 1000).toISOString(), // 5 seconds
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
  },
  // Scenario 2: Fresh listing (30 seconds) - shows full countdown
  {
    itemId: 'item-002',
    sellerId: 'user-seller-2',
    title: 'MacBook Pro 2019 - 13 inch',
    description: 'Works perfectly, battery health 85%. Upgraded to M3. Includes original charger and case. Some minor scratches on bottom.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    status: 'Available',
    city: 'Munich',
    lotteryWindowHours: 12,
    lotteryEndTime: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds
    createdAt: '2026-03-04T11:00:00Z',
    updatedAt: '2026-03-04T11:00:00Z',
  },
  // Scenario 3: Kids items bundle
  {
    itemId: 'item-003',
    sellerId: 'user-seller-3',
    title: 'Kids Books Collection (Ages 5-8)',
    description: '15 children books including Harry Potter series, Roald Dahl classics. All in great condition. Kids outgrew them.',
    category: 'Books',
    photoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    status: 'Available',
    city: 'Hamburg',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 15 * 1000).toISOString(), // 15 seconds
    createdAt: '2026-03-04T09:00:00Z',
    updatedAt: '2026-03-04T09:00:00Z',
  },
  // Scenario 4: Sports equipment
  {
    itemId: 'item-004',
    sellerId: 'user-seller-1',
    title: 'Yoga Mat + Blocks Set',
    description: 'Premium yoga mat (6mm thick) with 2 cork blocks and carrying strap. Used only few times. Switching to Pilates.',
    category: 'Sports',
    photoUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    status: 'Available',
    city: 'Berlin',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 20 * 1000).toISOString(), // 20 seconds
    createdAt: '2026-03-04T12:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },
  // Scenario 5: Kitchen appliance
  {
    itemId: 'item-005',
    sellerId: 'user-seller-4',
    title: 'Nespresso Coffee Machine',
    description: 'Barely used Nespresso Vertuo. Switched to manual espresso. Includes milk frother and 20 capsules. Works perfectly.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
    status: 'Available',
    city: 'Frankfurt',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 25 * 1000).toISOString(), // 25 seconds
    createdAt: '2026-03-04T08:00:00Z',
    updatedAt: '2026-02-23T07:00:00Z',
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
