import type { Item, User, Message, ItemCategory, ItemStatus } from '@/lib/types';

const categories: ItemCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Sports', 'Other'];
const cities = ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'];
const statuses: ItemStatus[] = ['Active', 'Lottery_Closed', 'Reserved', 'Picked_Up'];

export const mockUsers: User[] = [
  { userId: 'u1', email: 'anna@test.com', name: 'Anna', city: 'Warsaw', itemsGivenCount: 5, itemsReceivedCount: 3, reputationScore: 8, createdAt: '2024-01-01T00:00:00Z' },
  { userId: 'u2', email: 'jan@test.com', name: 'Jan', city: 'Krakow', itemsGivenCount: 2, itemsReceivedCount: 4, reputationScore: 6, createdAt: '2024-01-02T00:00:00Z' },
];

export const mockItems: Item[] = Array.from({ length: 25 }, (_, i) => ({
  itemId: `item${i + 1}`,
  sellerId: mockUsers[i % 2].userId,
  title: `${categories[i % categories.length]} Item ${i + 1}`,
  description: `Great condition ${categories[i % categories.length].toLowerCase()} available for free pickup.`,
  category: categories[i % categories.length],
  photoUrl: `https://picsum.photos/seed/${i}/400/300`,
  status: statuses[i % statuses.length],
  city: cities[i % cities.length],
  lotteryWindowHours: 6,
  lotteryCloseTime: new Date(Date.now() + (i % 2 ? 3600000 : -3600000)).toISOString(),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const mockMessages: Message[] = [
  { messageId: 'm1', itemId: 'item1', senderId: 'u1', recipientId: 'u2', content: 'When can you pick it up?', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { messageId: 'm2', itemId: 'item1', senderId: 'u2', recipientId: 'u1', content: 'Tomorrow at 3pm works for me', timestamp: new Date(Date.now() - 1800000).toISOString() },
];
