import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { ceremonies } from '../data/mockData'
import { taskCategories, getTopTasks, formatDue } from '../data/tasksData'
import { getWeddingProfile } from '../utils/profileUtils'
import { TaskDetailDrawer } from './TasksScreen'
import { VIBES, DEFAULT_VIBE } from '../data/vibesData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }

// ── Compact task tile for home screen ────────────────────────────────────────
function HomeTaskTile({ task, onToggle, onSelect }) {
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
      style={{ padding: '11px 12px', cursor: 'pointer' }}
      onClick={() => onSelect(task)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}
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
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.5 : 1 }}>
          {task.title}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '1px 6px', letterSpacing: '0.04em' }}>
            {cat.label.split(' ')[0].toUpperCase()}
          </span>
          {dueLabel && (
            <span className="font-work-sans flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 400, color: isOverdue ? '#B03A10' : 'rgba(26,20,16,0.54)' }}>
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
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 320 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '24px 24px 0 0', zIndex: 321, padding: '20px 22px 36px' }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 22px' }} />

        {/* App preview card */}
        <div style={{ background: 'linear-gradient(135deg, #1A1410, #2D2318)', borderRadius: 20, padding: '16px 18px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#7A0F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#fff' }}>✦</span>
            </div>
            <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(122,15,70,0.9)', letterSpacing: '0.1em' }}>SHAADI MUBARAK</span>
          </div>
          <p className="font-cormorant italic" style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 400, margin: '0 0 12px', textAlign: 'center' }}>Dec 17 · 4 days away</p>
          {['Confirm Pandit Sureshji', 'Send mehndi backup message', 'Review Baraat timeline'].map((task, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid rgba(122,15,70,0.6)', flexShrink: 0 }} />
              <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{task}</span>
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
              <p className="font-work-sans" style={{ fontSize: '15px', fontWeight: 600, color: '#1A1410', margin: '0 0 4px' }}>You're all set!</p>
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>Shaadi Mubarak is on your home screen</p>
            </div>
          </div>
        ) : canNativeInstall ? (
          // Android native install (1-tap)
          <>
            <p className="font-cormorant italic" style={{ fontSize: '24px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', textAlign: 'center' }}>Add to home screen</p>
            <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Get instant access to your wedding tasks and countdown without opening the browser.
            </p>
            <button onClick={handleNativeInstall}
              className="w-full font-work-sans flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.3)' }}>
              <AddToHomeIcon size={17} />
              Add to Home Screen
            </button>
            <p className="font-work-sans text-center" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: '12px 0 0' }}>
              Your browser will ask for confirmation
            </p>
          </>
        ) : (
          // iOS / fallback illustrated guide
          <>
            <p className="font-cormorant italic" style={{ fontSize: '24px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', textAlign: 'center' }}>Add to home screen</p>
            <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', lineHeight: 1.6, margin: '0 0 18px' }}>
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
                    <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{step.label}</p>
                    <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: '2px 0 0' }}>{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onClose}
              className="w-full font-work-sans"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
              Got it
            </button>
          </>
        )}
      </motion.div>
    </>
  )
}

export default function HomeScreen({ tasks = [], setTasks, vendors = [], guests = [], onOpenAgent }) {
  const navigate = useNavigate()
  const [couplePhoto, setCouplePhoto] = useState(null)
  const [planBannerDismissed, setPlanBannerDismissed] = useState(
    () => localStorage.getItem('sm_plan_banner_dismissed') === '1'
  )
  const [widgetDismissed, setWidgetDismissed] = useState(false)
  const [showWidgetModal, setShowWidgetModal] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  // Capture the browser's install prompt (Android/Chrome only)
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [setTasks])

  const updateAssignees = useCallback((id, assignees) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignees } : t))
  }, [setTasks])

  const topTasks = getTopTasks(tasks, 5)

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setCouplePhoto(URL.createObjectURL(file))
  }

  // Read profile data (falls back to sensible defaults if no profile set)
  const profile = getWeddingProfile()
  const brideName = profile?.bride || 'The Bride'
  const partnerName = profile?.partner || 'The Groom'
  const venueShort = (profile?.location || 'Venue TBD').split(',')[0]

  // Compute live countdown from wedding date
  const weddingDateTime = profile?.date ? new Date(profile.date) : new Date('2026-12-17T00:00:00')
  const msLeft = Math.max(0, weddingDateTime.getTime() - Date.now())
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const weddingDayOfWeek = weddingDateTime.toLocaleDateString('en-US', { weekday: 'long' })
  const shortDate = weddingDateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="relative flex flex-col h-full overflow-y-auto no-scrollbar">

        {/* ── Vibe tile hero card ── */}
        {(() => {
          const profile = getWeddingProfile()
          const vibeId = profile?.vibe
          const vibe = VIBES.find(v => v.id === vibeId) || DEFAULT_VIBE
          return (
            <div style={{ position: 'relative', flexShrink: 0, height: 290 }}>
              {/* Full-bleed hero — no side padding, no border radius */}
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                {/* Vibe background image */}
                <img
                  src={couplePhoto || vibe.img}
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: vibe.gradient }} />

                {/* StatusBar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, pointerEvents: 'none' }}>
                  <StatusBar light />
                </div>

                {/* Logo + NavIcons */}
                <div style={{ position: 'absolute', top: 46, left: 18, right: 16, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <LogoMark light />
                  <NavIcons light />
                </div>

                {/* Text at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 className="font-cormorant italic" style={{ fontSize: '38px', color: '#FFFFFF', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.05 }}>
                    {brideName} &amp; {partnerName}
                  </h1>
                  <p className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.70)', fontWeight: 400, margin: '0 0 12px', textAlign: 'center', letterSpacing: '0.01em' }}>
                    {weddingDayOfWeek} &nbsp;·&nbsp; {shortDate} &nbsp;·&nbsp; {venueShort}
                  </p>
                  <div className="flex items-center gap-3">
                    <label htmlFor="couple-photo" style={{ cursor: 'pointer' }}>
                      <span className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.50)', fontWeight: 400, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        Change image
                      </span>
                    </label>
                    <div style={{ border: '1px solid rgba(255,255,255,0.40)', borderRadius: '99px', padding: '6px 18px', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)' }}>
                      <span className="font-work-sans" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 400, letterSpacing: '0.02em' }}>
                        {daysLeft}d &nbsp;·&nbsp; {hoursLeft}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        <input id="couple-photo" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />

        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show" style={{ paddingTop: 20 }}>

          {/* ── Plan-ready alert banner ── */}
          <AnimatePresence>
            {!planBannerDismissed && (
              <motion.div
                variants={item}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: 'rgba(122,15,70,0.05)', border: '1px solid rgba(122,15,70,0.18)' }}>
                  {/* Sparkle icon — light bg, maroon icon */}
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={14} color="#7A0F46" strokeWidth={1.8} />
                  </div>
                  <p className="font-work-sans flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.70)', margin: 0, lineHeight: 1.45 }}>
                    Your curated wedding plan is ready
                  </p>
                  <button
                    onClick={onOpenAgent}
                    className="font-work-sans flex-shrink-0"
                    style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.24)', borderRadius: '99px', padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Customize
                  </button>
                  {/* Dismiss */}
                  <button
                    onClick={() => { setPlanBannerDismissed(true); localStorage.setItem('sm_plan_banner_dismissed', '1') }}
                    style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(122,15,70,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                    <X size={11} color="rgba(122,15,70,0.60)" strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── AT A GLANCE stats card ── */}
          <motion.div variants={item}>
            <div className="glass-card" style={{ padding: '16px 18px' }}>
              {/* Header row */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(26,20,16,0.45)', letterSpacing: '0.16em' }}>AT A GLANCE</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-cormorant italic" style={{ fontSize: '14px', fontWeight: 500, color: '#1A1410' }}>{daysLeft} days</span>
                  <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.40)' }}>until {shortDate}</span>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {[
                  { label: 'VENDORS',    value: vendors.length,                         sub: `${vendors.filter(v => v.status !== 'confirmed').length} pending`,  path: '/vendors' },
                  { label: 'CEREMONIES', value: ceremonies.length,                      sub: `${ceremonies.filter(c => c.status === 'upcoming' || c.status === 'live').length} upcoming`, path: '/ceremonies' },
                  { label: 'GUESTS',     value: guests.length,                          sub: `${guests.filter(g => g.rsvp === 'pending').length} pending`,        path: '/guests' },
                  { label: 'TASKS',      value: tasks.filter(t => !t.done).length,      sub: `${tasks.filter(t => !t.done && t.priority === 'high').length} urgent`, path: '/tasks' },
                ].map(stat => {
                  const inner = (
                    <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: stat.path ? 'rgba(0,0,0,0.02)' : 'transparent', cursor: stat.path ? 'pointer' : 'default' }}>
                      <p className="font-work-sans" style={{ fontSize: '8px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.12em', margin: '0 0 4px' }}>{stat.label}</p>
                      <p className="font-cormorant" style={{ fontSize: '28px', fontWeight: 600, color: stat.path ? '#7A0F46' : '#1A1410', margin: '0 0 2px', lineHeight: 1 }}>{stat.value}</p>
                      <p className="font-work-sans" style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(26,20,16,0.42)', margin: 0 }}>{stat.sub}</p>
                    </div>
                  )
                  return stat.path
                    ? <button key={stat.label} onClick={() => navigate(stat.path)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>{inner}</button>
                    : <div key={stat.label}>{inner}</div>
                })}
              </div>
            </div>
          </motion.div>

          {/* Tasks label + view all */}
          <motion.div variants={item} className="flex items-center gap-3 mt-1">
            <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.16em' }}>TODAY'S TASKS</span>
            <div className="flex-1" style={{ height: '1px', background: 'rgba(0,0,0,0.07)' }} />
            <button onClick={() => navigate('/tasks')}
              className="flex items-center gap-1 font-work-sans"
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
                  <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#2D6025', margin: 0 }}>All tasks done!</p>
                  <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Nothing pending for today</p>
                </motion.div>
              ) : (
                topTasks.map(task => (
                  <HomeTaskTile key={task.id} task={task} onToggle={toggleTask} onSelect={setSelectedTask} />
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
                  <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>
                    {installPrompt ? 'Install app to home screen' : 'Add to your home screen'}
                  </span>
                  <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', marginTop: '1px' }}>
                    {installPrompt ? 'One tap — no browser needed' : 'Track top tasks without opening the app'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWidgetModal(true)}
                    className="font-work-sans"
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

          <div style={{ height: '140px' }} />
        </motion.div>
      </div>

      <BottomNav />

      {/* ── Widget Setup Modal ── */}
      <AnimatePresence>
        {showWidgetModal && (
          <WidgetModal onClose={() => setShowWidgetModal(false)} installPrompt={installPrompt} />
        )}
      </AnimatePresence>

      {/* Task detail drawer */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={() => {}}
            onUpdateAssignees={updateAssignees}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
