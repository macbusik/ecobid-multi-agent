'use client';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = [
  { name: 'All', icon: '🏠' },
  { name: 'Electronics', icon: '📱' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Books', icon: '📚' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Kitchen', icon: '🍳' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Other', icon: '📦' },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="navigation" aria-label="Item categories">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onChange(category.name === 'All' ? '' : category.name)}
          aria-label={`Filter by ${category.name}`}
          className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            (category.name === 'All' && !selected) || selected === category.name
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
}
