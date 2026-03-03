import { useAuth } from '../lib/hooks/useAuth';
import Button from '../components/ui/Button';

export default function Profile() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Please login</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <p className="text-lg">{user.name || 'Not set'}</p>
        </div>
        <div className="pt-4">
          <Button onClick={signOut} variant="secondary" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
