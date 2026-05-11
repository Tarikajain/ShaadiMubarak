import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { wedding, crisis } from '../data/mockData'
import { taskCategories, getTopTasks, formatDue } from '../data/tasksData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }

// ── Compact task tile for home screen ────────────────────────────────────────
function HomeTaskTile({ task, onToggle }) {
  const cat = taskCategories[task.category] || taskCategories.vendors
  const dueLabel = task.dueDate ? formatDue(task.dueDate) : ''
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className="glass-card flex items-center gap-3"
      style={{ padding: '11px 12px' }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: 21, height: 21, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: `2px solid ${task.done ? '#7A0F46' : 'rgba(0,0,0,0.18)'}`,
          background: task.done ? '#7A0F46' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.18s ease',
        }}
      >
        {task.done && <Check size={11} color="#FFFFFF" strokeWidth={2.5} />}
      </button>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.5 : 1 }}>
          {task.title}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '1px 6px', letterSpacing: '0.04em' }}>
            {cat.label.split(' ')[0].toUpperCase()}
          </span>
          {dueLabel && (
            <span className="font-outfit flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 300, color: isOverdue ? '#B03A10' : 'rgba(26,20,16,0.38)' }}>
              <Calendar size={8} strokeWidth={2} />{dueLabel}
            </span>
          )}
        </div>
      </div>

      {/* Category image */}
      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, opacity: task.done ? 0.35 : 1 }}>
        <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </motion.div>
  )
}

// Platform detection helpers
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isInStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

// ── iOS Share icon (matches Safari's actual share button) ────────────────────
function IOSShareIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.684 8.316L12 5m0 0l3.316 3.316M12 5v11" />
      <path d="M5 12v6a1 1 0 001 1h12a1 1 0 001-1v-6" />
    </svg>
  )
}

// ── Android/Chrome install icon ──────────────────────────────────────────────
function AddToHomeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  )
}

// ── Widget Setup Modal ───────────────────────────────────────────────────────
function WidgetModal({ onClose, installPrompt }) {
  const [installed, setInstalled] = useState(false)
  const standalone = isInStandalone()
  const ios = isIOS()
  const canNativeInstall = !!installPrompt && !standalone

  const handleNativeInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setTimeout(onClose, 1800)
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 55 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '24px 24px 0 0', zIndex: 56, padding: '20px 22px 36px' }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 22px' }} />

        {/* App preview card */}
        <div style={{ background: 'linear-gradient(135deg, #1A1410, #2D2318)', borderRadius: 20, padding: '16px 18px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#7A0F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#fff' }}>✦</span>
            </div>
            <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(122,15,70,0.9)', letterSpacing: '0.1em' }}>SHAADI MUBARAK</span>
          </div>
          <p className="font-cormorant italic" style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 300, margin: '0 0 12px' }}>Dec 17 · 4 days away</p>
          {['Confirm Pandit Sureshji', 'Send mehndi backup message', 'Review Baraat timeline'].map((task, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid rgba(122,15,70,0.6)', flexShrink: 0 }} />
              <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>{task}</span>
            </div>
          ))}
        </div>

        {installed || standalone ? (
          // Already installed state
          <div className="flex flex-col items-center gap-3 text-center" style={{ padding: '10px 0 8px' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(45,96,37,0.1)', border: '1px solid rgba(45,96,37,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={24} color="#2D6025" />
              </div>
            </motion.div>
            <div>
              <p className="font-outfit" style={{ fontSize: '15px', fontWeight: 600, color: '#1A1410', margin: '0 0 4px' }}>You're all set!</p>
              <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>Shaadi Mubarak is on your home screen</p>
            </div>
          </div>
        ) : canNativeInstall ? (
          // Android native install (1-tap)
          <>
            <p className="font-cormorant italic" style={{ fontSize: '24px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Add to home screen</p>
            <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.5)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Get instant access to your wedding tasks and countdown without opening the browser.
            </p>
            <button onClick={handleNativeInstall}
              className="w-full font-outfit flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.3)' }}>
              <AddToHomeIcon size={17} />
              Add to Home Screen
            </button>
            <p className="font-outfit text-center" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.35)', margin: '12px 0 0' }}>
              Your browser will ask for confirmation
            </p>
          </>
        ) : (
          // iOS / fallback illustrated guide
          <>
            <p className="font-cormorant italic" style={{ fontSize: '24px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Add to home screen</p>
            <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.5)', lineHeight: 1.6, margin: '0 0 18px' }}>
              {ios ? 'Follow these steps in Safari:' : 'In Chrome, tap the menu (⋮) then:'}
            </p>

            {/* Step cards */}
            <div className="flex flex-col gap-2" style={{ marginBottom: 18 }}>
              {(ios ? [
                {
                  icon: <IOSShareIcon size={18} />,
                  bg: '#007AFF',
                  label: 'Tap the Share button',
                  sub: 'The box-with-arrow icon at the bottom of Safari',
                },
                {
                  icon: <span style={{ fontSize: 16 }}>＋</span>,
                  bg: '#7A0F46',
                  label: '"Add to Home Screen"',
                  sub: 'Scroll down in the share sheet to find it',
                },
                {
                  icon: <Check size={16} color="#fff" />,
                  bg: '#2D6025',
                  label: 'Tap Add',
                  sub: 'The app icon appears on your home screen',
                },
              ] : [
                {
                  icon: <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>⋮</span>,
                  bg: '#5F6368',
                  label: 'Tap the menu (⋮)',
                  sub: 'Top-right corner of Chrome',
                },
                {
                  icon: <AddToHomeIcon size={16} />,
                  bg: '#7A0F46',
                  label: '"Add to Home Screen"',
                  sub: 'Find it in the Chrome menu list',
                },
                {
                  icon: <Check size={16} color="#fff" />,
                  bg: '#2D6025',
                  label: 'Tap Add',
                  sub: 'App shortcut is added instantly',
                },
              ]).map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{step.label}</p>
                    <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: '2px 0 0' }}>{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onClose}
              className="w-full font-outfit"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
              Got it
            </button>
          </>
        )}
      </motion.div>
    </>
  )
}

export default function HomeScreen({ tasks = [], setTasks }) {
  const navigate = useNavigate()
  const [couplePhoto, setCouplePhoto] = useState(null)
  const [widgetDismissed, setWidgetDismissed] = useState(false)
  const [showWidgetModal, setShowWidgetModal] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  // Capture the browser's install prompt (Android/Chrome only)
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [setTasks])

  const topTasks = getTopTasks(tasks, 5)

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setCouplePhoto(URL.createObjectURL(file))
  }

  // Compute live countdown from wedding date
  const weddingDateTime = new Date('2026-12-17T00:00:00')
  const msLeft = Math.max(0, weddingDateTime.getTime() - Date.now())
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const weddingDayOfWeek = weddingDateTime.toLocaleDateString('en-US', { weekday: 'long' })
  const shortDate = weddingDateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const venueShort = wedding.venue.split(',')[0]

  // Mughal torana arch clip path (375px wide, straight edge at y=268, arch bottom at y=340)
  const archPath = "path('M 0 0 H 375 V 260 C 375 260 370 268 360 274 C 346 282 326 290 300 294 C 278 297 262 292 248 304 C 238 312 220 335 187.5 340 C 155 335 137 312 127 304 C 113 292 97 297 75 294 C 49 290 29 282 15 274 C 5 268 0 260 0 260 Z')"

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="relative flex flex-col h-full overflow-y-auto no-scrollbar">

        {/* ── Full-bleed torana hero ── */}
        <div style={{ position: 'relative', width: '100%', height: '345px', flexShrink: 0 }}>

          {/* Clipped background — magenta + damask pattern */}
          <div style={{ position: 'absolute', inset: 0, clipPath: archPath, overflow: 'hidden' }}>
            {/* Base colour */}
            <div style={{ position: 'absolute', inset: 0, background: '#7A0F46' }} />

            {/* Damask / brocade pattern overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="damask" patternUnits="userSpaceOnUse" width="80" height="80">
                  {/* 4-petal lotus */}
                  <path d="M40 22 Q47 31 40 40 Q33 31 40 22Z M58 40 Q49 47 40 40 Q49 33 58 40Z M40 58 Q33 49 40 40 Q47 49 40 58Z M22 40 Q31 33 40 40 Q31 47 22 40Z" fill="rgba(255,255,255,0.07)"/>
                  {/* Inner diamond */}
                  <path d="M40 34 L46 40 L40 46 L34 40Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
                  {/* Outer circle */}
                  <circle cx="40" cy="40" r="19" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7"/>
                  {/* Corner ornaments */}
                  <path d="M0 0 L5 3 L0 6Z M80 0 L75 3 L80 6Z M0 80 L5 77 L0 74Z M80 80 L75 77 L80 74Z" fill="rgba(255,255,255,0.06)"/>
                  {/* Mid-edge diamonds */}
                  <path d="M40 0 L43 5 L40 10 L37 5Z M40 70 L43 75 L40 80 L37 75Z M0 40 L5 37 L10 40 L5 43Z M70 40 L75 37 L80 40 L75 43Z" fill="rgba(255,255,255,0.05)"/>
                  {/* Diagonal scroll lines */}
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7"/>
                  <path d="M0 60 Q20 80 40 60 Q60 40 80 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#damask)"/>
            </svg>

            {/* Optional couple photo overlay */}
            {couplePhoto && (
              <img src={couplePhoto} alt="couple" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.28, mixBlendMode: 'overlay' }} />
            )}

            {/* Subtle top + bottom vignette */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.18) 100%)' }} />
          </div>

          {/* StatusBar — white */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, pointerEvents: 'none' }}>
            <StatusBar light />
          </div>

          {/* Logo + NavIcons row */}
          <div style={{ position: 'absolute', top: 46, left: 18, right: 16, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <LogoMark light />
            <NavIcons light />
          </div>

          {/* Centred text content */}
          <div style={{ position: 'absolute', top: 82, left: 20, right: 20, bottom: 90, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
            <h1 className="font-cormorant italic" style={{ fontSize: '42px', color: '#FFFFFF', fontWeight: 300, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.05 }}>
              {wedding.couple.bride} &amp; {wedding.couple.groom}
            </h1>
            <p className="font-outfit" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', fontWeight: 300, margin: '0 0 10px', textAlign: 'center', letterSpacing: '0.01em' }}>
              {weddingDayOfWeek} &nbsp;·&nbsp; {shortDate} &nbsp;·&nbsp; {venueShort}
            </p>
            <label htmlFor="couple-photo" style={{ cursor: 'pointer', marginBottom: '18px' }}>
              <span className="font-outfit" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Change image
              </span>
            </label>
            <div style={{ border: '1px solid rgba(255,255,255,0.42)', borderRadius: '99px', padding: '7px 22px', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)' }}>
              <span className="font-outfit" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 400, letterSpacing: '0.02em' }}>
                {daysLeft} days &nbsp;·&nbsp; {hoursLeft} hrs
              </span>
            </div>
          </div>

          <input id="couple-photo" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </div>

        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show" style={{ marginTop: '-4px' }}>

          {/* Crisis card */}
          <motion.div variants={item}>
            <motion.div
              className="cursor-pointer card-interactive"
              style={{ padding: '18px', borderRadius: '16px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.20)' }}
              onClick={() => navigate('/crisis')}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-outfit flex-1" style={{ fontSize: '15px', fontWeight: 500, color: '#1A1410', margin: 0, lineHeight: 1.35 }}>{crisis.title}</p>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(122,15,70,0.1)', border: '1px solid rgba(122,15,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={14} color="#7A0F46" strokeWidth={1.8} />
                </div>
              </div>
              <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.55)', margin: '0 0 16px', lineHeight: 1.55 }}>{crisis.summary}</p>

              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {crisis.cascade.slice(0, 3).map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)', padding: '5px 11px', borderRadius: '99px', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      {step.label}
                    </span>
                    {i < 2 && <span style={{ color: 'rgba(196,80,30,0.55)', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>→</span>}
                  </div>
                ))}
              </div>

              <button
                className="w-full font-outfit"
                style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '13px', fontWeight: 500, padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(122,15,70,0.28)' }}
                onClick={e => { e.stopPropagation(); navigate('/crisis') }}
              >
                Resolve now →
              </button>
            </motion.div>
          </motion.div>

          {/* Tasks label + view all */}
          <motion.div variants={item} className="flex items-center gap-3 mt-1">
            <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.16em' }}>TODAY'S TASKS</span>
            <div className="flex-1" style={{ height: '1px', background: 'rgba(0,0,0,0.07)' }} />
            <button onClick={() => navigate('/tasks')}
              className="flex items-center gap-1 font-outfit"
              style={{ fontSize: '10px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View all <ArrowRight size={10} />
            </button>
          </motion.div>

          {/* Top 5 task tiles */}
          <motion.div variants={item} className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {topTasks.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card flex flex-col items-center gap-2 text-center"
                  style={{ padding: '24px 16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={20} color="#2D6025" />
                  </div>
                  <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#2D6025', margin: 0 }}>All tasks done!</p>
                  <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Nothing pending for today</p>
                </motion.div>
              ) : (
                topTasks.map(task => (
                  <HomeTaskTile key={task.id} task={task} onToggle={toggleTask} />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Widget promo card ── */}
          <AnimatePresence>
            {!widgetDismissed && (
              <motion.div
                variants={item}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="glass-card flex items-center gap-3"
                style={{ padding: '14px 16px', border: '1px solid rgba(122,15,70,0.18)', background: 'rgba(122,15,70,0.03)', position: 'relative' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 17, color: '#fff' }}>✦</span>
                </div>
                <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
                  <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>
                    {installPrompt ? 'Install app to home screen' : 'Add to your home screen'}
                  </span>
                  <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', marginTop: '1px' }}>
                    {installPrompt ? 'One tap — no browser needed' : 'Track top tasks without opening the app'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWidgetModal(true)}
                    className="font-outfit"
                    style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.22)', borderRadius: '99px', padding: '5px 11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {installPrompt ? 'Install' : 'Set up'}
                  </button>
                  <button onClick={() => setWidgetDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    <X size={13} color="rgba(26,20,16,0.3)" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ height: '80px' }} />
        </motion.div>
      </div>

      <BottomNav />

      {/* ── Widget Setup Modal ── */}
      <AnimatePresence>
        {showWidgetModal && (
          <WidgetModal onClose={() => setShowWidgetModal(false)} installPrompt={installPrompt} />
        )}
      </AnimatePresence>
    </div>
  )
}
