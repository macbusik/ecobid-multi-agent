import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your EcoBid account</p>
        </div>
        
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <LoginForm />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
