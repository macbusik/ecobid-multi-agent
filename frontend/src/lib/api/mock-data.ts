import type { Item, User, Message, ItemCategory, ItemStatus } from '../types';

const categories: ItemCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Sports', 'Other'];
const cities = ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'];
const statuses: ItemStatus[] = ['Active', 'Lottery_Closed', 'Reserved', 'Picked_Up'];

export const mockUsers: User[] = [
  { userId: 'u1', email: 'anna@test.com', name: 'Anna', city: 'Warsaw', itemsGivenCount: 5, itemsReceivedCount: 3, reputationScore: 8, createdAt: '2024-01-01T00:00:00Z' },
  { userId: 'u2', email: 'jan@test.com', name: 'Jan', city: 'Krakow', itemsGivenCount: 2, itemsReceivedCount: 4, reputationScore: 6, createdAt: '2024-01-02T00:00:00Z' },
];

export const mockItems: Item[] = [
  {
    itemId: 'item-001',
    sellerId: 'user-seller-1',
    title: 'Vintage Wooden Coffee Table',
    description: 'Beautiful oak coffee table in excellent condition. Minor scratches from normal use. Perfect for living room.',
    category: 'Furniture',
    photoUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
    status: 'Active',
    city: 'New York',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-23T10:00:00Z',
    updatedAt: '2026-02-23T10:00:00Z',
  },
  {
    itemId: 'item-002',
    sellerId: 'user-seller-2',
    title: 'Kitchen Mixer - KitchenAid',
    description: 'Barely used KitchenAid stand mixer. Red color. Comes with 3 attachments. Moving and need to downsize.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800',
    status: 'Active',
    city: 'San Francisco',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-23T09:30:00Z',
    updatedAt: '2026-02-23T09:30:00Z',
  },
  {
    itemId: 'item-003',
    sellerId: 'user-seller-3',
    title: 'Programming Books Collection',
    description: 'Set of 5 programming books: Clean Code, Design Patterns, Refactoring, and more. Great for developers.',
    category: 'Books',
    photoUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    status: 'Active',
    city: 'Boston',
    lotteryWindowHours: 12,
    lotteryEndTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-23T08:00:00Z',
    updatedAt: '2026-02-23T08:00:00Z',
  },
  {
    itemId: 'item-004',
    sellerId: 'user-seller-1',
    title: 'Kids Toys Bundle',
    description: 'Assorted toys for ages 3-7. Includes puzzles, building blocks, and stuffed animals. All clean and sanitized.',
    category: 'Toys',
    photoUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800',
    status: 'Active',
    city: 'New York',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-23T11:00:00Z',
    updatedAt: '2026-02-23T11:00:00Z',
  },
  {
    itemId: 'item-005',
    sellerId: 'user-seller-4',
    title: 'Bluetooth Headphones',
    description: 'Sony wireless headphones. Good battery life. Minor wear on ear pads but fully functional.',
    category: 'Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    status: 'Active',
    city: 'Seattle',
    lotteryWindowHours: 6,
    lotteryEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-23T07:00:00Z',
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
