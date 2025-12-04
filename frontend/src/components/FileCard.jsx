import { motion } from 'framer-motion'
import { FileText, Trash2, Sparkles, Calendar } from 'lucide-react'

export default function FileCard({ document, onDelete, onSummarize, deleting }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <FileText className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white truncate">{document.filename}</h3>
            <p className="text-sm text-white/60">{document.chunk_count} chunks</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
        <Calendar size={14} />
        <span>{new Date(document.upload_date).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSummarize}
          className="flex-1 px-4 py-2 glass-dark rounded-xl text-white hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm"
        >
          <Sparkles size={16} />
          Summarize
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          disabled={deleting}
          className="px-4 py-2 glass-dark rounded-xl text-red-400 hover:bg-red-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}



