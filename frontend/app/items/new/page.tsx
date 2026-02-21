'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '@/components/item/PhotoUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewItemPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [lotteryHours, setLotteryHours] = useState('6');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
  });
  const [loading, setLoading] = useState(false);

  const handlePhotoSelect = (file: File, preview: string) => {
    setPhoto({ file, preview });
  };

  const handleGenerateAI = async () => {
    if (!photo) return;

    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response
      setAiSuggestions({
        title: 'Vintage Wooden Chair',
        description: 'Beautiful vintage wooden chair in good condition. Perfect for dining room or office.',
        category: 'Furniture',
      });
      
      setFormData({
        title: 'Vintage Wooden Chair',
        description: 'Beautiful vintage wooden chair in good condition. Perfect for dining room or office.',
        category: 'Furniture',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        List a New Item
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <PhotoUpload onPhotoSelect={handlePhotoSelect} />
        </div>

        {photo && !aiSuggestions && (
          <Button onClick={handleGenerateAI} fullWidth loading={loading}>
            Generate AI Description
          </Button>
        )}

        {aiSuggestions && (
          <>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Clothing</option>
                <option>Books</option>
                <option>Toys</option>
                <option>Kitchen</option>
                <option>Sports</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lottery Window (hours)
              </label>
              <input
                type="number"
                min="3"
                max="12"
                value={lotteryHours}
                onChange={(e) => setLotteryHours(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            <Button onClick={handlePublish} fullWidth loading={loading}>
              Publish Item
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
