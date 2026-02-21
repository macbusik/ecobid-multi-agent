import Image from 'next/image';
import Link from 'next/link';
import { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const timeLeft = new Date(item.lotteryCloseTime).getTime() - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <Link href={`/items/${item.itemId}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={item.photoUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {item.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {item.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span>📍 {item.city}</span>
          </div>
          
          {item.status === 'Active' && (
            <div className="flex items-center text-sm text-orange-600 font-medium">
              <span>⏰ {hoursLeft}h {minutesLeft}m left</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span>{(item as any).sellerName || 'Unknown'}</span>
            <span className="ml-2">⭐ {(item as any).sellerReputation || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
