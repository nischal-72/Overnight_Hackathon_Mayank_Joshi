import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import AdminDashboard from './pages/AdminDashboard'
import Upload from './pages/Upload'
import Documents from './pages/Documents'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('clarifyai_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('clarifyai_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('clarifyai_user')
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing onLogin={handleLogin} user={user} />} />
        <Route 
          path="/chat" 
          element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin" 
          element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/upload" 
          element={user && user.role === 'admin' ? <Upload user={user} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/documents" 
          element={user && user.role === 'admin' ? <Documents user={user} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  )
}

export default App



