'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '@/components/item/PhotoUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { photos, items } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthContext';

export default function NewItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [photo, setPhoto] = useState<{ file: File; preview: string; s3Key?: string } | null>(null);
  const [lotteryHours, setLotteryHours] = useState('6');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoSelect = (file: File, preview: string) => {
    setPhoto({ file, preview });
    setAiSuggestions(null); // Reset AI suggestions when new photo selected
  };

  const handleGenerateAI = async () => {
    if (!photo) return;

    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 Step 1: Getting presigned URL...');
      const { uploadUrl, s3Key } = await photos.getUploadUrl(photo.file.name, photo.file.type);
      console.log('✅ Presigned URL received:', { s3Key, uploadUrl: uploadUrl.substring(0, 50) + '...' });
      
      console.log('🔵 Step 2: Uploading to S3...');
      await photos.upload(uploadUrl, photo.file);
      console.log('✅ Photo uploaded successfully');
      
      console.log('🔵 Step 3: Analyzing with AI...');
      const result = await photos.analyze(s3Key);
      console.log('✅ AI analysis complete:', result);
      
      setAiSuggestions(result);
      setFormData({
        title: result.title,
        description: result.description,
        category: result.category,
      });
      
      setPhoto({ ...photo, s3Key });
      console.log('✅ All steps complete');
    } catch (err: any) {
      console.error('❌ AI generation error:', err);
      setError(err.message || 'Failed to generate AI description');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!photo?.s3Key || !user) return;

    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 Step 4: Publishing item...');
      const photoUrl = `https://ecobid-items-191138354216.s3.eu-central-1.amazonaws.com/${photo.s3Key}`;
      
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        city: user.city || 'Unknown',
        photoUrl,
        lotteryWindowHours: parseInt(lotteryHours),
        aiGenerated: aiSuggestions?.aiGenerated || false,
      };
      
      console.log('📤 Sending item data:', itemData);
      const response = await items.create(itemData);
      console.log('✅ Item created:', response);
      
      router.push('/');
    } catch (err: any) {
      console.error('❌ Publish error:', err);
      setError(err.message || 'Failed to publish item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        List a New Item
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <PhotoUpload onPhotoSelect={handlePhotoSelect} />
        </div>

        {photo && !aiSuggestions && (
          <Button onClick={handleGenerateAI} fullWidth loading={loading}>
            {loading ? 'Analyzing with AI...' : 'Generate AI Description'}
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
              {loading ? 'Publishing...' : 'Publish Item'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
