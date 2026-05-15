import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, Eye, Check, Users, X, Sparkles } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { weddingWebsite } from '../data/mockData'
import { useWeddingProfile } from '../hooks/useWeddingProfile'
import { VIBES, DEFAULT_VIBE } from '../data/vibesData'

function getVibeImage() {
  try {
    const p = JSON.parse(localStorage.getItem('sm_profile') || '{}')
    const vibe = VIBES.find(v => v.id === p.vibe) || DEFAULT_VIBE
    return vibe.img
  } catch { return DEFAULT_VIBE.img }
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }
const spring = { type: 'spring', stiffness: 420, damping: 32 }

const THEMES = [
  { id: 'ivory',  label: 'Ivory',  bg: '#F5F0E8', accent: '#7A0F46' },
  { id: 'blush',  label: 'Blush',  bg: '#FAE8EC', accent: '#C4507A' },
  { id: 'forest', label: 'Forest', bg: '#E8F0E8', accent: '#3A7A50' },
  { id: 'slate',  label: 'Slate',  bg: '#E8ECF5', accent: '#4A6AB0' },
]

function Toggle({ enabled, onChange }) {
  return (
    <button onClick={() => onChange(!enabled)}
      style={{ width: '40px', height: '24px', borderRadius: '99px', background: enabled ? '#7A0F46' : 'rgba(0,0,0,0.12)', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, transition: 'background 0.22s ease', position: 'relative' }}>
      <motion.div
        animate={{ x: enabled ? 16 : 0 }}
        transition={spring}
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFFBF5', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', position: 'absolute', top: '2px', left: '2px' }}
      />
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   Full-screen interactive website preview
   ───────────────────────────────────────────────────────── */
function StoryTab({ t, wp }) {
  const weddingDate = new Date('2026-12-19')
  const diff = weddingDate - new Date()
  const days = Math.max(0, Math.floor(diff / 86400000))
  const hrs  = Math.max(0, Math.floor((diff % 86400000) / 3600000))
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000))

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getVibeImage()})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,8,4,0.35) 0%, rgba(20,8,4,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center', color: 'white', zIndex: 1 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontStyle: 'italic', fontWeight: 400, marginBottom: 6 }}>
            {wp.bride} &amp; {wp.groom}
          </div>
          <div style={{ height: 1, width: 36, background: 'rgba(255,255,255,0.45)', margin: '0 auto 8px' }} />
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.78)', textTransform: 'uppercase' }}>
            DECEMBER 19, 2026 · UDAIPUR
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div style={{ background: 'white', padding: '18px 0', textAlign: 'center', borderBottom: `1px solid ${t.accent}18` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          {[{ v: days, l: 'DAYS' }, { v: hrs, l: 'HRS' }, { v: mins, l: 'MIN' }].map(({ v, l }) => (
            <div key={l}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: '#1A1410', lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(26,20,16,0.42)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitation */}
      <div style={{ padding: '22px 24px 6px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(26,20,16,0.65)', lineHeight: 1.9, margin: 0 }}>
          Join us as we begin our forever — Dec 19 at {wp.venue}
        </p>
      </div>

      {/* Our Story */}
      <div style={{ padding: '20px 24px 36px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.4)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>OUR STORY</div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(26,20,16,0.62)', lineHeight: 1.8, margin: 0 }}>
          We met at a friend's Diwali celebration in 2022 and discovered a shared love for travel, terrible puns, and really good biryani. What started as a conversation about the best street food in Mumbai turned into countless adventures together — from weekend escapes to Coorg to a life-changing trip through Rajasthan. And now, here we are.
        </p>
      </div>
    </div>
  )
}

function EventsTab({ t }) {
  const events = [
    { name: 'Mehndi Ceremony',  date: 'December 17, 2026', time: '3:00 PM',  venue: 'The Leela Palace, Garden Terrace', note: 'Dress code: Yellow & Green' },
    { name: 'Sangeet Night',    date: 'December 17, 2026', time: '7:00 PM',  venue: 'The Leela Palace, Grand Ballroom', note: 'Dress code: Festive wear' },
    { name: 'Wedding Ceremony', date: 'December 19, 2026', time: '10:00 AM', venue: 'The Leela Palace, Lawn',           note: 'Dress code: Traditional Indian' },
    { name: 'Reception',        date: 'December 19, 2026', time: '7:00 PM',  venue: 'The Leela Palace, Ballroom',       note: 'Dress code: Formal' },
  ]
  return (
    <div style={{ padding: '22px 18px 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.4)', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>EVENTS</div>
      {events.map((ev, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 18px', borderLeft: `3px solid ${t.accent}` }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 500, color: '#1A1410', marginBottom: 4 }}>{ev.name}</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: t.accent, marginBottom: 3 }}>{ev.date} · {ev.time}</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(26,20,16,0.52)', marginBottom: ev.note ? 5 : 0 }}>{ev.venue}</div>
          {ev.note && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(26,20,16,0.38)', fontStyle: 'italic' }}>{ev.note}</div>}
        </div>
      ))}
    </div>
  )
}

function PhotosTab({ t }) {
  const gradients = [
    'linear-gradient(145deg, #8B6040 0%, #3A1A0A 100%)',
    'linear-gradient(145deg, #F5C842 0%, #E8733A 100%)',
    'linear-gradient(145deg, #FADADD 0%, #C4507A 100%)',
    'linear-gradient(145deg, #2C1A0E 0%, #6B3A20 100%)',
    'linear-gradient(145deg, #7BA7BC 0%, #2A4A6B 100%)',
    'linear-gradient(145deg, #F5F0E8 0%, #C4A870 100%)',
  ]
  return (
    <div style={{ padding: '22px 16px 36px' }}>
      <div style={{ textAlign: 'center', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.4)', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'Inter, sans-serif' }}>PHOTOS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {gradients.map((g, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: 12, background: g }} />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(26,20,16,0.4)', marginTop: 18, fontStyle: 'italic' }}>
        More photos coming soon ✦
      </p>
    </div>
  )
}

function RSVPTab({ t, wp }) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div style={{ padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontStyle: 'italic', color: t.accent, marginBottom: 10 }}>Thank you!</div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(26,20,16,0.6)', lineHeight: 1.7 }}>
          Your RSVP has been received. We look forward to celebrating with you on December 19.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '22px 20px 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.4)', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>RSVP</div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontStyle: 'italic', textAlign: 'center', color: 'rgba(26,20,16,0.68)', margin: '0 0 6px' }}>
        Kindly let us know if you'll be joining us
      </p>
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Your full name"
        style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.12)', fontFamily: 'Inter, sans-serif', fontSize: 13, background: 'white', outline: 'none', color: '#1A1410' }}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        {['Joyfully accepts', 'Regretfully declines'].map((opt, i) => (
          <button key={opt} onClick={() => setAttending(i === 0)}
            style={{ flex: 1, padding: '12px 8px', borderRadius: 10, border: `1px solid ${attending === (i === 0) ? t.accent : 'rgba(0,0,0,0.12)'}`, background: attending === (i === 0) ? t.accent + '14' : 'white', color: attending === (i === 0) ? t.accent : 'rgba(26,20,16,0.65)', fontFamily: 'Inter, sans-serif', fontSize: 12, cursor: 'pointer', transition: 'all 0.18s ease' }}>
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={() => name && attending !== null && setSubmitted(true)}
        style={{ padding: '14px', borderRadius: 12, background: (attending !== null && name) ? t.accent : 'rgba(0,0,0,0.1)', color: 'white', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, cursor: (attending !== null && name) ? 'pointer' : 'default', transition: 'background 0.2s ease' }}>
        Send RSVP
      </button>
    </div>
  )
}

function WebsitePreview({ theme, wp, onClose }) {
  const [activeTab, setActiveTab] = useState('story')
  const t = THEMES.find(t2 => t2.id === theme) || THEMES[0]
  const tabs = ['STORY', 'EVENTS', 'PHOTOS', 'RSVP']

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 36 }}
      style={{ position: 'absolute', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: '#fff' }}
    >
      {/* Browser chrome bar */}
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* macOS traffic lights */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={7} color="rgba(0,0,0,0.4)" />
          </button>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28CA41' }} />
        </div>
        <div style={{ flex: 1, background: 'white', borderRadius: 7, padding: '5px 12px', textAlign: 'center', fontSize: 11, color: 'rgba(26,20,16,0.52)', border: '1px solid rgba(0,0,0,0.09)', fontFamily: 'Inter, sans-serif' }}>
          ananya-rahul.wedding
        </div>
        <div style={{ width: 42 }} />
      </div>

      {/* Website nav bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: t.accent, fontStyle: 'italic', marginRight: 'auto', padding: '10px 0' }}>
          A &amp; R
        </span>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ padding: '13px 10px', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.07em', color: activeTab === tab.toLowerCase() ? t.accent : 'rgba(26,20,16,0.42)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === tab.toLowerCase() ? `2px solid ${t.accent}` : '2px solid transparent', transition: 'all 0.18s ease', fontFamily: 'Inter, sans-serif' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', background: t.bg }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'story'  && <StoryTab  t={t} wp={wp} />}
            {activeTab === 'events' && <EventsTab t={t} wp={wp} />}
            {activeTab === 'photos' && <PhotosTab t={t} />}
            {activeTab === 'rsvp'   && <RSVPTab   t={t} wp={wp} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   Change Setup bottom sheet
   ───────────────────────────────────────────────────────── */
function SetupSheet({ published, setPublished, sections, toggleSection, theme, setTheme, onClose }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.30)', zIndex: 420 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '16px 20px 48px', maxHeight: '82vh', overflowY: 'auto' }}>

        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <p className="font-cormorant" style={{ fontSize: '22px', fontStyle: 'italic', fontWeight: 500, margin: '0 0 20px', color: '#1A1410' }}>Website Settings</p>

        {/* Publish toggle */}
        <div className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, border: published ? '1px solid rgba(45,96,37,0.22)' : '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1 }}>
            <p className="font-work-sans" style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1A1410' }}>{published ? 'Live' : 'Draft'}</p>
            <p className="font-work-sans" style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(26,20,16,0.55)' }}>{published ? 'Visible to guests' : 'Not visible to guests yet'}</p>
          </div>
          <Toggle enabled={published} onChange={setPublished} />
        </div>

        {/* Theme picker */}
        <p className="font-work-sans" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Theme</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: 12, background: t.bg, border: theme === t.id ? `2px solid ${t.accent}` : '2px solid rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden', transition: 'border 0.18s ease' }}>
                <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '4px', borderRadius: '99px', background: t.accent, opacity: 0.7 }} />
                {theme === t.id && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.3)' }}>
                    <Check size={14} color={t.accent} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <span className="font-work-sans" style={{ fontSize: 10, fontWeight: theme === t.id ? 500 : 300, color: theme === t.id ? '#1A1410' : 'rgba(26,20,16,0.62)' }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Sections */}
        <p className="font-work-sans" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Sections</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sections.map(sec => (
            <div key={sec.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="font-work-sans" style={{ flex: 1, fontSize: 13, fontWeight: 400, color: sec.enabled ? '#1A1410' : 'rgba(26,20,16,0.54)' }}>{sec.label}</span>
              <Toggle enabled={sec.enabled} onChange={() => toggleSection(sec.id)} />
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   Mini browser-chrome preview card (main screen)
   ───────────────────────────────────────────────────────── */
function MiniPreviewCard({ theme, wp, onClick }) {
  const t = THEMES.find(t2 => t2.id === theme) || THEMES[0]
  const weddingDate = new Date('2026-12-19')
  const diff = weddingDate - new Date()
  const days = Math.max(0, Math.floor(diff / 86400000))
  const hrs  = Math.max(0, Math.floor((diff % 86400000) / 3600000))
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000))

  return (
    <button onClick={onClick} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block', textAlign: 'left' }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
        {/* Chrome bar */}
        <div style={{ background: '#F0EDE8', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28CA41' }} />
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: 5, padding: '4px 10px', textAlign: 'center', fontSize: 10, color: 'rgba(26,20,16,0.48)', border: '1px solid rgba(0,0,0,0.07)', fontFamily: 'Inter, sans-serif' }}>
            ananya-rahul.wedding
          </div>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(122,15,70,0.10)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={11} color="#7A0F46" />
          </div>
        </div>

        {/* Website content */}
        <div style={{ background: t.bg }}>
          {/* Hero */}
          <div style={{ height: 150, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 14, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getVibeImage()})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,8,4,0.30) 0%, rgba(20,8,4,0.72) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontStyle: 'italic', color: 'white', fontWeight: 400, marginBottom: 4 }}>
              {wp.bride} &amp; {wp.groom}
            </div>
            <div style={{ position: 'relative', zIndex: 1, fontFamily: 'Inter, sans-serif', fontSize: 8, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase' }}>
              DECEMBER 19, 2026 · UDAIPUR
            </div>
          </div>

          {/* Countdown */}
          <div style={{ background: 'white', padding: '12px 0', textAlign: 'center', borderBottom: `1px solid ${t.accent}18`, display: 'flex', justifyContent: 'center', gap: 20 }}>
            {[{ v: days, l: 'DAYS' }, { v: hrs, l: 'HRS' }, { v: mins, l: 'MIN' }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300, color: '#1A1410', lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 7, letterSpacing: '0.1em', color: 'rgba(26,20,16,0.4)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Invite blurb */}
          <div style={{ padding: '10px 18px 14px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 11, fontStyle: 'italic', color: 'rgba(26,20,16,0.6)', margin: 0, lineHeight: 1.7 }}>
              Join us as we begin our forever — Dec 19 at {wp.venue}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   Main screen
   ───────────────────────────────────────────────────────── */
export default function WeddingWebsiteScreen({ onOpenAgent }) {
  const navigate = useNavigate()
  const wp = useWeddingProfile()
  const [published, setPublished] = useState(weddingWebsite.published)
  const [sections, setSections]   = useState(weddingWebsite.sections)
  const [theme, setTheme]         = useState(weddingWebsite.theme)
  const [copied, setCopied]       = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSetup, setShowSetup]     = useState(false)

  const toggleSection = (id) => setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const handleEdit = () => {
    if (onOpenAgent) onOpenAgent('Help me edit my wedding website — update the design, content, and templates.')
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="flex items-center mt-2" style={{ position: 'relative', minHeight: '34px' }}>
            <button onClick={() => navigate(-1)}
              style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowLeft size={15} color="rgba(26,20,16,0.6)" />
            </button>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <h1 className="font-cormorant italic" style={{ fontSize: '26px', color: '#1A1410', fontWeight: 500, margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Wedding Website</h1>
            </div>
            {/* Preview button */}
            <button
              onClick={() => setShowPreview(true)}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.22)', borderRadius: 99, padding: '6px 12px', cursor: 'pointer' }}>
              <Eye size={13} color="#7A0F46" />
              <span className="font-work-sans" style={{ fontSize: 11, fontWeight: 500, color: '#7A0F46' }}>Preview</span>
            </button>
          </motion.div>

          {/* Status + URL row */}
          <motion.div variants={item} className="flex items-center justify-between" style={{ padding: '8px 14px', background: published ? 'rgba(45,96,37,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: 12, border: published ? '1px solid rgba(45,96,37,0.18)' : '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: published ? '#2D6025' : 'rgba(26,20,16,0.3)', flexShrink: 0 }} />
              <span className="font-work-sans" style={{ fontSize: 12, fontWeight: 500, color: published ? '#2D6025' : 'rgba(26,20,16,0.5)' }}>
                {published ? 'Live' : 'Draft'}
              </span>
              <span className="font-work-sans" style={{ fontSize: 11, color: 'rgba(26,20,16,0.4)' }}>·</span>
              <span className="font-work-sans" style={{ fontSize: 11, color: 'rgba(26,20,16,0.45)' }}>{weddingWebsite.url}</span>
            </div>
            <button onClick={handleCopy} className="flex items-center gap-1 font-work-sans"
              style={{ fontSize: 11, fontWeight: 500, color: copied ? '#2D6025' : '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1"><Check size={11} />Copied</motion.span>
                  : <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1"><Copy size={11} />Copy</motion.span>
                }
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Mini browser preview card */}
          <motion.div variants={item}>
            <MiniPreviewCard theme={theme} wp={wp} onClick={() => setShowPreview(true)} />
          </motion.div>

          {/* Stats row */}
          {published && (
            <motion.div variants={item} className="grid grid-cols-2 gap-2">
              {[
                { icon: Eye,   value: weddingWebsite.views,         label: 'page views' },
                { icon: Users, value: weddingWebsite.rsvpResponses, label: 'RSVP responses' },
              ].map(s => (
                <div key={s.label} className="glass-card flex items-center gap-3" style={{ padding: '14px' }}>
                  <s.icon size={15} color="#7A0F46" style={{ flexShrink: 0 }} />
                  <div className="flex flex-col">
                    <span className="font-work-sans" style={{ fontSize: '18px', fontWeight: 600, color: '#1A1410', lineHeight: 1 }}>{s.value}</span>
                    <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', marginTop: '2px' }}>{s.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Templates / Themes section */}
          <motion.div variants={item} className="flex flex-col gap-3">
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Templates</p>
            <div className="flex gap-2">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className="flex flex-col items-center gap-1.5 flex-1"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', background: t.bg, border: theme === t.id ? `2px solid ${t.accent}` : '2px solid rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden', transition: 'border 0.18s ease' }}>
                    <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '4px', borderRadius: '99px', background: t.accent, opacity: 0.7 }} />
                    {theme === t.id && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.3)' }}>
                        <Check size={14} color={t.accent} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: theme === t.id ? 500 : 300, color: theme === t.id ? '#1A1410' : 'rgba(26,20,16,0.62)' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bottom action buttons */}
          <motion.div variants={item} className="flex gap-3">
            {/* Change setup — ghost, magenta text */}
            <button
              onClick={() => setShowSetup(true)}
              className="flex-1 font-work-sans"
              style={{ padding: '15px', borderRadius: '14px', background: 'transparent', border: 'none', color: '#7A0F46', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              Change setup
            </button>

            {/* Edit — light magenta fill */}
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 font-work-sans"
              style={{ padding: '15px', borderRadius: '14px', background: 'rgba(122,15,70,0.10)', border: '1px solid rgba(122,15,70,0.22)', color: '#7A0F46', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              <Sparkles size={14} color="#7A0F46" />
              Edit
            </button>
          </motion.div>

          <div style={{ height: '140px' }} />
        </motion.div>
      </div>

      <BottomNav />

      {/* Overlays */}
      <AnimatePresence>
        {showPreview && (
          <WebsitePreview
            key="preview"
            theme={theme}
            wp={wp}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSetup && (
          <SetupSheet
            key="setup"
            published={published}
            setPublished={setPublished}
            sections={sections}
            toggleSection={toggleSection}
            theme={theme}
            setTheme={setTheme}
            onClose={() => setShowSetup(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
