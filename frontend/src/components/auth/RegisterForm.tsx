import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, confirmRegistration } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, name, city);
      setNeedsConfirmation(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmRegistration(email, confirmationCode);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <form onSubmit={handleConfirmation} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
          Check your email for a confirmation code
        </div>
        
        <Input
          type="text"
          label="Confirmation Code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Input
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <Input
        type="text"
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-green-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
