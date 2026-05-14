import { useState, useRef, useEffect, useCallback } from 'react'
import { preloadSVG, injectIllustrationSVG } from '../utils/svgPreloader'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, Calendar, User, Mail, Plus, X, Check, ArrowRight, Paperclip } from 'lucide-react'
import { VIBES } from '../data/vibesData'
import { ThemeProvider, createTheme, TextField, InputAdornment, OutlinedInput } from '@mui/material'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Vibe', 'Basics', 'Details', 'Ready']

const DATE_CHIPS = ['This year', 'Next year', 'Not sure yet']

// ─── LLM integration ──────────────────────────────────────────────────────────

async function callLLM({ vibe, weddingData, userText }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_KEY not set')

  const context = [
    vibe ? `Wedding vibe selected: ${vibe.name} — ${vibe.desc}` : '',
    weddingData.bride  ? `Names: ${weddingData.bride} & ${weddingData.partner}` : '',
    weddingData.date   ? `Date hint: ${weddingData.date}` : '',
    weddingData.location ? `Location hint: ${weddingData.location}` : '',
    `User's freeform description: "${userText}"`,
  ].filter(Boolean).join('\n')

  const systemPrompt = `You are Mubarak, a warm AI wedding planning specialist for Indian weddings. Extract a structured wedding profile from the user's input. Respond ONLY with valid JSON — no markdown, no explanation, just the raw JSON object.`

  const userPrompt = `${context}

Extract this wedding profile JSON:
{
  "date": string or null,
  "location": string or null,
  "guestCount": number or null,
  "ceremonies": string[] (e.g. ["haldi","sangeet","pheras","reception"]),
  "theme": string (based on vibe + their words),
  "budget": string or null (e.g. "₹25 lakhs"),
  "helpers": string or null (who is helping plan),
  "tasks": [{"title": string, "category": string, "priority": "high"|"medium"|"low"}] (5-8 immediate planning tasks),
  "vendors": [{"category": string}] (vendor categories they will likely need),
  "summary": string (2-3 warm sentences from Mubarak explaining what you understood, mention specifics they shared)
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const raw = data.content?.[0]?.text || '{}'
  return JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim())
}

function getFallbackProfile(vibe, weddingData, userText) {
  const firstName = weddingData.bride?.trim().split(' ')[0] || ''
  // Heuristic ceremony detection from freeform text
  const known = ['haldi','mehndi','sangeet','baraat','pheras','reception']
  const detectedCeremonies = known.filter(c => new RegExp(c, 'i').test(userText))
  // Guest count detection
  const guestMatch = userText.match(/\b(\d{2,4})\s*(guests?|people|attend)/i)
  const guestCount = guestMatch ? parseInt(guestMatch[1]) : null
  return {
    date:       weddingData.date || null,
    location:   weddingData.location || null,
    guestCount,
    ceremonies: detectedCeremonies,
    theme:      vibe?.name || 'Traditional Indian',
    budget:     null,
    helpers:    null,
    tasks: [
      { title: 'Set your wedding date', category: 'Planning', priority: 'high' },
      { title: 'Finalize venue', category: 'Venue', priority: 'high' },
      { title: 'Create guest list', category: 'Guests', priority: 'high' },
      { title: 'Set wedding budget', category: 'Finance', priority: 'high' },
      { title: 'Book photographer', category: 'Vendors', priority: 'medium' },
    ],
    vendors: [
      { category: 'Photographer' }, { category: 'Caterer' }, { category: 'Decorator' },
      { category: 'Florist' }, { category: 'DJ' },
    ],
    summary: `Welcome${firstName ? `, ${firstName}` : ''}! I've set up your ${vibe?.name || 'wedding'} workspace with a starter task list and vendor tracker. Your planning journey starts now — I'm here whenever you need me.`,
  }
}

// ─── Animation config ──────────────────────────────────────────────────────────

const springGentle = { type: 'spring', stiffness: 280, damping: 28 }

const slideVariants = {
  enter: dir => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0, transition: springGentle },
  exit: dir => ({ opacity: 0, x: dir > 0 ? -48 : 48, transition: { ...springGentle, stiffness: 350 } }),
}

// ─── Step dots nav ────────────────────────────────────────────────────────────

function StepDots({ current, onGoToStep }) {
  // 3 dots for the 3 user-facing steps (0=Basics, 1=Vibe, 2=Freeform)
  // On the Ready step (current=3) all dots are filled
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {[0, 1, 2].map(i => {
        const isActive    = current === i
        const isCompleted = current > i
        return (
          <motion.button
            key={i}
            onClick={() => onGoToStep(i)}
            whileTap={{ scale: 0.85 }}
            style={{
              border: 'none', cursor: 'pointer', padding: 0,
              background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{
                width:      isActive ? 22 : 8,
                height:     8,
                borderRadius: 99,
                background: isActive
                  ? '#7A0F46'
                  : isCompleted
                  ? 'rgba(122,15,70,0.45)'
                  : 'rgba(0,0,0,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── 5-bar waveform icon (matches AgentBar exactly) ──────────────────────────

function WaveformIcon({ size = 16, color = '#7A0F46', animated = false }) {
  const heights = [3, 5, 7, 5, 3]
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {heights.map((h, i) => (
        <motion.rect
          key={i}
          x={2 + i * 3.8}
          y={(20 - h) / 2}
          width={2.4}
          height={h}
          rx={1.2}
          fill={color}
          animate={animated
            ? { height: [h, h * 2.2, h], y: [(20 - h) / 2, (20 - h * 2.2) / 2, (20 - h) / 2] }
            : { height: h, y: (20 - h) / 2 }
          }
          transition={animated
            ? { duration: 0.55, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }
            : { duration: 0.2 }
          }
        />
      ))}
    </svg>
  )
}

// ─── useSpeech hook ────────────────────────────────────────────────────────────

function useSpeech() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isFinal, setIsFinal] = useState(false)
  const recRef = useRef(null)

  // Grab the SR constructor once (works in Chrome/Edge/Safari via webkit prefix)
  const getSR = () =>
    (typeof window !== 'undefined') &&
    (window.SpeechRecognition || window.webkitSpeechRecognition || null)

  const startRec = useCallback((lang) => {
    const SR = getSR()
    if (!SR) return false
    try { recRef.current?.abort() } catch (_) {}
    const rec = new SR()
    // hi-IN handles Devanagari Hindi; en-IN handles English + romanised Hinglish.
    // We pass whichever lang was requested; caller can try the other on failure.
    rec.continuous = false
    rec.interimResults = true
    rec.lang = lang
    rec.onresult = (e) => {
      const combined = Array.from(e.results).map(r => r[0].transcript).join('')
      const final = e.results[e.results.length - 1].isFinal
      setTranscript(combined)
      if (final) { setIsFinal(true); setListening(false) }
    }
    rec.onerror = (err) => {
      // If Hindi recognition fails with language-not-supported, retry in en-IN
      if (lang === 'hi-IN' && (err.error === 'language-not-supported' || err.error === 'network')) {
        startRec('en-IN')
      } else {
        setListening(false)
      }
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    try {
      rec.start()
      return true
    } catch (_) { return false }
  }, [])

  const toggle = useCallback(() => {
    if (listening) {
      try { recRef.current?.stop() } catch (_) {}
      setListening(false)
      return
    }
    setTranscript('')
    setIsFinal(false)
    // Try hi-IN first (supports Devanagari + often English in Indian locale).
    // Falls back to en-IN inside onError if not supported.
    const started = startRec('hi-IN')
    if (started) setListening(true)
  }, [listening, startRec])

  useEffect(() => () => { try { recRef.current?.abort() } catch (_) {} }, [])

  const resetFinal = () => setIsFinal(false)

  // Always show button as active — if SR isn't available, toggle is a silent no-op
  return { listening, toggle, transcript, isFinal, resetFinal, supported: true }
}

// ─── VoiceTextInput (shared input row in chat) ─────────────────────────────────

function VoiceTextInput({ value, onChange, onSubmit, onKeyDown, placeholder, voice, sticky, inputRef: externalRef, onFile }) {
  const localRef = useRef(null)
  const ref = externalRef || localRef
  const fileInputRef = useRef(null)
  const [focused, setFocused] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onFile) onFile(file)
    e.target.value = ''
  }

  return (
    <div style={sticky ? {
      position: 'sticky', bottom: 0,
      background: 'linear-gradient(to bottom, transparent, #FFFBF5 28%)',
      paddingTop: 18, paddingBottom: 16, zIndex: 5,
    } : {}}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <OutlinedInput
        inputRef={ref}
        fullWidth
        placeholder={voice.listening ? 'Listening…' : placeholder}
        value={voice.listening ? voice.transcript : value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        endAdornment={
          <InputAdornment position="end" style={{ gap: 4 }}>
            {/* File attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 30, height: 30, borderRadius: '9px',
                background: 'rgba(122,15,70,0.07)',
                border: '1px solid rgba(122,15,70,0.20)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.18s ease',
              }}
            >
              <Paperclip size={14} color="#7A0F46" />
            </button>
            {/* Voice button */}
            <button
              type="button"
              onClick={voice.toggle}
              style={{
                width: 30, height: 30, borderRadius: '9px',
                background: voice.listening ? 'rgba(122,15,70,0.12)' : 'rgba(122,15,70,0.07)',
                border: voice.listening ? '1px solid rgba(122,15,70,0.35)' : '1px solid rgba(122,15,70,0.20)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.18s ease',
              }}
            >
              <WaveformIcon animated={voice.listening} color="#7A0F46" size={16} />
            </button>
            {/* Send button */}
            <button
              type="button"
              onClick={onSubmit}
              style={{
                width: 30, height: 30, borderRadius: '9px',
                background: value.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.05)',
                border: 'none', cursor: value.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.18s ease',
              }}
            >
              <ArrowRight size={12} color={value.trim() ? '#FFFFFF' : 'rgba(44,44,44,0.2)'} />
            </button>
          </InputAdornment>
        }
        sx={{
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: 400,
          backgroundColor: '#FFFBF5',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: focused ? 'rgba(122,15,70,0.40)' : 'rgba(0,0,0,0.14)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.40)',
            borderWidth: '1px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(122,15,70,0.08)',
          },
          '& input': {
            fontSize: '13px',
            fontWeight: 400,
            padding: '10px 14px',
            fontFamily: 'Inter, sans-serif',
            color: '#1A1410',
            '&::placeholder': { color: 'rgba(26,20,16,0.30)', opacity: 1 },
          },
          '& .MuiInputAdornment-root': {
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          },
        }}
      />
    </div>
  )
}

// ─── VibeStep ─────────────────────────────────────────────────────────────────

function VibeTile({ vibe, isSelected, onPick }) {
  return (
    <motion.button
      onClick={() => onPick(vibe)}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative', borderRadius: '14px', overflow: 'hidden',
        aspectRatio: '3/4', width: '100%',
        border: 'none',
        cursor: 'pointer', background: '#3A1A0A', padding: 0, display: 'block',
        boxShadow: isSelected ? '0 0 0 3px #7A0F46, 0 8px 24px rgba(0,0,0,0.20)' : '0 2px 10px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.2s ease, border 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${vibe.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: vibe.gradient }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 11px 12px' }}>
        <p className="font-work-sans" style={{ fontSize: '11.5px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 2px', lineHeight: 1.2 }}>
          {vibe.name}
        </p>
        <p className="font-work-sans" style={{ fontSize: '9.5px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.3 }}>
          {vibe.desc}
        </p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 22, height: 22, borderRadius: '50%',
            background: '#7A0F46', border: '2px solid #FFFBF5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#FFFBF5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

function VibeStep({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null)

  const handlePick = (vibe) => {
    setSelected(vibe.id)
    setTimeout(() => onSelect(vibe), 380)
  }

  const leftVibes  = VIBES.filter((_, i) => i % 2 === 0)
  const rightVibes = VIBES.filter((_, i) => i % 2 !== 0)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFBF5' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '12px 20px 10px', textAlign: 'center' }}>
        <h2 className="font-cormorant" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: 0, letterSpacing: '-0.02em' }}>
          My wedding vibe
        </h2>
      </div>

      {/* Two-column masonry scroll */}
      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 32px' }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leftVibes.map(vibe => (
              <VibeTile key={vibe.id} vibe={vibe} isSelected={selected === vibe.id} onPick={handlePick} />
            ))}
          </div>
          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rightVibes.map(vibe => (
              <VibeTile key={vibe.id} vibe={vibe} isSelected={selected === vibe.id} onPick={handlePick} />
            ))}
          </div>
        </div>

        {/* Something else — skip */}
        <button
          onClick={onSkip}
          className="font-work-sans"
          style={{
            width: '100%', marginTop: '16px',
            background: 'none', border: '1px dashed rgba(26,20,16,0.18)',
            borderRadius: '14px', padding: '14px',
            fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.58)',
            cursor: 'pointer',
          }}
        >
          Something else →
        </button>
      </div>
    </div>
  )
}

// ─── FreeformStep ─────────────────────────────────────────────────────────────

function FreeformStep({ weddingData, vibe, onComplete, onBack, setAgentResult, onStartBuilding }) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const voice = useSpeech()

  const firstName = weddingData.bride?.trim().split(' ')[0] || ''

  // Voice → textarea
  useEffect(() => {
    if (voice.isFinal && voice.transcript.trim()) {
      setText(t => (t + ' ' + voice.transcript).trim())
      voice.resetFinal()
    }
  }, [voice.isFinal]) // eslint-disable-line

  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)
    onStartBuilding?.()   // show building screen immediately

    // Run LLM + a minimum 2.5s display time in parallel so the
    // BuildingScreen always gets at least one full render cycle
    const minDisplay = new Promise(resolve => setTimeout(resolve, 2500))
    let profile
    try {
      profile = await callLLM({ vibe, weddingData, userText: text || '(no details provided)' })
    } catch (err) {
      console.warn('LLM call failed, using fallback:', err)
      setError('We had trouble reaching our servers — we set up your workspace with what we have. You can refine it any time.')
      profile = getFallbackProfile(vibe, weddingData, text)
    }
    await minDisplay   // wait for the minimum display time regardless
    setAgentResult(r => ({ ...r, ...profile, vibe }))
    setIsLoading(false)
    onComplete(profile)
  }

  const handleSkip = () => {
    onStartBuilding?.()
    const profile = getFallbackProfile(vibe, weddingData, '')
    setAgentResult(r => ({ ...r, ...profile, vibe }))
    // Brief pause so the building screen has time to appear
    setTimeout(() => onComplete(profile), 1800)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFBF5' }}>

      {/* Floating hero tile — rounded top corners only, bottom connects to textarea card */}
      <div style={{
        flexShrink: 0, position: 'relative',
        margin: '16px 16px 0',
        borderRadius: '16px 16px 0 0', overflow: 'hidden',
        height: '260px',
        background: vibe ? '#1A1410' : '#3A1A0A',
      }}>
        {/* Background image */}
        {vibe && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${vibe.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
        )}
        {/* Gradient overlay — darker at bottom for legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: vibe
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.80) 100%)'
            : 'linear-gradient(to bottom, rgba(26,20,16,0.4) 0%, rgba(26,20,16,0.82) 100%)',
        }} />

        {/* Text content — bottom of tile */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 22px' }}>
          {vibe && (
            <p className="font-work-sans" style={{
              fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.06em', margin: '0 0 6px', textTransform: 'uppercase',
            }}>
              {vibe.name}
            </p>
          )}
          <h2 className="font-cormorant" style={{
            fontSize: '28px', fontWeight: 600, color: '#FFFFFF',
            margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.1,
          }}>
            Tell us about your wedding
          </h2>
          <p className="font-work-sans" style={{
            fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.68)',
            margin: 0, lineHeight: 1.55,
          }}>
            Guest count, who's helping, where you are in the process — anything helps.
          </p>
        </div>
      </div>

      {/* Textarea card — squared top corners connect flush with tile above, rounded bottom */}
      <div style={{
        margin: '0 16px',
        border: '1px solid rgba(0,0,0,0.18)',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        background: '#FFFBF5',
        flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px 20px',
      }}>
        <textarea
          ref={textareaRef}
          value={voice.listening ? (text + (text ? ' ' : '') + voice.transcript) : text}
          onChange={e => setText(e.target.value)}
          placeholder={`e.g. "We're planning a 300-guest wedding next December. My mum and aunt are helping plan, no professional planner yet. We want haldi, mehndi, sangeet and a grand reception. Budget around ₹40–50 lakhs."`}
          style={{
            flex: 1, resize: 'none', border: 'none', outline: 'none',
            background: 'transparent', padding: '16px 0',
            fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif',
            color: '#1A1410', lineHeight: 1.65,
          }}
        />

      </div>

      {/* Buttons — outside the card, below it */}
      <div style={{ flexShrink: 0, padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Error banner */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="font-work-sans"
            style={{ fontSize: '12px', color: '#B03A10', background: 'rgba(196,80,30,0.06)', border: '1px solid rgba(196,80,30,0.18)', borderRadius: '10px', padding: '10px 14px', margin: '0 0 12px' }}
          >
            {error}
          </motion.p>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full font-montserrat"
          style={{
            background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)',
            color: '#FFFFFF', fontSize: '15px', fontWeight: 600,
            fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
            padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(122,15,70,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: isLoading ? 0.85 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {"Let's go →"}
        </button>

        <button
          onClick={handleSkip}
          disabled={isLoading}
          className="font-work-sans"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.54)',
            padding: '12px 0 4px', textAlign: 'center',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ─── (Removed: AgentBubble, UserBubble, OptionsCard, CeremonySelector, PinterestInput, TeamMemberForm)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Placeholder (kept for structure) ─────────────────────────────────────────

function AgentBubble({ text, isTyping }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 0' }}>
      {isTyping ? (
        <div className="flex gap-1.5 items-center" style={{ paddingTop: 4 }}>
          {[0, 1, 2].map(d => (
            <motion.div
              key={d}
              style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(26,20,16,0.3)' }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
            />
          ))}
        </div>
      ) : (
        <span className="font-work-sans" style={{ fontSize: '14px', fontWeight: 400, color: '#1A1410', lineHeight: 1.6 }}>
          {text}
        </span>
      )}
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 0' }}>
      <div style={{
        padding: '10px 16px', borderRadius: '16px 16px 4px 16px',
        background: 'rgba(122,15,70,0.09)',
        maxWidth: '85%',
      }}>
        <span className="font-work-sans" style={{ fontSize: '14px', fontWeight: 400, color: '#7A0F46', lineHeight: 1.55 }}>
          {text}
        </span>
      </div>
    </div>
  )
}

// ─── Options card (numbered list) ────────────────────────────────────────────

function OptionsCard({ question, options, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      style={{
        border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', overflow: 'hidden',
        background: '#FFFBF5', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', marginBottom: 12,
      }}
    >
      {question && (
        <div style={{ padding: '10px 16px 9px', borderBottom: '1px solid rgba(0,0,0,0.055)', background: 'rgba(122,15,70,0.025)' }}>
          <span className="font-work-sans" style={{ fontSize: '11.5px', fontWeight: 400, color: 'rgba(44,44,44,0.65)', fontStyle: 'normal' }}>
            {question}
          </span>
        </div>
      )}
      {options.map((opt, i) => (
        <div key={opt}>
          <motion.button
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.07 }}
            onClick={() => onSelect(opt)}
            className="font-work-sans w-full flex items-center gap-3"
            style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46' }}>{i + 1}</span>
            </div>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 300, color: '#2C2C2C', lineHeight: 1.4 }}>{opt}</span>
            <ArrowRight size={11} color="rgba(44,44,44,0.22)" />
          </motion.button>
          {i < options.length - 1 && (
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 16px' }} />
          )}
        </div>
      ))}
    </motion.div>
  )
}

// ─── Ceremony selector ────────────────────────────────────────────────────────

function CeremonySelector({ selected, onToggle, onSelectAll, onCustomSubmit }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customText, setCustomText] = useState('')
  const allSelected = CEREMONY_OPTIONS.every(c => selected.includes(c.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div style={{
        border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', overflow: 'hidden',
        background: '#FFFBF5', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', marginBottom: 12,
      }}>
        <div style={{ padding: '10px 16px 9px', borderBottom: '1px solid rgba(0,0,0,0.055)', background: 'rgba(122,15,70,0.025)' }}>
          <span className="font-work-sans" style={{ fontSize: '11.5px', fontWeight: 400, color: 'rgba(44,44,44,0.65)', fontStyle: 'normal' }}>
            Select all that apply
          </span>
        </div>

        {CEREMONY_OPTIONS.map((opt, i) => {
          const active = selected.includes(opt.value)
          return (
            <div key={opt.value}>
              <motion.button
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.07 }}
                onClick={() => onToggle(opt.value)}
                className="font-work-sans w-full flex items-center gap-3"
                style={{
                  padding: '12px 16px',
                  background: active ? 'rgba(122,15,70,0.04)' : 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: active ? '#7A0F46' : 'rgba(122,15,70,0.08)',
                  border: active ? '2px solid #7A0F46' : '1px solid rgba(122,15,70,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}>
                  {active
                    ? <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    : <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46' }}>{i + 1}</span>
                  }
                </div>
                <span style={{
                  flex: 1, fontSize: '13px', lineHeight: 1.4,
                  fontWeight: active ? 500 : 300,
                  color: active ? '#7A0F46' : '#2C2C2C',
                  transition: 'color 0.15s ease',
                }}>
                  {opt.label}
                </span>
                {active && <Check size={13} color="#7A0F46" />}
              </motion.button>
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 16px' }} />
            </div>
          )
        })}

        {/* Select all */}
        <motion.button
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.26 }}
          onClick={onSelectAll}
          className="font-work-sans w-full flex items-center gap-3"
          style={{
            padding: '12px 16px',
            background: allSelected ? 'rgba(122,15,70,0.04)' : 'none',
            border: 'none', cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s ease',
          }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: allSelected ? '#7A0F46' : 'rgba(122,15,70,0.08)',
            border: allSelected ? '2px solid #7A0F46' : '1px solid rgba(122,15,70,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}>
            {allSelected
              ? <Check size={10} color="#FFFFFF" strokeWidth={3} />
              : <span style={{ fontSize: '10px', fontWeight: 700, color: '#7A0F46', lineHeight: 1 }}>✦</span>
            }
          </div>
          <span style={{
            flex: 1, fontSize: '13px',
            fontWeight: allSelected ? 500 : 300,
            color: allSelected ? '#7A0F46' : '#2C2C2C',
          }}>
            Everything
          </span>
          {allSelected && <Check size={13} color="#7A0F46" />}
        </motion.button>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 16px' }} />

        {/* Add custom ceremony */}
        {showCustom ? (
          <div style={{ padding: '10px 14px' }}>
            <div className="glass-input flex items-center gap-2" style={{ padding: '9px 12px' }}>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Engagement, Nikah, Civil ceremony…"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && customText.trim() && onCustomSubmit(customText.trim())}
                style={{ flex: 1, fontSize: '12px' }}
              />
              {customText.trim() && (
                <button
                  onClick={() => onCustomSubmit(customText.trim())}
                  style={{
                    background: 'linear-gradient(135deg, #7A0F46, #5C0B35)',
                    border: 'none', borderRadius: 8, width: 26, height: 26,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <ArrowRight size={12} color="#FFFFFF" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 }}
            onClick={() => setShowCustom(true)}
            className="font-work-sans w-full flex items-center gap-3"
            style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(122,15,70,0.04)', border: '1px dashed rgba(122,15,70,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={11} color="#7A0F46" />
            </div>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 300, color: 'rgba(44,44,44,0.60)' }}>
              Add custom ceremony
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Pinterest URL input ──────────────────────────────────────────────────────

function PinterestInput({ onSubmit }) {
  const [url, setUrl] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      <div style={{
        border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', overflow: 'hidden',
        background: '#FFFBF5', marginBottom: 12,
      }}>
        <div style={{ padding: '10px 16px 9px', borderBottom: '1px solid rgba(0,0,0,0.055)', background: 'rgba(122,15,70,0.025)' }}>
          <span className="font-work-sans" style={{ fontSize: '11.5px', fontWeight: 400, color: 'rgba(44,44,44,0.65)', fontStyle: 'normal' }}>
            Paste your Pinterest board URL
          </span>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div className="glass-input flex items-center gap-2" style={{ padding: '10px 13px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(44,44,44,0.28)" style={{ flexShrink: 0 }}>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            <input
              autoFocus
              type="url"
              placeholder="https://pinterest.com/yourboard/…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSubmit(url.trim() || null)}
              style={{ flex: 1, fontSize: '12px' }}
            />
          </div>
          <button
            onClick={() => onSubmit(url.trim() || null)}
            className="w-full font-montserrat"
            style={{
              marginTop: 10, padding: '11px', borderRadius: 11, border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
              background: url.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.05)',
              color: url.trim() ? '#FFFFFF' : 'rgba(44,44,44,0.52)',
              boxShadow: url.trim() ? '0 4px 14px rgba(122,15,70,0.24)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {url.trim() ? 'Connect board →' : 'Skip for now →'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Team member form ─────────────────────────────────────────────────────────

function TeamMemberForm({ members, setMembers, onDone }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const canAdd = name.trim() && contact.trim()

  const addMember = () => {
    if (!canAdd) return
    setMembers(m => [...m, { id: Date.now(), name, contact }])
    setName('')
    setContact('')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col gap-3" style={{ padding: '16px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, marginBottom: 12 }}>
        <div className="glass-input flex items-center gap-3" style={{ padding: '11px 14px' }}>
          <User size={13} style={{ color: 'rgba(44,44,44,0.28)', flexShrink: 0 }} />
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="glass-input flex items-center gap-3" style={{ padding: '11px 14px' }}>
          <Mail size={13} style={{ color: 'rgba(44,44,44,0.28)', flexShrink: 0 }} />
          <input
            type="email"
            placeholder="Email or phone"
            value={contact}
            onChange={e => setContact(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMember()}
          />
        </div>
        <button
          onClick={addMember}
          disabled={!canAdd}
          className="inline-flex items-center justify-center gap-2 font-work-sans"
          style={{
            background: canAdd ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.04)',
            border: canAdd ? '1px solid rgba(122,15,70,0.24)' : '1px solid rgba(0,0,0,0.08)',
            color: canAdd ? '#7A0F46' : 'rgba(44,44,44,0.28)',
            fontSize: '12px', fontWeight: 500, padding: '9px', borderRadius: '10px',
            cursor: canAdd ? 'pointer' : 'default', transition: 'all 0.15s ease',
          }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      <AnimatePresence>
        {members.map(m => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
            style={{
              padding: '9px 14px', borderRadius: 12,
              background: 'rgba(45,96,37,0.05)', border: '1px solid rgba(45,96,37,0.18)', marginBottom: 8,
            }}
          >
            <div className="rounded-full flex items-center justify-center" style={{ width: 26, height: 26, background: 'rgba(45,96,37,0.10)', flexShrink: 0 }}>
              <User size={11} color="#2D6025" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#2C2C2C', margin: 0 }}>{m.name}</p>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(44,44,44,0.55)', margin: 0 }}>{m.contact}</p>
            </div>
            <button onClick={() => setMembers(ms => ms.filter(x => x.id !== m.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={12} color="rgba(44,44,44,0.28)" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={onDone}
        className="w-full font-montserrat"
        style={{
          background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)',
          color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
          fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
          padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(122,15,70,0.28)',
        }}
      >
        {members.length > 0 ? `All set — ${members.length} added →` : 'Skip for now →'}
      </button>
    </motion.div>
  )
}

// ─── MUI theme scoped to the Basics form ──────────────────────────────────────

const formTheme = createTheme({
  typography: { fontFamily: 'Inter, sans-serif' },
  palette:    { primary: { main: '#7A0F46' } },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(26,20,16,0.55)',
          '&.Mui-focused': { color: '#7A0F46' },
        },
        sizeSmall: { fontSize: '13px' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFBF5',
          borderRadius: '14px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease',
          paddingLeft: '10px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.40)',
            borderWidth: '1px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(122,15,70,0.08)',
          },
        },
        notchedOutline: { borderColor: 'rgba(0,0,0,0.10)' },
        input: {
          padding: '10px 14px 10px 4px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#1A1410',
          '&::placeholder': { color: 'rgba(26,20,16,0.30)', opacity: 1 },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionStart: { marginRight: '4px' },
      },
    },
  },
})

// ─── Step 0: Basics ───────────────────────────────────────────────────────────

// ISO "YYYY-MM-DD" ↔ display "MM/DD/YY"
const toISO = (mmddyy) => {
  if (!mmddyy) return ''
  const [mm, dd, yy] = mmddyy.split('/')
  if (!mm || !dd || !yy) return ''
  return `20${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}
const toDisplay = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y.slice(2)}`
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS  = ['S','M','T','W','T','F','S']

function MiniCalendar({ selectedISO, onChange }) {
  const today = new Date()
  const initDate = selectedISO ? new Date(selectedISO + 'T00:00:00') : today
  const [view, setView] = useState({ y: initDate.getFullYear(), m: initDate.getMonth() })

  const prevMonth = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })

  const firstDow   = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const prevDays   = new Date(view.y, view.m, 0).getDate()

  const cells = []
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ d: prevDays - i, cur: false })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ d, cur: true })
  while (cells.length % 7 !== 0)
    cells.push({ d: cells.length - firstDow - daysInMonth + 1, cur: false })

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
        background: '#FFFBF5',
        border: '1px solid rgba(122,15,70,0.28)', borderTop: 'none',
        borderRadius: '0 0 14px 14px',
        padding: '8px 8px 10px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.07)',
      }}
    >
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'rgba(26,20,16,0.4)', fontSize: 15, lineHeight: 1 }}>‹</button>
        <span className="font-work-sans" style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#1A1410' }}>
          {MONTH_NAMES[view.m]} {view.y}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'rgba(26,20,16,0.4)', fontSize: 15, lineHeight: 1 }}>›</button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
        {DAY_LABELS.map((l, i) => (
          <div key={i} className="font-work-sans" style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.3)', padding: '2px 0' }}>{l}</div>
        ))}
      </div>

      {/* Date grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {cells.map(({ d, cur }, i) => {
          const iso = `${view.y}-${String(view.m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
          const isSelected = cur && iso === selectedISO
          const isToday    = cur && d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear()
          return (
            <button
              key={i}
              onClick={() => cur && onChange(iso)}
              className="font-work-sans"
              style={{
                width: '100%', height: '28px', borderRadius: '50%', border: 'none',
                fontSize: '11px', fontWeight: isSelected ? 600 : 400,
                background: isSelected ? '#7A0F46' : 'transparent',
                color: isSelected ? '#FFFBF5' : isToday ? '#7A0F46' : cur ? '#1A1410' : 'rgba(26,20,16,0.18)',
                cursor: cur ? 'pointer' : 'default',
                outline: isToday && !isSelected ? '1px solid rgba(122,15,70,0.35)' : 'none',
                outlineOffset: '-2px',
              }}
            >
              {d}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function BasicsStep({ data, setData, onNext }) {
  const [showCal, setShowCal]           = useState(false)
  const [locSuggestions, setLocSuggestions] = useState([])
  const [showLocDrop, setShowLocDrop]   = useState(false)
  const [locLoading, setLocLoading]     = useState(false)
  const calWrapRef  = useRef(null)
  const locWrapRef  = useRef(null)
  const locDebounce = useRef(null)
  const isValid = data.bride.trim() && data.partner.trim() && data.partnerEmail.trim()

  // Close calendar on outside click
  useEffect(() => {
    if (!showCal) return
    const handler = (e) => {
      if (calWrapRef.current && !calWrapRef.current.contains(e.target)) setShowCal(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showCal])

  // Close location dropdown on outside click
  useEffect(() => {
    if (!showLocDrop) return
    const handler = (e) => {
      if (locWrapRef.current && !locWrapRef.current.contains(e.target)) setShowLocDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showLocDrop])

  // Debounced location search via Nominatim
  const searchLocation = useCallback((q) => {
    clearTimeout(locDebounce.current)
    if (q.trim().length < 2) {
      setLocSuggestions([])
      setShowLocDrop(false)
      setLocLoading(false)
      return
    }
    locDebounce.current = setTimeout(async () => {
      setLocLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const json = await res.json()
        const seen = new Set()
        const suggestions = []
        for (const item of json) {
          const a = item.address || {}
          const city    = a.city || a.town || a.village || a.municipality || a.county || ''
          const state   = a.state || a.region || ''
          const country = a.country || ''
          const label = [city, state, country].filter(Boolean).join(', ')
          if (label && !seen.has(label)) {
            seen.add(label)
            suggestions.push(label)
          }
          if (suggestions.length >= 5) break
        }
        setLocSuggestions(suggestions)
        setShowLocDrop(suggestions.length > 0)
      } catch {
        setLocSuggestions([])
        setShowLocDrop(false)
      } finally {
        setLocLoading(false)
      }
    }, 320)
  }, [])

  const handleDateChip = (chip) => {
    setData(d => ({ ...d, date: chip }))
    setShowCal(false)
  }

  const handleLocChange = (val) => {
    setData(d => ({ ...d, location: val }))
    searchLocation(val)
  }

  const pickLocation = (label) => {
    setData(d => ({ ...d, location: label }))
    setLocSuggestions([])
    setShowLocDrop(false)
  }

  return (
    <div className="overflow-y-auto no-scrollbar h-full" style={{ padding: '16px 20px 32px', display: 'flex', alignItems: 'center', minHeight: '100%' }}>
      <div className="flex flex-col gap-5" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <img src="/ring-icon.svg" width={50} height={50} alt="" style={{ display: 'block' }} />
          </div>
          <h2 className="font-cormorant" style={{ fontSize: '30px', color: '#2C2C2C', fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
            Tell us about your wedding
          </h2>
        </div>

        <ThemeProvider theme={formTheme}>
        <div className="flex flex-col gap-7">

          {/* Your name */}
          <TextField
            fullWidth size="small"
            label={<>Your name <span style={{ color: '#7A0F46' }}>*</span></>}
            placeholder="e.g. Priya"
            value={data.bride}
            onChange={e => setData(d => ({ ...d, bride: e.target.value }))}
            slotProps={{ input: { startAdornment: (
              <InputAdornment position="start">
                <Heart size={14} style={{ color: data.bride ? '#7A0F46' : 'rgba(44,44,44,0.28)' }} />
              </InputAdornment>
            )}}}
          />

          {/* Partner's name */}
          <TextField
            fullWidth size="small"
            label={<>Partner's name <span style={{ color: '#7A0F46' }}>*</span></>}
            placeholder="e.g. Arjun"
            value={data.partner}
            onChange={e => setData(d => ({ ...d, partner: e.target.value }))}
            slotProps={{ input: { startAdornment: (
              <InputAdornment position="start">
                <Heart size={14} style={{ color: data.partner ? '#7A0F46' : 'rgba(44,44,44,0.28)' }} />
              </InputAdornment>
            )}}}
          />

          {/* Partner's email */}
          <TextField
            fullWidth size="small"
            type="email"
            label={<>Partner's email <span style={{ color: '#7A0F46' }}>*</span></>}
            placeholder="e.g. arjun@email.com"
            value={data.partnerEmail}
            onChange={e => setData(d => ({ ...d, partnerEmail: e.target.value }))}
            slotProps={{ input: { startAdornment: (
              <InputAdornment position="start">
                <Mail size={14} style={{ color: data.partnerEmail ? '#7A0F46' : 'rgba(44,44,44,0.28)' }} />
              </InputAdornment>
            )}}}
          />

          {/* Wedding date */}
          <div ref={calWrapRef} style={{ width: '100%' }}>
            {/* TextField anchors the calendar flush below */}
            <div style={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth size="small"
                label="Wedding date"
                placeholder="MM/DD/YY"
                value={data.date && !DATE_CHIPS.includes(data.date) ? data.date : ''}
                onClick={() => setShowCal(v => !v)}
                slotProps={{ input: {
                  readOnly: true,
                  style: { cursor: 'pointer' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={14} style={{ color: showCal || (data.date && !DATE_CHIPS.includes(data.date)) ? '#7A0F46' : 'rgba(44,44,44,0.28)' }} />
                    </InputAdornment>
                  ),
                }}}
                sx={showCal ? {
                  '& .MuiOutlinedInput-root': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: 'none',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(122,15,70,0.28)' },
                  },
                } : {}}
              />
              <AnimatePresence>
                {showCal && (
                  <MiniCalendar
                    selectedISO={toISO(data.date && !DATE_CHIPS.includes(data.date) ? data.date : '')}
                    onChange={iso => {
                      setData(d => ({ ...d, date: toDisplay(iso) }))
                      setShowCal(false)
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Fuzzy date chips */}
            <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
              {DATE_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleDateChip(chip)}
                  className="font-work-sans"
                  style={{
                    fontSize: '11px', fontWeight: 400, padding: '5px 12px', borderRadius: '99px',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    background: data.date === chip ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.04)',
                    color: data.date === chip ? '#7A0F46' : 'rgba(44,44,44,0.5)',
                    border: data.date === chip ? '1px solid rgba(122,15,70,0.28)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Location with autocomplete */}
          <div ref={locWrapRef} style={{ width: '100%' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth size="small"
                label="Location"
                placeholder="City or venue"
                value={data.location}
                onChange={e => handleLocChange(e.target.value)}
                onFocus={() => { if (locSuggestions.length) setShowLocDrop(true) }}
                slotProps={{ input: {
                  autoComplete: 'off',
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={15} style={{ color: data.location ? '#7A0F46' : 'rgba(44,44,44,0.28)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: locLoading ? (
                    <InputAdornment position="end">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 12, height: 12, border: '1.5px solid rgba(122,15,70,0.2)', borderTopColor: '#7A0F46', borderRadius: '50%' }}
                      />
                    </InputAdornment>
                  ) : null,
                }}}
                sx={showLocDrop ? {
                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    boxShadow: 'none',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(122,15,70,0.28)' },
                  },
                } : {}}
              />

              {/* Suggestions dropdown — opens upward */}
              <AnimatePresence>
                {showLocDrop && locSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.13, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 200,
                      background: '#FFFBF5',
                      border: '1px solid rgba(122,15,70,0.28)', borderBottom: 'none',
                      borderRadius: '14px 14px 0 0',
                      boxShadow: '0 -6px 20px rgba(0,0,0,0.07)',
                      overflow: 'hidden',
                    }}
                  >
                    {locSuggestions.map((label, i) => (
                      <button
                        key={i}
                        onMouseDown={e => { e.preventDefault(); pickLocation(label) }}
                        className="font-work-sans"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '10px 16px', border: 'none',
                          background: 'transparent', cursor: 'pointer', textAlign: 'left',
                          borderBottom: i < locSuggestions.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,15,70,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={12} style={{ color: 'rgba(122,15,70,0.45)', flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: '13px', color: '#1A1410', lineHeight: 1.3 }}>{label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </ThemeProvider>

        <button
          onClick={isValid ? onNext : undefined}
          disabled={!isValid}
          className="w-full font-montserrat"
          style={{
            background: isValid ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(122,15,70,0.18)',
            color: isValid ? '#FFFFFF' : 'rgba(122,15,70,0.45)',
            fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.01em',
            padding: '15px', borderRadius: '14px', border: 'none',
            cursor: isValid ? 'pointer' : 'not-allowed',
            boxShadow: isValid ? '0 6px 24px rgba(122,15,70,0.28)' : 'none',
            transition: 'all 0.2s ease', pointerEvents: !isValid ? 'none' : undefined,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Ready ────────────────────────────────────────────────────────────

function ReadyStep({ wedding, agentResult, vibe, onEnter, onCustomize }) {
  const ar = agentResult || {}

  // Resolve final values: LLM result takes priority over BasicsStep fields
  const finalDate     = ar.date     || (wedding.date && !['This year','Next year','Not sure yet'].includes(wedding.date) ? wedding.date : null)
  const finalLocation = ar.location || wedding.location || null
  const ceremonies    = Array.isArray(ar.ceremonies) ? ar.ceremonies : []
  const theme         = ar.theme || vibe?.name || null
  const budget        = ar.budget || null
  const helpers       = ar.helpers || null
  const summary       = ar.summary || null

  const handleEnter = () => {
    try {
      localStorage.setItem('sm_profile', JSON.stringify({
        bride:        wedding.bride,
        partner:      wedding.partner,
        partnerEmail: wedding.partnerEmail,
        date:         finalDate,
        location:     finalLocation,
        theme,
        budget,
        ceremonies,
        helpers,
        vibe:         vibe?.id || null,
        guestCount:   ar.guestCount || null,
        tasks:        ar.tasks || [],
        vendors:      ar.vendors || [],
        summary,
      }))
    } catch (_) {}
    onEnter()
  }

  const firstName = wedding.bride?.trim().split(' ')[0] || ''
  const welcomeText = summary ||
    `Welcome${firstName ? `, ${firstName}` : ''}! I've set up your ${vibe?.name || 'wedding'} workspace with a starter task list and vendor tracker. Your planning journey starts now — I'm here whenever you need me.`

  return (
    <div className="h-full" style={{ display: 'flex', flexDirection: 'column', background: '#FFFBF5' }}>

      {/* Same floating vibe tile as FreeformStep */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          flexShrink: 0, position: 'relative',
          margin: '16px 16px 0',
          borderRadius: '16px 16px 0 0', overflow: 'hidden',
          height: '260px',
          background: vibe ? '#1A1410' : '#3A1A0A',
        }}
      >
        {vibe && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${vibe.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: vibe
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.82) 100%)'
            : 'linear-gradient(to bottom, rgba(26,20,16,0.4) 0%, rgba(26,20,16,0.82) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 22px' }}>
          {vibe && (
            <p className="font-work-sans" style={{
              fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.06em', margin: '0 0 6px', textTransform: 'uppercase',
            }}>
              {vibe.name}
            </p>
          )}
          <h2 className="font-cormorant" style={{
            fontSize: '28px', fontWeight: 600, color: '#FFFFFF',
            margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.1,
          }}>
            {wedding.bride && wedding.partner ? `${wedding.bride} & ${wedding.partner}` : 'Your wedding'}
          </h2>
          <p className="font-work-sans" style={{
            fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.60)',
            margin: 0, letterSpacing: '0.01em',
          }}>
            Your workspace is ready ✦
          </p>
        </div>
      </motion.div>

      {/* Card connected to tile — welcome message + checklist + CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        style={{
          margin: '0 16px',
          border: '1px solid rgba(0,0,0,0.18)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          background: '#FFFBF5',
          flex: 1, display: 'flex', flexDirection: 'column',
          overflowY: 'auto', padding: '18px 18px 0',
        }}
        className="no-scrollbar"
      >
        {/* Welcome message */}
        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', lineHeight: 1.65, margin: '0 0 18px' }}>
          {welcomeText}
        </p>

        {/* Workspace checklist */}
        <div style={{ marginBottom: 18 }}>
          {[
            ceremonies.length > 0 ? `${ceremonies.length} ceremony timeline${ceremonies.length > 1 ? 's' : ''} created` : 'Journey timeline ready',
            'Vendor tracker activated',
            'Mubarak AI assistant — always on',
            'Guest management ready',
            budget ? `Budget tracker — ${budget}` : 'Budget tracker ready',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3" style={{ marginBottom: i < 4 ? '9px' : 0 }}>
              <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: 'rgba(26,20,16,0.30)' }} />
              <span className="font-work-sans" style={{ fontSize: '12.5px', fontWeight: 400, color: 'rgba(26,20,16,0.62)' }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTAs — outside the card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        style={{ flexShrink: 0, padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        <button
          onClick={handleEnter}
          className="w-full font-montserrat"
          style={{
            background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)',
            color: '#FFFFFF', fontSize: '15px', fontWeight: 600,
            fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
            padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(122,15,70,0.32)',
          }}
        >
          Enter Shaadi Mubarak →
        </button>
      </motion.div>
    </div>
  )
}

// ─── BuildingScreen ───────────────────────────────────────────────────────────

const BUILDING_PHRASES = [
  'Setting up your road to The Day',
  'Curating your wedding journey',
  'Weaving your perfect timeline',
]

// Per-illustration wobble params reused from SplashScreen style
const BUILD_WOBBLE = [
  [-3,  3, -1.2, 3.1, 0.00], [-2,  4, -0.8, 2.7, 0.35], [-4,  2, -1.5, 3.4, 0.70],
  [-3,  3,  1.0, 2.9, 0.15], [-2,  4, -1.0, 3.6, 0.55], [-4,  2,  1.3, 2.8, 0.90],
  [-3,  3, -0.9, 3.2, 0.25], [-2,  4,  1.1, 3.0, 0.65], [-3,  3, -1.4, 3.5, 0.10],
  [-4,  2,  0.8, 2.7, 0.80], [-2,  4, -1.2, 3.3, 0.45], [-3,  3,  1.4, 2.9, 0.20],
]

function buildBuildWobbleCSS() {
  return BUILD_WOBBLE.map(([xA, xB, rot, dur, del], i) => `
    .bw-${i} {
      animation: bw${i} ${dur}s ${del}s ease-in-out infinite alternate;
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes bw${i} {
      from { transform: translateX(${xA}px) rotate(${rot * -1}deg); }
      to   { transform: translateX(${xB}px) rotate(${rot}deg); }
    }
  `).join('')
}

function BuildingScreen() {
  const [phraseIdx, setPhraseIdx] = useState(0)

  // Cycle through phrases every 2.2s
  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i + 1) % BUILDING_PHRASES.length), 2200)
    return () => clearInterval(t)
  }, [])

  // Use preloaded SVG — already fetching since module load, inject immediately
  useEffect(() => {
    preloadSVG('/building-bg.svg').then(html => {
      if (!html) return
      const container = document.getElementById('building-svg-host')
      if (!container) return
      injectIllustrationSVG(container, html, 'bw', BUILD_WOBBLE.length)
    })
  }, [])

  return (
    <motion.div
      key="building"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: '#7A0F46', overflow: 'hidden',
      }}
    >
      <style>{buildBuildWobbleCSS()}</style>

      {/* Illustration field — always visible, content appears as SVG loads */}
      <div
        id="building-svg-host"
        style={{ position: 'absolute', inset: 0, zIndex: 5 }}
      />

      {/* Magenta overlay keeps brand color strong */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(122,15,70,0.92) 0%, rgba(122,15,70,0.68) 50%, rgba(122,15,70,0.92) 100%)',
      }} />

      {/* Centered text content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: '0 32px', textAlign: 'center',
      }}>
        <motion.span
          className="font-cormorant"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          style={{ fontSize: '22px', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}
        >
          Shaadi Mubarak
        </motion.span>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 0.55, duration: 0.5, ease: 'easeOut' }}
          style={{ height: 1, background: 'rgba(255,255,255,0.45)' }}
        />

        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIdx}
            className="font-cormorant"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontSize: '26px', fontWeight: 500, fontStyle: 'italic',
              color: '#FFFFFF', margin: 0, lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            {BUILDING_PHRASES[phraseIdx]}
          </motion.p>
        </AnimatePresence>

        {/* Pulsing dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.28, ease: 'easeInOut' }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete, onOpenAgent }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [selectedVibe, setSelectedVibe] = useState(null)
  const [weddingData, setWeddingData] = useState({
    bride: '', partner: '', partnerEmail: '', date: '', location: '',
  })
  const [agentResult, setAgentResult] = useState({
    ceremonies: [], tasks: [], vendors: [], guestCount: null,
  })
  const [isBuilding, setIsBuilding] = useState(false)

  // Steps: 0=Basics, 1=Vibe, 2=Freeform, 3=Ready
  const totalSteps = STEPS.length // 4
  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, totalSteps - 1)) }
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }
  const goToStep = (target) => { setDir(target > step ? 1 : -1); setStep(target) }

  const handleVibeSelect = (vibe) => {
    setSelectedVibe(vibe)
    goNext()
  }

  const handleFreeformComplete = (profile) => {
    // Advance to ReadyStep while BuildingScreen is still covering it,
    // then fade the BuildingScreen out so ReadyStep is revealed
    setDir(1)
    setStep(s => Math.min(s + 1, totalSteps - 1))
    setTimeout(() => setIsBuilding(false), 800)
  }

  const handleCustomize = () => {
    onComplete()
    setTimeout(() => onOpenAgent?.(), 600)
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      {/* Logo */}
      <div className="flex items-center justify-center px-5 pt-5 pb-3 flex-shrink-0">
        <span className="font-cormorant" style={{ fontSize: '15px', color: '#7A0F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Shaadi Mubarak
        </span>
      </div>

      {/* Step dots — always visible, 3 user-facing steps (Ready doesn't count) */}
      <div style={{ flexShrink: 0, paddingBottom: 8 }}>
        <StepDots current={step} onGoToStep={goToStep} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ height: '100%' }}
          >
            {step === 0 && (
              <BasicsStep data={weddingData} setData={setWeddingData} onNext={goNext} />
            )}
            {step === 1 && (
              <VibeStep onSelect={handleVibeSelect} onSkip={goNext} />
            )}
            {step === 2 && (
              <FreeformStep
                weddingData={weddingData}
                vibe={selectedVibe}
                onComplete={handleFreeformComplete}
                onBack={goBack}
                setAgentResult={setAgentResult}
                onStartBuilding={() => setIsBuilding(true)}
              />
            )}
            {step === 3 && (
              <ReadyStep
                wedding={weddingData}
                agentResult={agentResult}
                vibe={selectedVibe}
                onEnter={onComplete}
                onCustomize={handleCustomize}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Building overlay — full-screen, covers logo + dots + content while LLM runs */}
      <AnimatePresence>
        {isBuilding && <BuildingScreen />}
      </AnimatePresence>
    </div>
  )
}
