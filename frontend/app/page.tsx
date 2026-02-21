'use client';

import { useState, useEffect } from 'react';
import ItemCard from '@/components/item/ItemCard';
import CategoryFilter from '@/components/item/CategoryFilter';
import Input from '@/components/ui/Input';
import { getMockItems } from '@/lib/api/mock-data';
import { Item } from '@/lib/types';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockItems = getMockItems();
      setItems(mockItems);
      setFilteredItems(mockItems);
      setLoading(false);
    };
    loadItems();
  }, []);

  useEffect(() => {
    let filtered = items;
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [category, search, items]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Browse Free Items
        </h1>
        <p className="text-gray-600">
          Find items near you and enter lotteries to receive them
        </p>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
