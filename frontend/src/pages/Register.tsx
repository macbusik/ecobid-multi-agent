import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
