# EcoBid UX Fixes - Iteration 2

## Priority 1: Critical Touch Target Fixes

### 1.1 Category Filter Buttons (44px minimum)

**File:** `frontend/components/item/CategoryFilter.tsx`

```tsx
const categoryIcons: Record<string, string> = {
  All: '🏠', Electronics: '📱', Furniture: '🪑', Clothing: '👕',
  Books: '📚', Toys: '🧸', Kitchen: '🍳', Sports: '⚽', Other: '📦'
};

<button
  className={`
    min-h-[44px] px-4 py-3 rounded-full text-sm font-medium
    flex items-center gap-2 whitespace-nowrap transition-colors
    ${selected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
  `}
>
  <span>{categoryIcons[category]}</span>
  <span>{category}</span>
</button>
```

**Container update:**
```tsx
<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
```

### 1.2 Item Card Visual Hierarchy

**File:** `frontend/components/item/ItemCard.tsx`

```tsx
<div className="p-4 space-y-3">
  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
    {item.title}
  </h3>
  
  <div className="flex items-center gap-1.5 text-sm text-gray-600">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
    <span className="font-medium">{item.city}</span>
  </div>
  
  {item.status === 'Available' && (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      Available Now
    </div>
  )}
</div>
```

### 1.3 ARIA Labels

**Category Filter:**
```tsx
<div role="navigation" aria-label="Item categories">
  <button aria-label={`Filter by ${category}`}>
```

**Item Cards:**
```tsx
<Link href={`/items/${item.id}`} aria-label={`View ${item.title} in ${item.city}`}>
```

**Back Button:**
```tsx
<Link 
  href="/"
  className="inline-flex items-center gap-2 px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg min-h-[44px]"
  aria-label="Back to item feed"
>
```

## Priority 2: New Page Designs

### 2.1 Login/Register Pages

**File:** `frontend/app/auth/login/page.tsx`

```tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4">
      <div className="max-w-sm mx-auto w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your EcoBid account</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center">
          <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**File:** `frontend/app/auth/register/page.tsx`

```tsx
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4">
      <div className="max-w-sm mx-auto w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Join EcoBid</h1>
          <p className="text-gray-600 mt-2">Create your free account</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              id="city"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="San Francisco"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
          >
            Create Account
          </button>
        </form>
        
        <div className="text-center">
          <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 User Profile Page

**File:** `frontend/app/profile/page.tsx`

```tsx
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">JD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">John Doe</h1>
              <p className="text-gray-600">San Francisco, CA</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="divide-y divide-gray-200">
          <Link href="/profile/favorites" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-900">Favorites</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link href="/profile/my-items" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium text-gray-900">My Items</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link href="/profile/settings" className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-gray-900">Settings</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* Sign Out */}
        <div className="px-4 py-6">
          <button className="w-full text-red-600 font-medium py-3 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 2.3 Favorites Feature

**File:** `frontend/app/profile/favorites/page.tsx`

```tsx
export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Favorites</h1>
          </div>
        </div>
        
        {/* Favorites List */}
        <div className="p-4 space-y-4">
          {/* Empty State */}
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Items you favorite will appear here</p>
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              Browse Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Heart Icon Component:**
```tsx
// frontend/components/ui/FavoriteButton.tsx
interface FavoriteButtonProps {
  itemId: string;
  isFavorited: boolean;
  onToggle: (itemId: string) => void;
}

export default function FavoriteButton({ itemId, isFavorited, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={() => onToggle(itemId)}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className={`w-6 h-6 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}
```

## Implementation Order

1. **Critical Fixes** (30 min)
   - Update CategoryFilter.tsx button sizes
   - Fix ItemCard.tsx hierarchy
   - Add ARIA labels

2. **Auth Pages** (45 min)
   - Create login/register forms
   - Mobile-first responsive design

3. **Profile & Favorites** (60 min)
   - Profile page with navigation
   - Favorites page with empty state
   - Heart icon component

**Total Effort:** ~2.5 hours
**Touch Target Standard:** All interactive elements ≥44x44px
**Brand Color:** green-600 (#059669)