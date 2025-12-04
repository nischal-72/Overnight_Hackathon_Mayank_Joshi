import { motion } from 'framer-motion'

export default function ChatBubble({ message, isUser, timestamp }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'glass-dark text-white rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className="text-xs mt-1 opacity-60">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  )
}



