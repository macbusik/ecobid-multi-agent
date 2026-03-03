'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, preview: string) => void;
}

export default function PhotoUpload({ onPhotoSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onPhotoSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => {
              setPreview('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-600 transition-colors"
        >
          <span className="text-4xl mb-2">📷</span>
          <span className="text-gray-600 font-medium">Take Photo or Upload</span>
          <span className="text-sm text-gray-500 mt-1">Max 5MB</span>
        </button>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
