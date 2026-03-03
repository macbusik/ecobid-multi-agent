
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-green-600' : 'text-gray-700 hover:text-green-600';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="EcoBid home">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-green-600">EcoBid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/" className={`${isActive('/')} px-3 py-2`} aria-label="Browse items">
              Browse
            </Link>
            <Link to="/items/new" className={`${isActive('/items/new')} px-3 py-2`} aria-label="Give away an item">
              Give Item
            </Link>
            {user ? (
              <>
                <Link to="/profile" className={`${isActive('/profile')} px-3 py-2`} aria-label="View profile">
                  Profile
                </Link>
                <Link to="/favorites" className={`${isActive('/favorites')} px-3 py-2`} aria-label="View favorites">
                  Favorites
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-green-600 px-3 py-2"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className={`${isActive('/auth/login')} px-3 py-2`} aria-label="Login to account">
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  aria-label="Register account"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Browse items"
            >
              Browse
            </Link>
            <Link
              to="/items/new"
              className={`block px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive('/items/new')}`}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Give away an item"
            >
              Give Item
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive('/profile')}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="View profile"
                >
                  Profile
                </Link>
                <Link
                  to="/favorites"
                  className={`block px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive('/favorites')}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="View favorites"
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={`block px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive('/auth/login')}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Login to account"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 rounded-lg bg-green-600 text-white text-center hover:bg-green-700"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Register account"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
