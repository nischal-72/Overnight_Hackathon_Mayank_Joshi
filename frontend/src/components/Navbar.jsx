import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Home, MessageSquare, Settings } from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ClarifyAI
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-white/80 text-sm">
                {user.username} ({user.role})
              </span>
              {user.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 glass-dark rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  <Settings size={16} />
                  Dashboard
                </motion.button>
              )}
              {user.role === 'employer' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat')}
                  className="px-4 py-2 glass-dark rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Chat
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onLogout) onLogout()
                  navigate('/')
                }}
                className="px-4 py-2 glass-dark rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}



