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
      // Step 1: Get presigned URL
      const { uploadUrl, s3Key } = await photos.getUploadUrl(photo.file.name, photo.file.type);
      
      // Step 2: Upload photo to S3
      await photos.upload(uploadUrl, photo.file);
      
      // Step 3: Analyze with AI
      const result = await photos.analyze(s3Key);
      
      setAiSuggestions(result);
      setFormData({
        title: result.title,
        description: result.description,
        category: result.category,
      });
      
      // Store s3Key for later
      setPhoto({ ...photo, s3Key });
    } catch (err: any) {
      console.error('AI generation error:', err);
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
      const photoUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${photo.s3Key}`;
      
      await items.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        city: user.city || 'Unknown',
        photoUrl,
        lotteryWindowHours: parseInt(lotteryHours),
        aiGenerated: aiSuggestions?.aiGenerated || false,
      });
      
      router.push('/');
    } catch (err: any) {
      console.error('Publish error:', err);
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
