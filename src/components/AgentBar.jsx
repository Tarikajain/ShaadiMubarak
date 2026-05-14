import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, ChevronDown, ArrowRight } from 'lucide-react'
import { getMemoryContext, addMemory } from '../utils/memoryUtils'

// ─── Language detection ───────────────────────────────────────────────────────

const LANG_LABELS = { en: 'EN', hi: 'हिं', mix: 'MIX' }

function detectLanguage(text) {
  if (!text) return 'en'
  // Simple heuristic: check for Devanagari characters
  const devanagariCount = (text.match(/[ऀ-ॿ]/g) || []).length
  const totalWords = text.trim().split(/\s+/).length
  if (devanagariCount > 0 && devanagariCount / text.length > 0.3) return 'hi'
  if (devanagariCount > 0) return 'mix'
  // Check for common Hindi romanized words
  if (/\b(kya|hai|hain|aap|main|mera|tera|tum|nahi|nahi|bahut|bohot|kaise|kaisa|kyun|kab|kahan|accha|theek)\b/i.test(text)) return 'mix'
  return 'en'
}

function cleanTranscript(text) {
  return text
    .replace(/\b(umm?h?|uhh?|ahh?|hmm+|hm+|err?|aah+|uhh+|umm+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── 4-bar waveform icon (matches the dark-circle voice button design) ────────

function WaveformIcon({ size = 16, color = '#FFFFFF', animated = false }) {
  // 4 bars centered in 20×20 viewBox — outer short, inner tall
  // NOTE: y is a static SVG attribute only (not in animate) to avoid Framer Motion
  // treating animate.y as CSS translateY which would double-offset the bars.
  // Animation uses scaleY with transformOrigin:'50% 50%' so bars pulse from their center.
  const bars = [
    { h: 5,  delay: 0.08 },
    { h: 11, delay: 0    },
    { h: 14, delay: 0.14 },
    { h: 7,  delay: 0.05 },
  ]
  const barW = 3
  const totalW = 20
  const gap = (totalW - bars.length * barW) / (bars.length + 1)
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {bars.map(({ h, delay }, i) => (
        <motion.rect
          key={i}
          x={gap + i * (barW + gap)}
          y={10 - h / 2}          // static SVG attr — centers bar at y=10
          width={barW}
          height={h}
          rx={barW / 2}
          fill={color}
          style={{ transformOrigin: '50% 50%' }}   // scale from bar's own center
          animate={animated ? { scaleY: [1, 1.85, 0.55, 1] } : { scaleY: 1 }}
          transition={animated
            ? { duration: 0.68, repeat: Infinity, delay, ease: 'easeInOut' }
            : { duration: 0.2 }
          }
        />
      ))}
    </svg>
  )
}

// ─── Dark-circle voice button (used in pill + expanded chat) ──────────────────

function VoiceButton({ size = 40, listening = false, speaking = false, onClick, style = {} }) {
  const bg = listening ? '#7A0F46' : 'transparent'
  const border = listening ? 'none' : '1.5px solid rgba(122,15,70,0.35)'
  const iconColor = listening ? '#FFFFFF' : '#7A0F46'
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      style={{
        width: size, height: size, borderRadius: '50%', background: bg,
        border, cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'background 0.2s ease, border 0.2s ease',
        ...style,
      }}
    >
      {/* Pulsing ring when listening */}
      {listening && (
        <motion.div
          style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid rgba(122,15,70,0.45)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* Softer ring when AI is speaking back */}
      {speaking && !listening && (
        <motion.div
          style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid rgba(122,15,70,0.25)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <WaveformIcon size={size * 0.44} color={iconColor} animated={listening || speaking} />
    </motion.button>
  )
}

// ─── Profile helper: load name + days to wedding from localStorage ────────────

function loadProfile() {
  let name = ''
  let daysLeft = null
  try {
    const profile = JSON.parse(localStorage.getItem('sm_profile') || 'null')
    if (profile?.bride) name = profile.bride.split(' ')[0]
    if (profile?.date) {
      // profile.date may be MM/DD/YY or a fuzzy string
      const parts = profile.date.split('/')
      if (parts.length === 3) {
        const iso = `20${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
        const wedding = new Date(iso)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
        if (diff > 0) daysLeft = diff
      }
    }
  } catch (_) {}
  return { name, daysLeft }
}

// ─── Command parser + response engine ────────────────────────────────────────

// Fuzzy match: does the vendor name appear in the user text?
function matchVendor(text, vendors) {
  const t = text.toLowerCase()
  return vendors.find(v => {
    const words = v.name.toLowerCase().split(/\s+/)
    return words.some(w => w.length > 3 && t.includes(w))
  })
}

// Match task by title keyword
function matchTask(text, tasks) {
  const t = text.toLowerCase()
  return tasks.find(task => {
    const words = (task.title || task.text || '').toLowerCase().split(/\s+/)
    return words.some(w => w.length > 3 && t.includes(w))
  })
}

// Status labels
const STATUS_LABEL = { confirmed: 'confirmed ✓', pending: 'pending', at_risk: 'at risk ⚠️', cancelled: 'cancelled' }

// Load wedding profile from localStorage (used inside response engine)
function loadWeddingProfile() {
  try { return JSON.parse(localStorage.getItem('sm_profile') || '{}') } catch { return {} }
}

// Indian cities to detect in text
const INDIAN_CITIES = [
  'jaipur','mumbai','delhi','new delhi','chennai','bangalore','bengaluru','hyderabad',
  'kolkata','pune','goa','udaipur','jodhpur','agra','surat','ahmedabad','lucknow',
  'chandigarh','kochi','bhopal','indore','nagpur','coimbatore','mysore','mysuru',
]

// Month name → number for date parsing
const MONTH_RE = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i

function getAgentResponse(text, vendors = [], tasks = [], guests = []) {
  const t = text.toLowerCase()

  // ── Vendor status mutations ─────────────────────────────────────────────
  const confirmRe = /\b(confirm|confirmed)\b/
  const atRiskRe  = /\b(at.?risk|risky)\b/
  const cancelRe  = /\b(cancel|cancelled)\b/
  const isMutation = confirmRe.test(t) || atRiskRe.test(t) || cancelRe.test(t)
  if (isMutation) {
    const target = matchVendor(text, vendors)
    if (target) {
      const newStatus = confirmRe.test(t) ? 'confirmed' : atRiskRe.test(t) ? 'at_risk' : 'cancelled'
      return {
        text: `Done — ${target.name} marked ${newStatus}.`,
        command: { type: 'vendor_status', vendorId: target.id, newStatus },
        actions: [],
      }
    }
  }

  // ── Guest RSVP count ───────────────────────────────────────────────────
  if (/\brsvp|how many.*confirm|who.*coming|guest.*count\b/.test(t)) {
    const c = guests.filter(g => g.rsvp === 'confirmed').length
    const p = guests.filter(g => g.rsvp === 'pending').length
    return { text: `${c} confirmed, ${p} still pending.`, actions: [{ label: 'Guest list', route: '/guests' }] }
  }

  // ── Vendor summary ─────────────────────────────────────────────────────
  if (/\bvendor\b/.test(t)) {
    const c = vendors.filter(v => v.status === 'confirmed').length
    const p = vendors.filter(v => v.status === 'pending').length
    const r = vendors.filter(v => v.status === 'at_risk')
    return {
      text: `${c} confirmed${p ? `, ${p} pending` : ''}${r.length ? `, ${r.length} at risk (${r.map(v => v.name).join(', ')})` : ''}.`,
      actions: r.length ? [{ label: 'Vendors', route: '/vendors' }, { label: 'Resolve', route: '/crisis' }] : [{ label: 'Vendors', route: '/vendors' }],
    }
  }

  // ── Tasks ──────────────────────────────────────────────────────────────
  if (/\btask|to.do|pending.*task\b/.test(t)) {
    const p = tasks.filter(tk => !tk.done)
    const u = p.filter(tk => tk.priority === 'high')
    return {
      text: `${p.length} tasks pending${u.length ? ` — ${u.length} urgent (${u.slice(0, 2).map(t => t.title).join(', ')})` : ''}.`,
      actions: [{ label: 'Tasks', route: '/tasks' }],
    }
  }

  // ── Send invites ───────────────────────────────────────────────────────
  if (/\bsend.*invite|send.*invitation\b/.test(t)) {
    const p = guests.filter(g => g.rsvp === 'pending').length
    return {
      text: `Sending invitations to ${p} pending guests now.`,
      command: { type: 'send_invites', count: p },
      actions: [],
    }
  }

  // ── Default (minimal) ──────────────────────────────────────────────────
  return { text: "On it — what would you like me to do?", actions: [] }
}

const QUICK_CHIPS = [
  { label: 'Update wedding details', query: 'Update our wedding details — names, date and city' },
  { label: 'Push website',           query: 'Push the latest details to my website and notify guests' },
  { label: 'Vendor status',          query: 'What is the status of my vendors?' },
  { label: 'RSVP count',             query: 'How many guests have confirmed their RSVP?' },
  { label: "Today's tasks",          query: 'What tasks are pending?' },
  { label: 'Send invites',           query: 'Send invites to all pending guests' },
]

// Simulation phrases for when real SR is unavailable
const DEMO_PHRASES = [
  'What is the status of my vendors?',
  'How many guests have RSVPd?',
  'What tasks are due today?',
  'How much budget is left?',
]

// ─── Claude LLM integration ───────────────────────────────────────────────────

async function callAgentLLM(message, vendors, tasks, guests, conversationHistory) {
  const apiKey = import.meta.env.VITE_GEMINI_KEY
  if (!apiKey) return null

  let profile = {}
  try { profile = JSON.parse(localStorage.getItem('sm_profile') || 'null') || {} } catch (_) {}

  const confirmed    = guests.filter(g => g.rsvp === 'confirmed').length
  const pending      = guests.filter(g => g.rsvp === 'pending').length
  const declined     = guests.filter(g => g.rsvp === 'declined').length
  const pendingTasks = tasks.filter(t => !t.done)

  const memoryContext = getMemoryContext()

  const systemPrompt = `You are Mubarak — an expert Indian wedding planner AI built into ShaadiMubarak.ai. You are knowledgeable, direct, and act immediately.

WEDDING DATA:
Couple: ${profile.bride || '?'} & ${profile.groom || profile.partner || '?'}
Date: ${profile.date || 'not set'} | City: ${profile.city || profile.location || 'not set'} | Budget: ${profile.budget || 'not set'} | Theme: ${profile.theme || 'not set'}
Vendors (${vendors.length}): ${vendors.map(v => `${v.name} [${v.category}, ${v.status}]`).join(', ') || 'none booked'}
Tasks: ${pendingTasks.length} pending${pendingTasks.length ? ' — ' + pendingTasks.slice(0, 5).map(t => t.title).join(', ') : ''}
Guests: ${guests.length} total · ${confirmed} confirmed · ${pending} pending · ${declined} declined
${memoryContext ? `\nMEMORY (things I've already learned about this couple):\n${memoryContext}\n` : ''}
COMMANDS (use when the user asks you to take action):
- vendor_status: { type:"vendor_status", vendorId, newStatus:"confirmed"|"pending"|"at_risk"|"cancelled" }
- add_task: { type:"add_task", title }
- complete_task: { type:"complete_task", taskId }
- add_guest: { type:"add_guest", name, rsvp:"pending"|"confirmed"|"declined" }
- update_wedding: { type:"update_wedding", updates:{bride?,groom?,date?,city?,theme?,budget?}, pushWebsite?:bool, notifyGuests?:bool }
- send_invites: { type:"send_invites" }

KNOWLEDGE: You know everything about Indian weddings — Hindu, Muslim, Sikh, South Indian, Punjabi, Bengali, Gujarati, Telugu ceremonies; mehndi, sangeet, haldi, baraat, pheras, vidaai, reception; muhurtas and auspicious dates; trousseau, lehenga, sherwani, saree; pandit, choreographer, mehendi artist; catering veg/non-veg ratios; budgeting in lakhs; vendor negotiation; honeymoon planning; décor trends; invitation etiquette; pre-wedding shoot ideas; gift registry; guest seating; duties of baraat; family rituals. Answer any question in depth.

RULES — follow these strictly:
1. NEVER list what you can do. Never say "I can help with X, Y, Z". Just respond.
2. NEVER say your name unless asked. Just talk.
3. For questions: answer directly, knowledgeably, and conversationally.
4. For actions: execute and confirm in ONE short sentence. No preamble.
5. Be brief. 1–3 sentences unless detail is genuinely needed.
6. Match the user's language — English, Hindi, or Hinglish.
7. Only include "actions" chips when they are genuinely useful (0–2 max). Omit entirely if not helpful.
8. Only include "command" when the user explicitly asks you to do something.
9. When the user shares a preference, decision, or important fact about their wedding, add it to "remember" so it's retained for future conversations. Keep facts concise (max 12 words each).

OUTPUT: Respond with ONLY valid JSON — no markdown, no extra text.
{"text":"...","command":null,"actions":[],"remember":[]}`

  // Gemini uses "model" role (not "assistant") and contents array
  const contents = conversationHistory.slice(-10).map(m => ({
    role:  m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
  contents.push({ role: 'user', parts: [{ text: message }] })

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
          responseMimeType: 'application/json',  // forces clean JSON output, no markdown wrapping
        },
      }),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    console.error('[Mubarak] Gemini API error:', res.status, errText)
    return null
  }
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
  if (!raw) {
    console.error('[Mubarak] Empty response from Gemini:', JSON.stringify(data))
    return null
  }
  // Strip any markdown fences just in case
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  // Find outermost JSON object
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd   = cleaned.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('[Mubarak] No JSON found in response:', cleaned)
    return null
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1))

  // Persist any new memory facts the model identified
  if (Array.isArray(parsed.remember)) {
    parsed.remember.forEach(({ fact, category } = {}) => {
      if (fact) addMemory(fact, category || 'general')
    })
  }

  return {
    text:    parsed.text    || '',
    command: parsed.command || null,
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AgentBar({ vendors = [], setVendors, tasks = [], setTasks, guests = [], setGuests, forceOpen = false, onForceOpenHandled, forceQuery = null, onForceQueryHandled }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [pendingCommand, setPendingCommand] = useState(null) // { type, ...payload }
  const [listening, setListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [loading, setLoading] = useState(false)
  const [srAvailable, setSrAvailable] = useState(false)
  const [lang, setLang] = useState('en')

  const recognitionRef = useRef(null)
  const simulationRef = useRef(null)
  const autoSendTimerRef = useRef(null)
  const autoStopTimerRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const continuousRef = useRef(false)
  const accumulatedRef = useRef('')
  const sendHandlerRef = useRef(null)
  const hasOpenedRef = useRef(false)
  const voiceConvRef = useRef(false) // true when exchange was voice-initiated (enables auto-restart)
  const messagesRef = useRef([])     // mirror of messages state for use inside callbacks

  const profile = loadProfile()

  // Keep messagesRef in sync so sendMessage closure can read latest history without stale closure
  useEffect(() => { messagesRef.current = messages }, [messages])

  // Open AgentBar programmatically (e.g. "Customize with Mubarak" from onboarding)
  useEffect(() => {
    if (forceOpen) {
      setOpen(true)
      onForceOpenHandled?.()
    }
  }, [forceOpen]) // eslint-disable-line

  // Auto-send a proactive query when triggered externally (e.g. "Edit with Mubarak")
  useEffect(() => {
    if (forceQuery && open) {
      setTimeout(() => {
        sendHandlerRef.current?.(forceQuery)
        onForceQueryHandled?.()
      }, 420)
    }
  }, [forceQuery, open]) // eslint-disable-line

  // Web Speech API setup (continuous mode for auto-send on pause)
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    try {
      const r = new SR()
      r.continuous = true
      r.interimResults = true
      r.lang = 'en-IN' // en-IN transcribes Hindi speech in Roman/Hinglish (not Devanagari)

      const resetAutoStopTimer = () => {
        clearTimeout(autoStopTimerRef.current)
        autoStopTimerRef.current = setTimeout(() => {
          continuousRef.current = false
          setListening(false)
          setInterimText('')
          try { r.stop() } catch (_) {}
          clearTimeout(autoSendTimerRef.current)
        }, 30000)
      }

      r.onspeechstart = () => {
        // Interrupt TTS if speaking
        if (window.speechSynthesis?.speaking) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
        }
      }

      r.onresult = (e) => {
        resetAutoStopTimer()
        let interim = '', final = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript
          if (e.results[i].isFinal) final += transcript
          else interim += transcript
        }
        const cleanInterim = cleanTranscript(interim)
        const cleanFinal = cleanTranscript(final)
        if (cleanInterim) setInput(cleanInterim)
        if (cleanFinal) {
          accumulatedRef.current = (accumulatedRef.current + ' ' + cleanFinal).trim()
          setInput(accumulatedRef.current)
          setLang(detectLanguage(accumulatedRef.current))
          // Auto-send on pause (1.5s after last final result)
          clearTimeout(autoSendTimerRef.current)
          autoSendTimerRef.current = setTimeout(() => {
            const text = accumulatedRef.current.trim()
            if (text) {
              accumulatedRef.current = ''
              setInput('')
              setInterimText('')
              sendHandlerRef.current?.(text)
            }
          }, 1500)
        }
      }

      r.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return
        continuousRef.current = false
        setListening(false)
        setInterimText('')
      }

      r.onend = () => {
        // Restart if still supposed to be listening
        if (continuousRef.current) {
          try { r.start() } catch (_) {}
        } else {
          setInterimText('')
        }
      }

      recognitionRef.current = r
      setSrAvailable(true)
    } catch (err) {
      console.warn('SpeechRecognition unavailable:', err)
    }
  }, [])

  // Open: load greeting on first open
  useEffect(() => {
    if (open && !hasOpenedRef.current) {
      hasOpenedRef.current = true
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 800)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 350)
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading, pendingActions])

  useEffect(() => () => {
    clearInterval(simulationRef.current)
    clearTimeout(autoSendTimerRef.current)
    clearTimeout(autoStopTimerRef.current)
    window.speechSynthesis?.cancel()
  }, [])

  // Simulation: type out a demo phrase letter-by-letter
  const runSimulation = useCallback(() => {
    const phrase = DEMO_PHRASES[Math.floor(Math.random() * DEMO_PHRASES.length)]
    let idx = 0
    continuousRef.current = true
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
        setTimeout(() => {
          accumulatedRef.current = ''
          setInput('')
          continuousRef.current = false
          setListening(false)
          sendHandlerRef.current?.(phrase)
        }, 1200)
      }
    }, 55)
  }, [])

  const toggleMic = useCallback((e) => {
    e?.stopPropagation()
    if (listening) {
      clearInterval(simulationRef.current)
      clearTimeout(autoSendTimerRef.current)
      clearTimeout(autoStopTimerRef.current)
      window.speechSynthesis?.cancel()
      voiceConvRef.current = false
      continuousRef.current = false
      try { recognitionRef.current?.stop() } catch (_) {}
      setListening(false)
      setInterimText('')
      setIsSpeaking(false)
      accumulatedRef.current = ''
      return
    }
    if (!open) setOpen(true)
    setInput('')
    setInterimText('')
    accumulatedRef.current = ''

    voiceConvRef.current = true
    if (srAvailable && recognitionRef.current) {
      try {
        continuousRef.current = true
        setListening(true)
        recognitionRef.current.start()
        // Auto-stop after 30s
        clearTimeout(autoStopTimerRef.current)
        autoStopTimerRef.current = setTimeout(() => {
          voiceConvRef.current = false
          continuousRef.current = false
          setListening(false)
          try { recognitionRef.current?.stop() } catch (_) {}
        }, 30000)
      } catch (err) {
        console.warn('SR start failed, using simulation:', err)
        runSimulation()
      }
    } else {
      setTimeout(() => runSimulation(), 100)
    }
  }, [listening, open, srAvailable, runSimulation])

  // ── Execute a confirmed mutation command ─────────────────────────────────
  const executeCommand = useCallback((cmd) => {
    if (!cmd) return
    let confirmText = ''
    if (cmd.type === 'vendor_status' && setVendors) {
      setVendors(vs => vs.map(v => v.id === cmd.vendorId ? { ...v, status: cmd.newStatus, risk: cmd.newStatus === 'at_risk' ? 'high' : cmd.newStatus === 'pending' ? 'medium' : 'low' } : v))
      const vName = vendors.find(v => v.id === cmd.vendorId)?.name || 'Vendor'
      confirmText = `Done! ${vName} has been updated to ${STATUS_LABEL[cmd.newStatus]}.`
    } else if (cmd.type === 'add_task' && setTasks) {
      const newTask = {
        id: Date.now(),
        title: cmd.title,
        text: cmd.title,
        done: false,
        priority: 'medium',
        category: 'General',
        dueDate: null,
      }
      setTasks(ts => [newTask, ...ts])
      confirmText = `Added "${cmd.title}" to your task list! ✓`
    } else if (cmd.type === 'complete_task' && setTasks) {
      setTasks(ts => ts.map(t => t.id === cmd.taskId ? { ...t, done: true } : t))
      const tTitle = tasks.find(t => t.id === cmd.taskId)?.title || 'Task'
      confirmText = `"${tTitle}" marked as done ✓`
    } else if (cmd.type === 'add_guest' && setGuests) {
      const newGuest = {
        id: Date.now(), name: cmd.name, rsvp: 'pending',
        side: 'bride', tier: 'everyone', phone: '', email: '',
      }
      setGuests(gs => [newGuest, ...gs])
      confirmText = `${cmd.name} added to the guest list as pending RSVP ✓`
    } else if (cmd.type === 'update_wedding') {
      // Write updated profile fields to localStorage
      try {
        const profile = JSON.parse(localStorage.getItem('sm_profile') || '{}')
        if (cmd.updates?.bride)    profile.bride    = cmd.updates.bride
        if (cmd.updates?.partner)  profile.partner  = cmd.updates.partner
        if (cmd.updates?.date)     profile.date     = cmd.updates.date
        if (cmd.updates?.location) profile.location = cmd.updates.location
        localStorage.setItem('sm_profile', JSON.stringify(profile))
      } catch (_) {}
      const done = []
      const u = cmd.updates || {}
      if (u.bride || u.partner) done.push(`Names set to ${u.bride} & ${u.partner} ✓`)
      if (u.date)     done.push(`Date updated to ${u.date} ✓`)
      if (u.location) done.push(`Location set to ${u.location} ✓`)
      if (cmd.pushWebsite) done.push('Website pushed live ✓')
      if (cmd.notifyGuests && cmd.guestCount) done.push(`${cmd.guestCount} guests notified via WhatsApp ✓`)
      confirmText = done.join('\n')
    } else if (cmd.type === 'send_invites') {
      confirmText = `Invitations sent to ${cmd.count} guests via WhatsApp and email ✓`
    }
    setPendingCommand(null)
    if (confirmText) {
      setMessages(m => [...m, { role: 'agent', text: confirmText, actions: [] }])
    }
  }, [vendors, tasks, guests, setVendors, setTasks, setGuests])

  const sendMessage = useCallback(async (text = input.trim()) => {
    if (!text) return
    clearTimeout(autoSendTimerRef.current)
    setLang(detectLanguage(text))
    setPendingActions([])
    setPendingCommand(null)
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setInterimText('')
    accumulatedRef.current = ''
    setLoading(true)

    // Snapshot conversation history before the new user message is appended
    const history = messagesRef.current.slice()

    let response = null
    try {
      response = await callAgentLLM(text, vendors, tasks, guests, history)
    } catch (err) {
      console.error('[Mubarak] callAgentLLM threw:', err)
    }

    // Fallback to local pattern matching if LLM unavailable or errors
    if (!response || !response.text) {
      response = getAgentResponse(text, vendors, tasks, guests)
    }

    setMessages(m => [...m, { role: 'agent', ...response }])
    setPendingActions(response.actions || [])
    if (response.command) setPendingCommand(response.command)
    setLoading(false)

    // TTS for short agent replies
    if (window.speechSynthesis && response.text.length < 200) {
      const utt = new SpeechSynthesisUtterance(response.text)
      utt.lang = 'en-IN'
      utt.rate = 1.05
      setIsSpeaking(true)
      utt.onend = () => {
        setIsSpeaking(false)
        // Bidirectional: restart mic automatically if this was a voice conversation
        if (voiceConvRef.current && !continuousRef.current) {
          setTimeout(() => {
            if (!continuousRef.current) {
              setInput('')
              setInterimText('')
              accumulatedRef.current = ''
              if (srAvailable && recognitionRef.current) {
                try {
                  continuousRef.current = true
                  setListening(true)
                  recognitionRef.current.start()
                  clearTimeout(autoStopTimerRef.current)
                  autoStopTimerRef.current = setTimeout(() => {
                    voiceConvRef.current = false
                    continuousRef.current = false
                    setListening(false)
                    try { recognitionRef.current?.stop() } catch (_) {}
                  }, 30000)
                } catch (_) {}
              }
            }
          }, 300)
        }
      }
      utt.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utt)
    }
  }, [input, vendors, tasks, guests])

  // Keep sendHandlerRef current
  useEffect(() => { sendHandlerRef.current = sendMessage }, [sendMessage])

  const handleAction = useCallback((action) => {
    if (action.type === 'tasks' && action.label) {
      sendMessage(action.label); return
    }
    // query = send a follow-up message inline (no navigation)
    if (action.query) {
      sendMessage(action.query); return
    }
    if (action.route) {
      setOpen(false)
      setTimeout(() => navigate(action.route), 200)
    }
  }, [navigate, sendMessage])

  const profile_data = loadProfile()
  const pillLabel = listening
    ? (input || interimText || 'Listening…')
    : 'Ask your wedding agent…'

  const greeting = profile_data.name
    ? `Hi ${profile_data.name}! ${profile_data.daysLeft} days to your wedding — ask me anything. Speak in English, Hindi, or mix.`
    : 'Ask anything about your wedding — speak in English, Hindi, or both.'

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
              position: 'absolute', bottom: '72px', left: '14px', right: '14px', zIndex: 300,
              background: '#FFFBF5', borderRadius: '16px',
              border: '1px solid rgba(122,15,70,0.28)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(122,15,70,0.06)',
              padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '9px', cursor: 'text',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 9,
              background: 'rgba(122,15,70,0.09)', border: '1px solid rgba(122,15,70,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sparkles size={13} color="#7A0F46" />
            </div>

            <span className="font-work-sans flex-1" style={{
              fontSize: '13px', fontWeight: 300,
              color: listening && (input || interimText) ? '#2C2C2C' : 'rgba(44,44,44,0.55)',
            }}>
              {pillLabel}
            </span>

            {/* Language badge in pill (when listening and non-English detected) */}
            {listening && lang !== 'en' && (
              <span className="font-work-sans" style={{
                fontSize: '9px', fontWeight: 600, color: '#7A0F46',
                background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.20)',
                borderRadius: 99, padding: '2px 7px', flexShrink: 0,
              }}>
                {LANG_LABELS[lang]}
              </span>
            )}

            {/* Waveform button in pill */}
            <VoiceButton size={36} listening={listening} speaking={isSpeaking} onClick={toggleMic} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded chat sheet ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(44,44,44,0.3)', zIndex: 305 }}
            />

            <motion.div
              key="sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '74%',
                background: '#FFFBF5', borderRadius: '22px 22px 0 0',
                zIndex: 310, display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: '11px',
                borderBottom: '1px solid rgba(0,0,0,0.055)', flexShrink: 0,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 11,
                  background: 'linear-gradient(135deg, #7A0F46, #5C0B35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Sparkles size={15} color="#FFFFFF" />
                </div>
                <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
                  <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 600, color: '#2C2C2C' }}>
                    Wedding Agent
                  </span>
                  <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(44,44,44,0.55)' }}>
                    Gets smarter with every conversation
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.05)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <ChevronDown size={16} color="rgba(44,44,44,0.62)" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }} className="no-scrollbar">
                {messages.length === 0 && loading ? (
                  // Initial loading state
                  <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 0' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.10)' }}>
                      <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(44,44,44,0.55)', fontStyle: 'italic' }}>
                        Checking your wedding... 🔍
                      </span>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col gap-3">
                    <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(44,44,44,0.5)', margin: '4px 0 8px' }}>
                      {greeting}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_CHIPS.map(chip => (
                        <button
                          key={chip.label}
                          onClick={() => sendMessage(chip.query)}
                          className="font-work-sans"
                          style={{
                            fontSize: '11px', fontWeight: 400, color: '#7A0F46',
                            background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)',
                            borderRadius: '99px', padding: '6px 13px', cursor: 'pointer',
                          }}
                        >
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
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #2C2C2C, #2D2318)' : 'rgba(122,15,70,0.06)',
                          border: msg.role === 'agent' ? '1px solid rgba(122,15,70,0.10)' : 'none',
                        }}>
                          <p className="font-work-sans" style={{
                            fontSize: '13px', fontWeight: 300,
                            color: msg.role === 'user' ? '#FFFFFF' : '#2C2C2C',
                            margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line',
                          }}>
                            {msg.text}
                          </p>
                        </div>

                        {/* Action tiles */}
                        {msg.role === 'agent' && msg.actions?.length > 0 && (
                          <div style={{
                            width: '100%', maxWidth: '82%',
                            border: '1px solid rgba(0,0,0,0.07)', borderRadius: '14px',
                            overflow: 'hidden', background: '#FFFBF5',
                            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                          }}>
                            {msg.actions.slice(0, 4).map((action, idx) => (
                              <div key={action.label}>
                                <button
                                  onClick={() => handleAction(action)}
                                  className="font-work-sans w-full flex items-center justify-between"
                                  style={{ padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.04)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#2C2C2C' }}>{action.label}</span>
                                  <ArrowRight size={12} color="rgba(44,44,44,0.3)" />
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
                        <div style={{
                          padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
                          background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.10)',
                        }}>
                          <div className="flex gap-1.5 items-center">
                            {[0, 1, 2].map(d => (
                              <motion.div
                                key={d}
                                style={{ width: 5, height: 5, borderRadius: '50%', background: '#7A0F46' }}
                                animate={{ opacity: [0.25, 1, 0.25] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mutation confirmation card */}
                    {!loading && pendingCommand && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.25 }}
                        style={{
                          border: '1px solid rgba(122,15,70,0.22)', borderRadius: 14,
                          overflow: 'hidden', background: 'rgba(122,15,70,0.04)',
                          boxShadow: '0 1px 6px rgba(122,15,70,0.08)', marginTop: 6,
                        }}
                      >
                        <div style={{ padding: '9px 14px 8px', borderBottom: '1px solid rgba(122,15,70,0.12)' }}>
                          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46' }}>
                            Apply this change?
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 0 }}>
                          <button
                            onClick={() => executeCommand(pendingCommand)}
                            className="font-work-sans flex-1"
                            style={{
                              padding: '11px 14px', background: 'none', border: 'none',
                              borderRight: '1px solid rgba(122,15,70,0.12)',
                              cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#7A0F46',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            Yes, apply ✓
                          </button>
                          <button
                            onClick={() => {
                              setPendingCommand(null)
                              setMessages(m => [...m, { role: 'agent', text: 'No changes made.', actions: [] }])
                            }}
                            className="font-work-sans flex-1"
                            style={{
                              padding: '11px 14px', background: 'none', border: 'none',
                              cursor: 'pointer', fontSize: '12px', fontWeight: 400, color: 'rgba(44,44,44,0.5)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation actions panel (from last message) */}
                    {!loading && !pendingCommand && pendingActions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.28 }}
                        style={{
                          border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14,
                          overflow: 'hidden', background: '#FFFBF5',
                          boxShadow: '0 1px 6px rgba(0,0,0,0.04)', marginTop: 6,
                        }}
                      >
                        <div style={{ padding: '9px 14px 8px', borderBottom: '1px solid rgba(0,0,0,0.055)', background: 'rgba(122,15,70,0.025)' }}>
                          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(44,44,44,0.62)', fontStyle: 'italic' }}>
                            What would you like to do?
                          </span>
                        </div>
                        {pendingActions.map((action, i) => (
                          <div key={action.label}>
                            <button
                              onClick={() => handleAction(action)}
                              className="font-work-sans w-full flex items-center gap-2.5"
                              style={{ padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.04)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}>
                                <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#7A0F46' }}>{i + 1}</span>
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: 500, color: '#2C2C2C', flex: 1, lineHeight: 1.35 }}>{action.label}</span>
                              <ArrowRight size={11} color="rgba(44,44,44,0.25)" />
                            </button>
                            {i < pendingActions.length - 1 && (
                              <div style={{ height: '1px', background: 'rgba(0,0,0,0.055)', margin: '0 14px' }} />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Status bar + Input area */}
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.055)', flexShrink: 0 }}>
                {/* Status bar: listening / speaking */}
                <AnimatePresence>
                  {(listening || isSpeaking) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 0' }}
                    >
                      <div className="flex items-center gap-1.5">
                        {listening && (
                          <>
                            <motion.div
                              style={{ width: 6, height: 6, borderRadius: '50%', background: '#7A0F46' }}
                              animate={{ opacity: [1, 0.2, 1] }}
                              transition={{ duration: 0.7, repeat: Infinity }}
                            />
                            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(44,44,44,0.58)' }}>
                              Listening · auto-sends on pause
                            </span>
                          </>
                        )}
                        {isSpeaking && !listening && (
                          <>
                            <motion.div
                              style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D6025' }}
                              animate={{ opacity: [1, 0.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(44,44,44,0.58)' }}>
                              Speaking — tap mic to interrupt
                            </span>
                          </>
                        )}
                      </div>
                      {/* Language badge */}
                      {listening && lang !== 'en' && (
                        <span className="font-work-sans" style={{
                          fontSize: '9px', fontWeight: 600, color: '#7A0F46',
                          background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.20)',
                          borderRadius: 99, padding: '2px 7px',
                        }}>
                          {LANG_LABELS[lang]} detected
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input row */}
                <div style={{ padding: '8px 12px 4px', display: 'flex', gap: '7px', alignItems: 'center' }}>
                  <div
                    className="glass-input flex-1 flex items-center"
                    style={{
                      padding: '9px 13px', borderRadius: '13px',
                      border: listening ? '1px solid rgba(122,15,70,0.28)' : undefined,
                      background: listening ? 'rgba(122,15,70,0.03)' : undefined,
                    }}
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder={listening ? 'Listening — speak in any language…' : 'Ask anything…'}
                      style={{
                        fontSize: '13px', fontWeight: 300, width: '100%',
                        background: 'transparent', border: 'none', outline: 'none',
                        color: '#2C2C2C', fontFamily: 'Inter, sans-serif',
                        '--placeholder-color': 'rgba(26,20,16,0.30)',
                      }}
                    />
                    {listening && (
                      <motion.div
                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#7A0F46', flexShrink: 0, marginLeft: '6px' }}
                        animate={{ opacity: [1, 0.25, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Waveform / Stop button */}
                  <VoiceButton size={40} listening={listening} speaking={isSpeaking} onClick={toggleMic} />

                  {/* Send */}
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: input.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.05)',
                      border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.18s ease',
                    }}
                  >
                    <Send size={14} color={input.trim() ? '#FFFFFF' : 'rgba(44,44,44,0.2)'} />
                  </button>
                </div>

                {/* Footer disclaimer */}
                <p className="font-work-sans text-center" style={{
                  fontSize: '12px', fontWeight: 300, color: 'rgba(44,44,44,0.52)',
                  padding: '0 16px 16px', lineHeight: 1.4,
                }}>
                  Agent can make mistakes — double-check important responses or actions
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
