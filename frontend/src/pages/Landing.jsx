import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE = 'http://localhost:8000'

// Configure axios with timeout
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function Landing({ onLogin, user }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendConnected, setBackendConnected] = useState(null)
  const navigate = useNavigate()

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const response = await axiosInstance.get('/', { timeout: 3000 })
      if (response.data) {
        setBackendConnected(true)
      }
    } catch (err) {
      setBackendConnected(false)
      console.error('Backend connection failed:', err)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!backendConnected) {
      setError('Cannot connect to backend server. Please ensure the backend is running on port 8000.')
      await checkBackendConnection()
      return
    }

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/admin_login', {
        username: username.trim(),
        password: password.trim()
      })
      
      if (response.data && response.data.token) {
        onLogin(response.data)
        navigate('/admin')
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out. Please check your connection and try again.')
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please ensure the backend is running on port 8000.')
        setBackendConnected(false)
      } else {
        setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUserLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!backendConnected) {
      setError('Cannot connect to backend server. Please ensure the backend is running on port 8000.')
      await checkBackendConnection()
      return
    }

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/user_login', {
        username: username.trim(),
        password: password.trim()
      })
      
      if (response.data && response.data.token) {
        onLogin(response.data)
        navigate('/chat')
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out. Please check your connection and try again.')
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please ensure the backend is running on port 8000.')
        setBackendConnected(false)
      } else {
        setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Welcome back, {user.username}!</h2>
          <button
            onClick={() => navigate(user.role === 'admin' ? '/admin' : '/chat')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition"
          >
            Go to {user.role === 'admin' ? 'Dashboard' : 'Chat'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ClarifyAI
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Intelligent Document Analyzer with RAG-based Question Answering
          </p>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAdminLogin(false)
                setShowUserLogin(true)
              }}
              className="px-8 py-4 glass rounded-xl text-white font-semibold hover:bg-white/20 transition"
            >
              Employer Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserLogin(false)
                setShowAdminLogin(true)
              }}
              className="px-8 py-4 glass rounded-xl text-white font-semibold hover:bg-white/20 transition"
            >
              Admin Login
            </motion.button>
          </div>
        </motion.div>

        {/* Backend Connection Status */}
        {backendConnected === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-4"
          >
            <div className="glass-dark rounded-xl p-4 border border-red-500/50">
              <div className="flex items-center gap-2 text-red-300">
                <span className="text-sm">⚠️ Backend server not connected</span>
                <button
                  onClick={checkBackendConnection}
                  className="text-xs underline hover:text-red-200"
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Forms */}
        {(showAdminLogin || showUserLogin) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {showAdminLogin ? 'Admin Login' : 'Employer Login'}
              </h2>
              
              <form onSubmit={showAdminLogin ? handleAdminLogin : handleUserLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter username"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter password"
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !backendConnected}
                  className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Logging in...
                    </span>
                  ) : !backendConnected ? (
                    'Backend Not Connected'
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <button
                onClick={() => {
                  setShowAdminLogin(false)
                  setShowUserLogin(false)
                }}
                className="mt-4 w-full text-sm text-white/60 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          {[
            { title: 'Document Analysis', desc: 'Upload and analyze PDF/DOCX documents' },
            { title: 'RAG Q&A', desc: 'Ask questions and get intelligent answers' },
            { title: 'Role-Based Access', desc: 'Admin and Employer roles with different privileges' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}



