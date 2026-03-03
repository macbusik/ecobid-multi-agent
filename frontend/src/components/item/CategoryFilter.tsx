
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
    <div className="relative">
      {/* Fade gradient on left */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      
      {/* Fade gradient on right */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      
      <div 
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory" 
        role="navigation" 
        aria-label="Item categories"
      >
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onChange(category.name === 'All' ? '' : category.name)}
            aria-label={`Filter by ${category.name}`}
            className={`px-5 py-3 min-h-[48px] rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 snap-start ${
              (category.name === 'All' && !selected) || selected === category.name
                ? 'bg-green-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
