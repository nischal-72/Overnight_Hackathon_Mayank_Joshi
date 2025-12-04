import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ChatBubble from '../components/ChatBubble'
import { ChevronDown, ChevronUp } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showContext, setShowContext] = useState({})
  const messagesEndRef = useRef(null)
  const chatHistoryRef = useRef(null)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      
      const historyMessages = response.data.map(item => ({
        text: item.query,
        isUser: true,
        timestamp: item.timestamp,
        context: item.context_used,
        sources: item.sources
      }))
      
      const historyAnswers = response.data.map(item => ({
        text: item.answer,
        isUser: false,
        timestamp: item.timestamp,
        context: item.context_used,
        sources: item.sources
      }))
      
      // Interleave questions and answers
      const interleaved = []
      for (let i = 0; i < historyMessages.length; i++) {
        interleaved.push(historyMessages[i])
        interleaved.push(historyAnswers[i])
      }
      
      setMessages(interleaved)
    } catch (err) {
      console.error('Failed to load chat history:', err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_BASE}/query`,
        {
          query: input,
          username: user.username
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      const aiMessage = {
        text: response.data.answer,
        isUser: false,
        timestamp: new Date().toISOString(),
        context: response.data.context_used,
        sources: response.data.sources
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 h-[calc(100vh-200px)] flex flex-col"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Chat with ClarifyAI</h1>
          
          <div
            ref={chatHistoryRef}
            className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ChatBubble
                    message={message.text}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                  
                  {!message.isUser && message.context && message.context.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 ml-auto max-w-2xl"
                    >
                      <button
                        onClick={() => setShowContext(prev => ({
                          ...prev,
                          [index]: !prev[index]
                        }))}
                        className="w-full glass-dark rounded-xl p-3 text-sm text-white/70 hover:text-white transition flex items-center justify-between"
                      >
                        <span>View Context Used ({message.context.length} chunks)</span>
                        {showContext[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {showContext[index] && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 glass-dark rounded-xl p-4 space-y-2"
                        >
                          {message.context.map((ctx, i) => (
                            <div key={i} className="text-xs text-white/60 p-2 bg-black/20 rounded">
                              <div className="font-semibold mb-1">Chunk {i + 1}:</div>
                              <div className="line-clamp-3">{ctx}</div>
                            </div>
                          ))}
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 text-xs text-white/50">
                              Sources: {[...new Set(message.sources)].join(', ')}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-white/60"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
                <span>ClarifyAI is thinking...</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 px-4 py-3 glass-dark rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
            >
              Send
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}



