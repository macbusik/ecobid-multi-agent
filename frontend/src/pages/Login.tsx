import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
