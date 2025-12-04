import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Upload as UploadIcon, CheckCircle, XCircle } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

export default function Upload({ user }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      if (ext !== 'pdf' && ext !== 'docx') {
        setStatus({ type: 'error', message: 'Only PDF and DOCX files are supported' })
        return
      }
      setFile(selectedFile)
      setStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file' })
      return
    }

    setUploading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${API_BASE}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      setStatus({
        type: 'success',
        message: `Document uploaded successfully! ${response.data.chunk_count} chunks created.`
      })
      
      setFile(null)
      
      setTimeout(() => {
        navigate('/admin/documents')
      }, 2000)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.detail || 'Upload failed'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Upload Document</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select File (PDF or DOCX)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center w-full h-32 glass-dark rounded-xl cursor-pointer hover:bg-white/10 transition border-2 border-dashed border-white/20"
                >
                  {file ? (
                    <div className="text-center">
                      <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-white/60 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadIcon className="mx-auto mb-2 text-white/60" size={32} />
                      <p className="text-white/60">Click to select a file</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                    : 'bg-red-500/20 border border-red-500/50 text-red-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <XCircle size={20} />
                )}
                <span>{status.message}</span>
              </motion.div>
            )}

            <div className="flex gap-4">
              <motion.button
                onClick={() => navigate('/admin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 glass-dark rounded-xl text-white hover:bg-white/10 transition"
              >
                Back
              </motion.button>
              <motion.button
                onClick={handleUpload}
                disabled={!file || uploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



