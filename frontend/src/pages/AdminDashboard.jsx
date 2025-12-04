import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FileText, Upload, List, BarChart3 } from 'lucide-react'

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Upload Documents',
      description: 'Upload PDF or DOCX files to the system',
      icon: Upload,
      path: '/admin/upload',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'View Documents',
      description: 'Manage and view all uploaded documents',
      icon: List,
      path: '/admin/documents',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Document Analytics',
      description: 'View document statistics and summaries',
      icon: BarChart3,
      path: '/admin/documents',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80">Manage your document collection</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => navigate(card.path)}
              className="glass rounded-3xl p-8 cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <card.icon size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-white/70">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass rounded-3xl p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl font-bold text-primary">-</div>
              <div className="text-white/60">Total Documents</div>
            </div>
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl font-bold text-primary">-</div>
              <div className="text-white/60">Total Chunks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



