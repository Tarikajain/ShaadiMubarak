import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, ChevronDown, ArrowRight } from 'lucide-react'

// ─── Waveform icon (4 animated bars) ────────────────────────────────────────
function WaveformIcon({ size = 16, color = '#7A0F46', animated = false }) {
  const bars = [
    { x: 1.5,  h: 8,  y: 8  },
    { x: 6,    h: 16, y: 4  },
    { x: 10.5, h: 12, y: 6  },
    { x: 15,   h: 6,  y: 9  },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x} rx="1.5" width="3" fill={color}
          animate={animated
            ? { height: [bar.h, bar.h * 0.3, bar.h * 1.2, bar.h * 0.5, bar.h], y: [bar.y, bar.y + bar.h * 0.35, bar.y - bar.h * 0.1, bar.y + bar.h * 0.25, bar.y] }
            : { height: bar.h, y: bar.y }
          }
          transition={animated ? { duration: 0.65, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' } : { duration: 0.2 }}
        />
      ))}
    </svg>
  )
}

// ─── Mock response engine ────────────────────────────────────────────────────
function getAgentResponse(text) {
  const t = text.toLowerCase()
  if (t.match(/mehndi|rekha/)) return {
    text: "Rekha Mehndi Art hasn't confirmed in 48h — flagged high risk. If she's a no-show, the Baraat at 4pm shifts. With Pandit Sureshji's 8:30pm hard stop, Pheras are at risk.",
    actions: [
      { label: 'View tasks',     route: '/tasks' },
      { label: 'Resolve crisis', route: '/crisis' },
      { label: 'View vendors',   route: '/vendors' },
    ],
  }
  if (t.match(/task|done today|get.*done|accomplish|remind|i need|to-do/)) return {
    text: "Got it! Your top tasks are sorted by priority. You can check them off right from the home screen or open the full task board.",
    actions: [
      { label: 'View tasks',  route: '/tasks' },
      { label: 'Go to Today', route: '/' },
    ],
  }
  if (t.match(/rsvp|guest|how many|attend/)) return {
    text: "127 of 317 guests have RSVPd. 3 declined, 187 still pending. Want me to nudge the ones who haven't replied?",
    actions: [
      { label: 'View guest list', route: '/guests' },
      { label: 'Send nudges',     route: '/guests' },
    ],
  }
  if (t.match(/budget|spend|money|paid|cost|remaining/)) return {
    text: "₹31.8L spent of ₹50L (64%). Most urgent: Catering ₹6L due Dec 10, Photography ₹1.75L due Dec 15. Florals are fully settled.",
    actions: [
      { label: 'View budget', route: '/budget' },
    ],
  }
  if (t.match(/vendor|confirm|status|booked/)) return {
    text: "12 of 14 vendors confirmed. Two need attention today — Rekha Mehndi (48h no response, high risk) and Pandit Sureshji (pending, hard stop 8:30pm).",
    actions: [
      { label: 'View vendors',   route: '/vendors' },
      { label: 'Resolve crisis', route: '/crisis' },
    ],
  }
  if (t.match(/sangeet|baraat|pheras|ceremony|haldi|today|happening|schedule/)) return {
    text: "Haldi ✓ done. Mehndi is in progress now. Sangeet at 7pm looks on track. Baraat at 4pm is ⚠️ at risk due to the Mehndi delay.",
    actions: [
      { label: 'View full schedule', route: '/' },
      { label: 'Resolve crisis',     route: '/crisis' },
    ],
  }
  if (t.match(/website|rsvp form|wedding page/)) return {
    text: "Your wedding website is live at vowstudio.co/ananya-rahul-2026. You have 284 page views and 127 RSVP responses so far.",
    actions: [
      { label: 'Open website',    route: '/website' },
      { label: 'View guest list', route: '/guests' },
    ],
  }
  return {
    text: "I'm here for you! Ask me about vendors, guests, budget, your ceremony schedule, or tell me what tasks you want to get done today.",
    actions: [
      { label: 'View tasks',      route: '/tasks' },
      { label: 'View guest list', route: '/guests' },
      { label: 'View budget',     route: '/budget' },
      { label: 'View vendors',    route: '/vendors' },
    ],
  }
}

const QUICK_CHIPS = [
  { label: 'Vendor status',     query: 'What is the status of my vendors?' },
  { label: 'RSVP count',        query: 'How many guests have RSVPd?' },
  { label: 'Budget remaining',  query: 'How much budget is left?' },
  { label: "Today's tasks",     query: "What tasks are due today?" },
]

// Simulation phrases for when real SR is unavailable
const DEMO_PHRASES = [
  'What is the status of my vendors?',
  'How many guests have RSVPd?',
  'What tasks are due today?',
  'How much budget is left?',
]

// ─── Main component ──────────────────────────────────────────────────────────
export default function AgentBar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [loading, setLoading] = useState(false)
  const [srAvailable, setSrAvailable] = useState(false)
  const recognitionRef = useRef(null)
  const simulationRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  // Web Speech API setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    try {
      const r = new SR()
      r.continuous = false
      r.interimResults = true
      r.lang = 'en-IN'

      r.onresult = (e) => {
        let interim = '', final = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript
          if (e.results[i].isFinal) final += transcript
          else interim += transcript
        }
        setInput(final || interim)
        setInterimText(final ? '' : interim)
        if (final) setListening(false)
      }
      r.onerror = (e) => {
        console.warn('SR error:', e.error)
        setListening(false)
        setInterimText('')
        runSimulation()
      }
      r.onend = () => { setListening(false); setInterimText('') }
      recognitionRef.current = r
      setSrAvailable(true)
    } catch (err) {
      console.warn('SpeechRecognition unavailable:', err)
    }
  }, [])

  // Simulation: type out a demo phrase letter-by-letter
  const runSimulation = () => {
    const phrase = DEMO_PHRASES[Math.floor(Math.random() * DEMO_PHRASES.length)]
    let idx = 0
    setListening(true)
    setInput('')
    setInterimText('')
    simulationRef.current = setInterval(() => {
      idx++
      const partial = phrase.slice(0, idx)
      setInput(partial)
      setInterimText(partial)
      if (idx >= phrase.length) {
        clearInterval(simulationRef.current)
        setInterimText('')
        setListening(false)
      }
    }, 55)
  }

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350)
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => () => clearInterval(simulationRef.current), [])

  const toggleMic = (e) => {
    e?.stopPropagation()
    if (listening) {
      clearInterval(simulationRef.current)
      try { recognitionRef.current?.stop() } catch (_) {}
      setListening(false)
      setInterimText('')
      return
    }
    if (!open) setOpen(true)
    setInput('')
    setInterimText('')

    if (srAvailable && recognitionRef.current) {
      try {
        setListening(true)
        recognitionRef.current.start()
      } catch (err) {
        console.warn('SR start failed, using simulation:', err)
        runSimulation()
      }
    } else {
      setTimeout(() => runSimulation(), 100)
    }
  }

  const sendMessage = (text = input.trim()) => {
    if (!text) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setInterimText('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'agent', ...getAgentResponse(text) }])
      setLoading(false)
    }, 800 + Math.random() * 400)
  }

  const handleAction = (action) => {
    if (action.route) {
      setOpen(false)
      setTimeout(() => navigate(action.route), 200)
    }
  }

  const pillLabel = listening
    ? (input || interimText || 'Listening…')
    : 'Ask your wedding agent…'

  return (
    <>
      {/* ── Collapsed pill bar ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(true)}
            style={{
              position: 'absolute', bottom: '72px', left: '14px', right: '14px', zIndex: 40,
              background: '#FFFBF5', borderRadius: '16px',
              border: '1px solid rgba(122,15,70,0.28)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(122,15,70,0.06)',
              padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '9px', cursor: 'text',
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(122,15,70,0.09)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={13} color="#7A0F46" />
            </div>
            <span className="font-outfit flex-1" style={{ fontSize: '13px', fontWeight: 300, color: listening && (input || interimText) ? '#1A1410' : 'rgba(26,20,16,0.38)' }}>
              {pillLabel}
            </span>
            {/* Waveform button in pill */}
            <button onClick={toggleMic} style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: listening ? 'rgba(122,15,70,0.12)' : 'rgba(122,15,70,0.07)', border: listening ? '1px solid rgba(122,15,70,0.3)' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WaveformIcon size={15} color="#7A0F46" animated={listening} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded chat sheet ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.3)', zIndex: 45 }} />

            <motion.div key="sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '74%', background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* Header */}
              <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: '11px', borderBottom: '1px solid rgba(0,0,0,0.055)', flexShrink: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={15} color="#FFFFFF" />
                </div>
                <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
                  <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410' }}>Wedding Agent</span>
                  <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.38)' }}>Powered by Shaadi Mubarak</span>
                </div>
                <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronDown size={16} color="rgba(26,20,16,0.45)" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }} className="no-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-3">
                    <p className="font-outfit text-center" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: '6px 0 10px' }}>
                      Ask anything about your wedding
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_CHIPS.map(chip => (
                        <button key={chip.label} onClick={() => sendMessage(chip.query)} className="font-outfit"
                          style={{ fontSize: '11px', fontWeight: 400, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', borderRadius: '99px', padding: '6px 13px', cursor: 'pointer' }}>
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px' }}>
                        {/* Bubble */}
                        <div style={{
                          maxWidth: '82%', padding: '10px 13px',
                          borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #1A1410, #2D2318)' : 'rgba(122,15,70,0.06)',
                          border: msg.role === 'agent' ? '1px solid rgba(122,15,70,0.10)' : 'none',
                        }}>
                          <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: msg.role === 'user' ? '#FFFFFF' : '#1A1410', margin: 0, lineHeight: 1.55 }}>
                            {msg.text}
                          </p>
                        </div>

                        {/* Action tiles with dividers */}
                        {msg.role === 'agent' && msg.actions?.length > 0 && (
                          <div style={{ width: '100%', maxWidth: '82%', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '14px', overflow: 'hidden', background: '#FFFBF5', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                            {msg.actions.slice(0, 4).map((action, idx) => (
                              <div key={action.label}>
                                <button
                                  onClick={() => handleAction(action)}
                                  className="font-outfit w-full flex items-center justify-between"
                                  style={{ padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.04)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410' }}>{action.label}</span>
                                  <ArrowRight size={12} color="rgba(26,20,16,0.3)" />
                                </button>
                                {idx < msg.actions.length - 1 && (
                                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 14px' }} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.10)' }}>
                          <div className="flex gap-1.5 items-center">
                            {[0, 1, 2].map(d => (
                              <motion.div key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: '#7A0F46' }}
                                animate={{ opacity: [0.25, 1, 0.25] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input row */}
              <div style={{ padding: '10px 12px 20px', borderTop: '1px solid rgba(0,0,0,0.055)', flexShrink: 0, display: 'flex', gap: '7px', alignItems: 'center' }}>
                <div className="glass-input flex-1 flex items-center" style={{ padding: '9px 13px', borderRadius: '13px', border: listening ? '1px solid rgba(122,15,70,0.28)' : undefined, background: listening ? 'rgba(122,15,70,0.03)' : undefined }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder={listening ? 'Listening — speak now…' : 'Ask anything…'}
                    style={{ fontSize: '13px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }}
                  />
                  {listening && (
                    <motion.div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7A0F46', flexShrink: 0, marginLeft: '6px' }}
                      animate={{ opacity: [1, 0.25, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }} />
                  )}
                </div>

                {/* Waveform button — fills with maroon + "End" label when listening */}
                <button onClick={toggleMic} style={{
                  height: 40, borderRadius: 12, flexShrink: 0,
                  padding: listening ? '0 12px' : '0',
                  width: listening ? 'auto' : 40,
                  minWidth: listening ? 64 : 40,
                  background: listening ? '#7A0F46' : 'rgba(122,15,70,0.07)',
                  border: listening ? 'none' : '1px solid rgba(122,15,70,0.18)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s ease',
                }}>
                  <WaveformIcon size={17} color={listening ? '#FFFFFF' : '#7A0F46'} animated={listening} />
                  {listening && (
                    <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>End</span>
                  )}
                </button>

                {/* Send */}
                <button onClick={() => sendMessage()} disabled={!input.trim()} style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: input.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.05)',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s ease',
                }}>
                  <Send size={14} color={input.trim() ? '#FFFFFF' : 'rgba(26,20,16,0.2)'} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
