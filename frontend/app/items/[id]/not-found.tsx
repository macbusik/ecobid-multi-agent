export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Item Not Found</h2>
        <p className="text-gray-600 mb-8">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
