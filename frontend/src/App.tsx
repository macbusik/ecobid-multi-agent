import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth/AuthContext'
import { FavoritesProvider } from './lib/favorites/FavoritesContext'
import { LotteryProvider } from './lib/lottery/LotteryContext'
import { ToastProvider } from './lib/toast/ToastContext'
import Navigation from './components/layout/Navigation'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ItemDetail from './pages/ItemDetail'
import NewItem from './pages/NewItem'
import EditItem from './pages/EditItem'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Wins from './pages/Wins'

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <LotteryProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/items/:id/edit" element={<EditItem />} />
                <Route path="/items/new" element={<NewItem />} />
                <Route path="/wins" element={<Wins />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </ToastProvider>
        </LotteryProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
