import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Item {
  itemId: string;
  title: string;
  description: string;
  category: string;
  photoUrl: string;
  city: string;
  status: string;
  createdAt: string;
}

async function getItem(id: string): Promise<Item | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/items/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch item');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on-demand
  return [];
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          aria-label="Go back to item feed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </Link>

        {/* Item Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Photo */}
          <div className="relative w-full h-64 md:h-96 bg-gray-200">
            <Image
              src={item.photoUrl}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'Available' ? 'bg-green-100 text-green-800' :
                item.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.title}
            </h1>

            {/* Category & City */}
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {item.category}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.city}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* Posted Date */}
            <div className="text-sm text-gray-500">
              Posted {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {/* Action Button (placeholder for future lottery feature) */}
            {item.status === 'Available' && (
              <div className="mt-6">
                <button
                  disabled
                  className="w-full md:w-auto px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                >
                  Enter Lottery (Coming Soon)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
