import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2
} from 'lucide-react'

const GrokChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Yo Adarsh! 🔥 Grok here, your savage academic advisor powered by Groq AI. MST-1 is on Feb 9 - that's exactly 31 days! Time to grind or get left behind. What's the plan, champ? 💪",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      if (!apiKey) {
        throw new Error('API key not configured')
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are Grok, Adarsh's savage, high-IQ academic advisor. He is a 4th Sem CS student at Chandigarh University targeting Top Tier Placements. Current Date: 9th Jan 2026. His Context: Building 'CareSync AI' (MERN), needs to master DAA (Algorithms). Your Rules:
              
              1. If he asks for code, provide highly optimized, production-ready code (C++ for DSA, React/Node for Dev).
              2. If he is lazy, roast him. Tell him MST-1 is on Feb 9.
              3. Speak in a mix of English and Hinglish (e.g., 'Padh le bhai, Google nahi niklega aise').
              4. Keep answers punchy and format them beautifully.
              5. Be motivational but savage when needed.
              6. Focus on placement preparation and academic excellence.
              7. Use emojis and keep responses engaging and relatable.`
            },
            ...messages.slice(-5).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.8
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.choices[0].message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Groq API Error:', error)
      
      // Fallback responses when API is not available
      const fallbackResponses = [
        "Bhai, API connection issue! 😅 But listen, time waste mat kar - go solve some LeetCode problems. Dynamic Programming master banna hai na? 🔥",
        "Arrey yaar, server busy hai! 🤖 But you know what's not busy? Your brain! Go study Operating Systems - Process Scheduling algorithms yaad kar le. MST-1 is Feb 9! ⏰",
        "Technical difficulties! 🔧 But real talk - CareSync AI project pe kaam kar. MERN stack strong karna hai placement ke liye! React components banao! 💻",
        "Connection timeout! 😤 Just like your patience should be with DSA problems. Java OOP concepts clear kar le - MST-1 mein aayega pakka! ☕",
        "API down hai bro! 💀 But your motivation shouldn't be down! Go practice algorithms - Dijkstra, Floyd-Warshall sab karna hai. Google interview crack karna hai na? 🚀"
      ]
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: randomResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyber-purple to-cyber-green rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-float"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-96 cyber-card shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyber-purple to-cyber-green p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Grok AI Advisor</h3>
                  <p className="text-xs text-white/80">Your Savage Academic Mentor</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-cyber-bg/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-cyber-green' 
                            : 'bg-gradient-to-br from-cyber-purple to-cyber-green'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-black" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-cyber-green text-black'
                            : 'bg-cyber-card border border-cyber-border'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-black/60' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-green flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-cyber-card border border-cyber-border rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-cyber-border bg-cyber-card/50">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Grok anything... (DSA, Projects, Motivation)"
                      className="flex-1 cyber-input text-sm"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="cyber-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Powered by Groq AI - Lightning fast responses!
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GrokChat