'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with Cognito
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        placeholder="you@example.com"
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        placeholder="Min 8 characters"
      />
      
      <Input
        label="Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Your name"
      />
      
      <Input
        label="City"
        type="text"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        required
        placeholder="Your city"
      />
      
      <Button type="submit" fullWidth loading={loading}>
        Register
      </Button>
    </form>
  );
}
