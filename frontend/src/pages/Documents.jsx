import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import FileCard from '../components/FileCard'
import { Trash2, FileText, Loader2 } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

export default function Documents({ user }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/list_docs`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setDocuments(response.data)
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    setDeleting(docId)
    try {
      await axios.delete(`${API_BASE}/delete_doc/${docId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setDocuments(documents.filter(doc => doc.doc_id !== docId))
    } catch (err) {
      alert('Failed to delete document')
    } finally {
      setDeleting(null)
    }
  }

  const handleSummarize = async (docId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/summarize`,
        { doc_id: docId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      alert(`Summary:\n\n${response.data.summary}`)
    } catch (err) {
      alert('Failed to generate summary')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Documents</h1>
            <p className="text-white/60">{documents.length} document(s) uploaded</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/upload')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition"
          >
            Upload New
          </motion.button>
        </motion.div>

        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <FileText className="mx-auto mb-4 text-white/40" size={64} />
            <h2 className="text-2xl font-bold mb-2">No documents yet</h2>
            <p className="text-white/60 mb-6">Upload your first document to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/upload')}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition"
            >
              Upload Document
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.doc_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FileCard
                  document={doc}
                  onDelete={() => handleDelete(doc.doc_id)}
                  onSummarize={() => handleSummarize(doc.doc_id)}
                  deleting={deleting === doc.doc_id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



