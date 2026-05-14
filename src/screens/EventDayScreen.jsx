import { motion } from 'framer-motion'
import { X, CheckCircle2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ceremonies, currentUser } from '../data/mockData'
import { initialTasks, taskCategories } from '../data/tasksData'

// ── Per-ceremony theming ────────────────────────────────────────────────────
const EVENT_CONFIG = {
  'Haldi Ceremony': {
    gradient: 'linear-gradient(160deg, #F5C842 0%, #D4860A 100%)',
    overlayColor: 'rgba(180,100,0,0.45)',
    accentColor: '#B06A00',
    image: 'https://picsum.photos/seed/haldi-turmeric-yellow/800/1100',
    emoji: '🌼',
    brideMsg: "It's your Haldi day — soak in every joyful moment and let the turmeric glow! 🌟",
    groomMsg: "Today kicks off the celebrations! Stay relaxed and enjoy being pampered. 💛",
    familyMsg: "The Haldi brings the whole family together. Here's what needs your attention today:",
    cta: "Begin today's celebrations →",
  },
  'Mehndi': {
    gradient: 'linear-gradient(160deg, #6DBF7E 0%, #1B6B35 100%)',
    overlayColor: 'rgba(27,80,40,0.42)',
    accentColor: '#2D7D44',
    image: 'https://picsum.photos/seed/mehndi-henna-garden/800/1100',
    emoji: '🌿',
    brideMsg: "Your Mehndi day is here! Sit back, relax, and let your hands tell your love story. 🌸",
    groomMsg: "Today is all about celebrating her — enjoy the festivity and support the bride! 💚",
    familyMsg: "Mehndi time means beautiful chaos. Make sure these are sorted before the artist arrives:",
    cta: "Begin today's celebrations →",
  },
  'Sangeet': {
    gradient: 'linear-gradient(160deg, #7A0F46 0%, #3D0822 100%)',
    overlayColor: 'rgba(60,8,34,0.45)',
    accentColor: '#7A0F46',
    image: 'https://picsum.photos/seed/sangeet-dance-lights/800/1100',
    emoji: '🎶',
    brideMsg: "Tonight is YOUR stage — dance like everyone's watching (because they are)! ✨",
    groomMsg: "Time to show off those rehearsed moves! Tonight is pure joy and music. 🎉",
    familyMsg: "The Sangeet is almost here! A few things to check before the music starts:",
    cta: "Begin tonight's celebrations →",
  },
  'Baraat Procession': {
    gradient: 'linear-gradient(160deg, #C4501E 0%, #7A1A00 100%)',
    overlayColor: 'rgba(100,30,0,0.45)',
    accentColor: '#C4501E',
    image: 'https://picsum.photos/seed/baraat-procession-band/800/1100',
    emoji: '🐎',
    brideMsg: "He's on his way! The baraat is coming and so is your forever. Stay calm and radiant. 💖",
    groomMsg: "BARAAT TIME! Ride in with joy — this is YOUR moment. Stay hydrated and enjoy every second! 🎺",
    familyMsg: "The baraat procession starts soon. Here's what needs final confirmation:",
    cta: "Begin today's celebrations →",
  },
  'Pheras & Vows': {
    gradient: 'linear-gradient(160deg, #7A4F1A 0%, #3D2206 100%)',
    overlayColor: 'rgba(50,25,5,0.50)',
    accentColor: '#8B5E28',
    image: 'https://picsum.photos/seed/pheras-wedding-fire/800/1100',
    emoji: '🔥',
    brideMsg: "Today you take your forever vows. Breathe, smile, and be fully present in every sacred moment. 🙏",
    groomMsg: "The pheras await. Today you begin your journey as one — stay grounded and cherish every step. 🙏",
    familyMsg: "The main ceremony is today. These tasks need to be completed before the pheras begin:",
    cta: "Begin the ceremony day →",
  },
  'Reception': {
    gradient: 'linear-gradient(160deg, #1A3A6B 0%, #0A1A40 100%)',
    overlayColor: 'rgba(10,20,55,0.45)',
    accentColor: '#2D5A9E',
    image: 'https://picsum.photos/seed/reception-ballroom-night/800/1100',
    emoji: '🥂',
    brideMsg: "Tonight you celebrate as newlyweds! Enjoy every blessing, every hug, every moment. 💍",
    groomMsg: "Reception time — you're officially married! Enjoy the celebration with the ones you love. 🎊",
    familyMsg: "The reception is tonight! A few last-minute items to ensure a perfect evening:",
    cta: "Begin tonight's reception →",
  },
}

const DEFAULT_CONFIG = {
  gradient: 'linear-gradient(160deg, #7A0F46 0%, #3D0822 100%)',
  overlayColor: 'rgba(60,8,34,0.45)',
  accentColor: '#7A0F46',
  image: 'https://picsum.photos/seed/wedding-ceremony-day/800/1100',
  emoji: '💐',
  brideMsg: "Your special day is here — stay joyful and take it all in! 🌸",
  groomMsg: "Your special day is here — enjoy every moment of it! 🎉",
  familyMsg: "Today is a special day for the family. Here's what needs your attention:",
  cta: "Begin today's celebrations →",
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function getCompletionPct(tasks) {
  if (!tasks || tasks.length === 0) return 0
  return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
}

function getCategoryBreakdown(tasks) {
  const counts = {}
  tasks.forEach(t => {
    if (!t.done) {
      counts[t.category] = (counts[t.category] || 0) + 1
    }
  })
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function EventDayScreen({ onClose }) {
  const navigate = useNavigate()
  const liveEvent = ceremonies.find(c => c.status === 'live')

  if (!liveEvent) return null

  const config = EVENT_CONFIG[liveEvent.name] || DEFAULT_CONFIG
  const { role, name } = currentUser
  const isCouple = role === 'bride' || role === 'groom'
  const message = role === 'bride' ? config.brideMsg : role === 'groom' ? config.groomMsg : config.familyMsg
  const completionPct = getCompletionPct(initialTasks)
  const categoryBreakdown = getCategoryBreakdown(initialTasks)

  const handleCta = () => {
    if (!isCouple) navigate('/tasks')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative flex flex-col h-full"
      style={{ background: '#1A1410', overflow: 'hidden' }}
    >
      {/* ── Hero image area (top ~60%) ───────────────────────────── */}
      <div style={{ position: 'relative', height: '62%', flexShrink: 0 }}>

        {/* Background image */}
        <img
          src={config.image}
          alt={liveEvent.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: config.gradient,
          opacity: 0.72,
        }} />

        {/* Dark vignette for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.65) 100%)',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 52, right: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={16} color="#FFFFFF" strokeWidth={2} />
        </button>

        {/* Event name + time overlay at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 22px 22px',
          }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '10px', fontFamily: 'Inter', fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(6px)',
            padding: '3px 10px', borderRadius: '99px',
            marginBottom: '8px',
          }}>
            {config.emoji} Today · {liveEvent.time}
          </span>
          <h1
            className="font-cormorant italic"
            style={{
              fontSize: '40px', fontWeight: 500,
              color: '#FFFFFF', margin: 0, lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)',
            }}
          >
            {liveEvent.name}
          </h1>
        </motion.div>
      </div>

      {/* ── Content area (bottom ~40%) ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          flex: 1,
          background: '#FFFBF5',
          borderRadius: '22px 22px 0 0',
          padding: '24px 22px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
        }}
      >
        {/* Greeting */}
        <div>
          <p
            className="font-work-sans"
            style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}
          >
            {isCouple ? `Happy ${liveEvent.name}, ${name}` : `Hello, ${name}`}
          </p>
          <p
            className="font-work-sans"
            style={{ fontSize: '14px', fontWeight: 400, color: '#1A1410', lineHeight: 1.55, margin: 0 }}
          >
            {message}
          </p>
        </div>

        {/* Status section — couple gets checklist bar, family gets category pills */}
        {isCouple ? (
          <div
            style={{
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '14px',
              padding: '14px 16px',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>
                Wedding checklist
              </p>
              <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: completionPct === 100 ? '#2D6025' : 'rgba(26,20,16,0.62)' }}>
                {completionPct}% done
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ delay: 0.5, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  height: '100%',
                  background: completionPct === 100
                    ? 'linear-gradient(90deg, #2D6025, #4A9040)'
                    : `linear-gradient(90deg, ${config.accentColor}, #7A0F46)`,
                  borderRadius: '99px',
                }}
              />
            </div>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', margin: '6px 0 0' }}>
              {initialTasks.filter(t => t.done).length} of {initialTasks.length} tasks completed
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Pending by category
            </p>
            {categoryBreakdown.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categoryBreakdown.map(([catKey, count]) => {
                  const cat = taskCategories[catKey]
                  if (!cat) return null
                  return (
                    <div
                      key={catKey}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '99px',
                        background: `${cat.color}14`,
                        border: `1px solid ${cat.color}30`,
                      }}
                    >
                      <span
                        style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }}
                      />
                      <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: '#1A1410' }}>
                        {cat.label}
                      </span>
                      <span
                        className="font-work-sans"
                        style={{
                          fontSize: '10px', fontWeight: 600,
                          color: cat.color,
                          background: `${cat.color}18`,
                          padding: '1px 6px', borderRadius: '99px',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#2D6025" />
                <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025' }}>
                  All tasks complete — enjoy the day!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <motion.button
          onClick={handleCta}
          className="w-full font-work-sans flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${config.accentColor} 0%, #1A1410 100%)`,
            color: '#FFFFFF',
            fontSize: '14px', fontWeight: 600,
            fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
            padding: '15px',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 20px ${config.accentColor}44`,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          {!isCouple && <ChevronRight size={15} style={{ marginLeft: -4 }} />}
          {config.cta}
        </motion.button>

        {/* Dismiss hint */}
        <p
          className="font-work-sans text-center"
          style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.3)', margin: 0 }}
        >
          Tap × to go to your home screen
        </p>
      </motion.div>
    </motion.div>
  )
}
