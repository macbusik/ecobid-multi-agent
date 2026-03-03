import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUpload from '../components/item/PhotoUpload';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function NewItem() {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement item creation
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PhotoUpload onPhotoUploaded={setPhotoUrl} />
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={4}
            required
          />
        </div>
        <Button type="submit" className="w-full">Publish Item</Button>
      </form>
    </div>
  );
}
