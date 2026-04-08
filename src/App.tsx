import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import LoginPage from './pages/LoginPage'

function App() {
  const { username, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-5xl">🌱</div>
      </div>
    )
  }

  if (!username) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-surface max-w-lg mx-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </div>
  )
}

export default App
