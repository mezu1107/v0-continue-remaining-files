"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean; time: string }[]>([
    { text: "Hello! How can we help you today?", isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage = {
      text: chatMessage,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages([...chatMessages, newMessage])
    setChatMessage("")
    
    // Simulate auto-reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "Thank you for your message! Our team will get back to you shortly.",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1000)
  }

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* WhatsApp Popup */}
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-2 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Contact via WhatsApp</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setIsWhatsAppOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              
              {/* Pakistan Office */}
              <a
                href="https://wa.me/923173712950?text=Hello%20AM%20Enterprises%2C%20I%20want%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 mb-3 hover:from-green-500/20 hover:to-green-600/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Phone className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-green-500 transition-colors">Pakistan Office</p>
                    <p className="text-sm text-muted-foreground">+92 317 371 2950</p>
                  </div>
                </div>
              </a>
              
              {/* International/UK Office */}
              <a
                href="https://wa.me/447717229638?text=Hello%20AM%20Enterprises%2C%20I%20want%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:from-green-500/20 hover:to-green-600/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Phone className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-green-500 transition-colors">UK / International</p>
                    <p className="text-sm text-muted-foreground">+44 77 1722 9638</p>
                  </div>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-2 w-80 sm:w-96 glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Live Chat</h3>
                    <p className="text-xs text-white/70">We typically reply instantly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-white hover:bg-white/20"
                  onClick={() => setIsChatOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              
              {/* Chat Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-background/50">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex",
                      msg.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        msg.isUser
                          ? "bg-gradient-to-r from-primary to-accent text-white rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.isUser ? "text-white/70" : "text-muted-foreground"
                      )}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-background/80">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="bg-gradient-to-r from-primary to-accent text-white"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Buttons */}
        <div className="flex flex-col gap-3">
          {/* WhatsApp Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsWhatsAppOpen(!isWhatsAppOpen); setIsChatOpen(false) }}
            className={cn(
              "size-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg transition-all",
              "hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]",
              isWhatsAppOpen && "ring-4 ring-green-500/30"
            )}
          >
            <svg viewBox="0 0 24 24" className="size-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.button>

          {/* Live Chat Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsChatOpen(!isChatOpen); setIsWhatsAppOpen(false) }}
            className={cn(
              "size-14 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-lg transition-all animate-pulse-glow",
              isChatOpen && "ring-4 ring-primary/30"
            )}
          >
            {isChatOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.button>
        </div>
      </div>
    </>
  )
}
