import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Bell, Shield, HelpCircle, LogOut, ChevronRight,
  ChevronDown, Camera, Mail, Phone, Lock, Eye, EyeOff, Check, X,
  MessageCircle, FileText, ExternalLink, Brain, Smartphone, Trash2, Sparkles,
} from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { wedding } from '../data/mockData'
import {
  getMemories, deleteMemory, clearMemories,
  isMemoryEnabled, setMemoryEnabled,
  MEMORY_CATEGORIES,
} from '../utils/memoryUtils'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25,0.1,0.25,1] } } }
const sheetSpring = { type: 'spring', stiffness: 380, damping: 36 }

// ── Reusable Sheet Shell ──────────────────────────────────────────
function Sheet({ onClose, children }) {
  return (
    <>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 320 }} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={sheetSpring}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 321, padding: '20px 20px 44px', maxHeight: '88%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 22px' }} />
        {children}
      </motion.div>
    </>
  )
}

// ── Toggle Switch ─────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 42, height: 24, borderRadius: 99, background: value ? '#7A0F46' : 'rgba(0,0,0,0.12)', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s ease' }}>
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFFBF5', position: 'absolute', top: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
      />
    </button>
  )
}

// ── Personal Details Sheet ────────────────────────────────────────
function PersonalDetailsSheet({ onClose }) {
  const [name,  setName]  = useState(`${wedding.couple.bride} Sharma`)
  const [email, setEmail] = useState('tarika.jain@gmail.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Personal details</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px' }}>Your account information</p>

      {/* Avatar */}
      <div className="flex flex-col items-center" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 72, height: 72 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(122,15,70,0.3)' }}>
            <span className="font-cormorant italic" style={{ fontSize: '28px', color: '#FFF', fontWeight: 400 }}>{wedding.couple.bride[0]}</span>
          </div>
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#FFFBF5', border: '2px solid #FFFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
            <Camera size={12} color="rgba(26,20,16,0.6)" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3" style={{ marginBottom: 24 }}>
        {[
          { icon: User,  label: 'Full name',  value: name,  onChange: setName,  type: 'text' },
          { icon: Mail,  label: 'Email',      value: email, onChange: setEmail, type: 'email' },
          { icon: Phone, label: 'Phone',      value: phone, onChange: setPhone, type: 'tel' },
        ].map(({ icon: Icon, label, value, onChange, type }) => (
          <div key={label}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 2px' }}>{label}</p>
            <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px' }}>
              <Icon size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
              <input type={type} value={value} onChange={e => onChange(e.target.value)}
                style={{ fontSize: '13px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
            </div>
          </div>
        ))}
      </div>

      <motion.button onClick={handleSave}
        className="w-full font-work-sans flex items-center justify-center gap-2"
        style={{ background: saved ? 'rgba(45,96,37,0.9)' : 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)', transition: 'background 0.2s ease' }}
        whileTap={{ scale: 0.97 }}>
        {saved ? <><Check size={15} />Saved</> : 'Save changes'}
      </motion.button>
    </Sheet>
  )
}

// ── Security Sheet ────────────────────────────────────────────────
function SecuritySheet({ onClose }) {
  const [twoFA, setTwoFA] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!currentPass || !newPass) return
    setSaved(true)
    setTimeout(() => { setSaved(false); setCurrentPass(''); setNewPass('') }, 2000)
  }

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Privacy &amp; security</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px' }}>Keep your account secure</p>

      {/* 2FA */}
      <div className="glass-card flex items-center justify-between gap-3" style={{ padding: '16px 18px', marginBottom: 16 }}>
        <div>
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px' }}>Two-factor authentication</p>
          <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>Extra layer of security on sign-in</p>
        </div>
        <Toggle value={twoFA} onChange={setTwoFA} />
      </div>

      {/* Password */}
      <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>Change password</p>
      <div className="flex flex-col gap-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Current password', value: currentPass, onChange: setCurrentPass },
          { label: 'New password',     value: newPass,     onChange: setNewPass },
        ].map(({ label, value, onChange }) => (
          <div key={label} className="glass-input flex items-center gap-2" style={{ padding: '12px 14px' }}>
            <Lock size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
            <input type={showPass ? 'text' : 'password'} placeholder={label} value={value} onChange={e => onChange(e.target.value)}
              style={{ fontSize: '13px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
            <button onClick={() => setShowPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              {showPass ? <EyeOff size={14} color="rgba(26,20,16,0.3)" /> : <Eye size={14} color="rgba(26,20,16,0.3)" />}
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={!currentPass || !newPass}
        className="w-full font-work-sans flex items-center justify-center gap-2"
        style={{ background: saved ? 'rgba(45,96,37,0.9)' : (currentPass && newPass) ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(0,0,0,0.06)', color: (currentPass && newPass) || saved ? '#FFFBF5' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: (currentPass && newPass) ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease' }}>
        {saved ? <><Check size={15} />Password updated</> : 'Update password'}
      </button>
    </Sheet>
  )
}

// ── Notifications Sheet ───────────────────────────────────────────
function NotificationsSheet({ onClose }) {
  const [prefs, setPrefs] = useState({
    vendorUpdates: true,
    taskReminders: true,
    crisisAlerts: true,
    guestResponses: true,
    dailyDigest: false,
    marketingEmails: false,
  })
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('notif_enabled') === '1')
  const [saved, setSaved] = useState(false)

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const handleSave = () => { setSaved(true); setTimeout(onClose, 1200) }

  const handlePushToggle = async (val) => {
    if (val) {
      if ('Notification' in window) await Notification.requestPermission()
      localStorage.setItem('notif_enabled', '1')
      localStorage.removeItem('notif_dismissed')
    } else {
      localStorage.removeItem('notif_enabled')
    }
    setPushEnabled(val)
  }

  const rows = [
    { key: 'crisisAlerts',   label: 'Crisis alerts',    sub: 'Urgent issues needing attention', locked: true },
    { key: 'vendorUpdates',  label: 'Vendor updates',   sub: 'Confirmations, changes, at-risk flags' },
    { key: 'taskReminders',  label: 'Task reminders',   sub: 'Due date nudges and overdue alerts' },
    { key: 'guestResponses', label: 'Guest responses',  sub: 'New RSVPs and declines' },
    { key: 'dailyDigest',    label: 'Daily digest',     sub: 'Morning summary of your day' },
    { key: 'marketingEmails',label: 'Tips & updates',   sub: 'Product news and wedding tips' },
  ]

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Notifications</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px' }}>Choose what to hear about</p>

      {/* Push notifications master toggle */}
      <div className="glass-card flex items-center justify-between gap-3"
        style={{ padding: '14px 16px', marginBottom: 16, border: pushEnabled ? '1px solid rgba(122,15,70,0.2)' : '1px solid rgba(0,0,0,0.07)', background: pushEnabled ? 'rgba(122,15,70,0.03)' : undefined }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: '9px', background: pushEnabled ? 'rgba(122,15,70,0.1)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={14} color={pushEnabled ? '#7A0F46' : 'rgba(26,20,16,0.50)'} />
          </div>
          <div>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 1px' }}>Push notifications</p>
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>{pushEnabled ? 'Alerts delivered to your device' : 'Tap to enable device alerts'}</p>
          </div>
        </div>
        <Toggle value={pushEnabled} onChange={handlePushToggle} />
      </div>

      <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>Alert types</p>
      <div className="flex flex-col gap-px" style={{ marginBottom: 24 }}>
        {rows.map((row, i) => (
          <div key={row.key} className="glass-card flex items-center justify-between gap-3"
            style={{ padding: '14px 16px', borderRadius: i === 0 ? '14px 14px 4px 4px' : i === rows.length - 1 ? '4px 4px 14px 14px' : '4px', opacity: row.locked ? 0.7 : 1 }}>
            <div>
              <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: '0 0 1px' }}>{row.label}</p>
              <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>{row.sub}</p>
            </div>
            {row.locked
              ? <Toggle value={true} onChange={() => {}} />
              : <Toggle value={prefs[row.key]} onChange={() => toggle(row.key)} />
            }
          </div>
        ))}
      </div>

      <button onClick={handleSave}
        className="w-full font-work-sans flex items-center justify-center gap-2"
        style={{ background: saved ? 'rgba(45,96,37,0.9)' : 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)', transition: 'background 0.2s ease' }}>
        {saved ? <><Check size={15} />Saved</> : 'Save preferences'}
      </button>
    </Sheet>
  )
}

// ── Help & FAQ Sheet ──────────────────────────────────────────────
const FAQS = [
  { q: 'How do I add more vendors?',          a: 'Go to Vendors → Discover tab and tap any vendor to view and book. You can also use the AI agent to search by category.' },
  { q: 'Can I invite my partner?',            a: 'Yes! Go to your profile and tap the wedding card, or use the agent bar to send an invite link to your partner\'s email.' },
  { q: 'How does the crisis detection work?', a: 'Our AI monitors vendor responses, timeline conflicts, and approaching deadlines. When something needs immediate attention, it surfaces as a crisis card on your home screen.' },
  { q: 'Can I export my guest list?',         a: 'Export as CSV from the Guests screen → upload icon → Export. Google Sheets sync also keeps a live copy.' },
  { q: 'How do I change my wedding date?',    a: 'Tap the "Your Wedding" card on your profile or contact our support team for major changes.' },
]

function HelpSheet({ onClose }) {
  const [open, setOpen] = useState(null)

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Help &amp; FAQ</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px' }}>Common questions &amp; support</p>

      <div className="flex flex-col gap-px" style={{ marginBottom: 24 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderRadius: i === 0 ? '14px 14px 4px 4px' : i === FAQS.length - 1 ? '4px 4px 14px 14px' : '4px', background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 font-work-sans"
              style={{ padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', flex: 1 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} color="rgba(26,20,16,0.4)" />
              </motion.div>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.6)', margin: 0, padding: '0 16px 14px', lineHeight: 1.6 }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button className="w-full flex items-center justify-center gap-2 font-work-sans"
          style={{ background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.2)', color: '#7A0F46', fontSize: '13px', fontWeight: 500, padding: '13px', borderRadius: '12px', cursor: 'pointer' }}>
          <MessageCircle size={14} />Chat with support
        </button>
        <button className="w-full flex items-center justify-center gap-2 font-work-sans"
          style={{ background: 'none', border: '1px solid rgba(0,0,0,0.09)', color: 'rgba(26,20,16,0.55)', fontSize: '13px', fontWeight: 400, padding: '13px', borderRadius: '12px', cursor: 'pointer' }}>
          <FileText size={14} />View documentation <ExternalLink size={11} />
        </button>
      </div>
    </Sheet>
  )
}

// ── Sign Out Confirmation Sheet ───────────────────────────────────
function SignOutSheet({ onClose, onSignOut }) {
  return (
    <Sheet onClose={onClose}>
      <div className="flex flex-col items-center text-center" style={{ paddingBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <LogOut size={22} color="#7A0F46" strokeWidth={1.8} />
        </div>
        <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'center' }}>Sign out?</p>
        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>
          You'll need to sign back in to access your wedding workspace.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button onClick={onSignOut}
            className="w-full font-work-sans flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
            <LogOut size={15} />Sign out
          </button>
          <button onClick={onClose}
            className="w-full font-work-sans"
            style={{ background: 'none', border: 'none', color: 'rgba(26,20,16,0.62)', fontSize: '13px', fontWeight: 400, padding: '12px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </Sheet>
  )
}

// ── API Key Sheet ─────────────────────────────────────────────────
function ApiKeySheet({ onClose }) {
  const stored = localStorage.getItem('sm_anthropic_key') || ''
  const envKey = import.meta.env.VITE_ANTHROPIC_KEY || ''
  const [key, setKey] = useState(stored)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (key.trim()) localStorage.setItem('sm_anthropic_key', key.trim())
    else localStorage.removeItem('sm_anthropic_key')
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  const isActive = envKey || stored

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>AI API key</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px', textAlign: 'center' }}>Powers Mubarak's intelligence</p>

      {envKey ? (
        <div className="glass-card flex items-center gap-3" style={{ padding: '14px 16px', marginBottom: 20, border: '1px solid rgba(45,96,37,0.2)', background: 'rgba(45,96,37,0.04)' }}>
          <Check size={16} color="#2D6025" />
          <div>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#2D6025', margin: '0 0 1px' }}>Key loaded from environment</p>
            <p className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(26,20,16,0.4)', margin: 0 }}>Set via VITE_GEMINI_KEY in .env.local</p>
          </div>
        </div>
      ) : (
        <>
          {!stored && (
            <div className="glass-card flex items-center gap-3" style={{ padding: '14px 16px', marginBottom: 16, border: '1px solid rgba(196,80,30,0.2)', background: 'rgba(196,80,30,0.04)' }}>
              <p className="font-work-sans" style={{ fontSize: '12px', color: '#C4501E', margin: 0 }}>No key found — Mubarak is using fallback responses. Paste your Gemini API key below.</p>
            </div>
          )}
          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px 2px' }}>Gemini API key</p>
          <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: 8 }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={key}
              onChange={e => setKey(e.target.value)}
              style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410' }}
            />
            <button onClick={() => setShow(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              {show ? <EyeOff size={14} color="rgba(26,20,16,0.3)" /> : <Eye size={14} color="rgba(26,20,16,0.3)" />}
            </button>
          </div>
          <p className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(26,20,16,0.4)', margin: '0 0 20px 2px' }}>
            Get your key at console.anthropic.com → API keys
          </p>
          <motion.button onClick={handleSave} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 font-montserrat"
            style={{ background: saved ? 'rgba(45,96,37,0.9)' : 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)', letterSpacing: '0.01em' }}>
            {saved ? <><Check size={15} />Saved</> : 'Save key'}
          </motion.button>
        </>
      )}
    </Sheet>
  )
}

// ── Mubarak Memory Sheet ─────────────────────────────────────────
function MemorySheet({ onClose }) {
  const [enabled, setEnabled]   = useState(isMemoryEnabled)
  const [memories, setMemories] = useState(getMemories)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleToggle = (val) => {
    setMemoryEnabled(val)
    setEnabled(val)
  }

  const handleDelete = (id) => {
    deleteMemory(id)
    setMemories(getMemories())
  }

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return }
    clearMemories()
    setMemories([])
    setConfirmClear(false)
  }

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Mubarak's memory</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px', textAlign: 'center' }}>What Mubarak has learned about your wedding</p>

      {/* Master toggle */}
      <div className="glass-card flex items-center justify-between gap-3"
        style={{ padding: '14px 16px', marginBottom: 20, border: enabled ? '1px solid rgba(122,15,70,0.2)' : '1px solid rgba(0,0,0,0.07)', background: enabled ? 'rgba(122,15,70,0.03)' : undefined }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: '9px', background: enabled ? 'rgba(122,15,70,0.1)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Brain size={14} color={enabled ? '#7A0F46' : 'rgba(26,20,16,0.50)'} />
          </div>
          <div>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 1px' }}>Memory learning</p>
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              {enabled ? 'Mubarak remembers your preferences' : 'Memory is off — Mubarak forgets between sessions'}
            </p>
          </div>
        </div>
        <Toggle value={enabled} onChange={handleToggle} />
      </div>

      {/* Memory list */}
      {memories.length === 0 ? (
        <div className="flex flex-col items-center" style={{ padding: '32px 16px', gap: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(122,15,70,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            <Brain size={20} color="rgba(122,15,70,0.40)" />
          </div>
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.40)', textAlign: 'center', margin: 0 }}>
            {enabled ? 'No memories yet — start chatting with Mubarak' : 'Enable memory learning to get started'}
          </p>
        </div>
      ) : (
        <>
          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>
            {memories.length} stored {memories.length === 1 ? 'fact' : 'facts'}
          </p>
          <div className="flex flex-col gap-2" style={{ marginBottom: 20 }}>
            {memories.map(m => {
              const cat = MEMORY_CATEGORIES[m.category] || MEMORY_CATEGORIES.general
              return (
                <div key={m.id} className="flex items-center gap-3"
                  style={{ padding: '11px 14px', borderRadius: 12, background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <span className="font-work-sans"
                    style={{ fontSize: '10px', fontWeight: 600, color: cat.color, background: cat.bg, padding: '2px 8px', borderRadius: 99, flexShrink: 0, letterSpacing: '0.04em' }}>
                    {cat.label}
                  </span>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#1A1410', margin: 0, flex: 1, lineHeight: 1.4 }}>{m.fact}</p>
                  <button onClick={() => handleDelete(m.id)}
                    style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={11} color="rgba(26,20,16,0.40)" strokeWidth={2.5} />
                  </button>
                </div>
              )
            })}
          </div>

          <button onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 font-work-sans"
            style={{ padding: '13px', borderRadius: 12, border: confirmClear ? '1px solid rgba(196,80,30,0.35)' : '1px solid rgba(0,0,0,0.09)', background: confirmClear ? 'rgba(196,80,30,0.06)' : 'none', color: confirmClear ? '#C4501E' : 'rgba(26,20,16,0.50)', fontSize: '13px', fontWeight: 400, cursor: 'pointer', transition: 'all 0.18s ease' }}>
            <Trash2 size={13} />
            {confirmClear ? 'Tap again to confirm — this cannot be undone' : 'Clear all memories'}
          </button>
        </>
      )}
    </Sheet>
  )
}

// ── Home Screen Widget Sheet ──────────────────────────────────────
function WidgetSheet({ onClose }) {
  const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isAndroid = /android/i.test(navigator.userAgent)
  const platform  = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop'

  const iosSteps = [
    { num: '1', text: 'Open ShaadiMubarak.ai in Safari (not Chrome)' },
    { num: '2', text: 'Tap the Share icon  at the bottom of the screen' },
    { num: '3', text: 'Scroll down and tap "Add to Home Screen"' },
    { num: '4', text: 'Tap "Add" — the app icon will appear on your home screen' },
  ]
  const androidSteps = [
    { num: '1', text: 'Open ShaadiMubarak.ai in Chrome' },
    { num: '2', text: 'Tap the ⋮ menu in the top-right corner' },
    { num: '3', text: 'Tap "Add to Home Screen" or "Install app"' },
    { num: '4', text: 'Tap "Install" — the app icon will appear on your home screen' },
  ]
  const steps = platform === 'ios' ? iosSteps : androidSteps

  return (
    <Sheet onClose={onClose}>
      <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Home screen widget</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px', textAlign: 'center' }}>Add ShaadiMubarak.ai to your phone</p>

      {/* Widget preview */}
      <div style={{ borderRadius: 18, background: 'linear-gradient(145deg, #7A0F46 0%, #5C0B35 100%)', padding: '18px 20px 20px', marginBottom: 24, boxShadow: '0 8px 28px rgba(122,15,70,0.28)' }}>
        <p className="font-cormorant italic" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: '0 0 2px', letterSpacing: '0.02em' }}>ShaadiMubarak.ai</p>
        <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{wedding.couple.bride} &amp; {wedding.couple.groom}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-work-sans" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next ceremony</p>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#FFFBF5', margin: 0 }}>Mehndi · Dec 17</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="font-work-sans" style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1 }}>{wedding.daysAway}</p>
            <p className="font-work-sans" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>days to go</p>
          </div>
        </div>
      </div>

      {/* Platform selector + steps */}
      {platform === 'desktop' ? (
        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 14, padding: '16px 18px' }}>
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            Open ShaadiMubarak.ai on your phone in Safari (iOS) or Chrome (Android) and follow the steps to add it to your home screen.
          </p>
        </div>
      ) : (
        <>
          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>
            {platform === 'ios' ? 'iPhone / iPad' : 'Android'}
          </p>
          <div className="flex flex-col gap-2" style={{ marginBottom: 8 }}>
            {steps.map(step => (
              <div key={step.num} className="flex items-start gap-3"
                style={{ padding: '12px 14px', borderRadius: 12, background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(122,15,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: '#7A0F46' }}>{step.num}</span>
                </div>
                <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: 0, lineHeight: 1.5 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Sheet>
  )
}

// ── Main ─────────────────────────────────────────────────────────
export default function ProfileScreen({ onSignOut }) {
  const navigate = useNavigate()
  const [activeSheet, setActiveSheet] = useState(null)

  const [memoryCount, setMemoryCount] = useState(() => getMemories().length)

  // Refresh memory count when the memory sheet closes
  const handleSheetClose = (sheet) => {
    setActiveSheet(null)
    if (sheet === 'memory') setMemoryCount(getMemories().length)
  }

  const settingsSections = [
    {
      title: 'ACCOUNT',
      rows: [
        { icon: User,   label: 'Personal details',   sub: 'Name, email, phone', sheet: 'personal' },
        { icon: Shield, label: 'Privacy & security', sub: 'Password, 2FA',      sheet: 'security' },
      ],
    },
    {
      title: 'MUBARAK AI',
      rows: [
        {
          icon: Brain,
          label: "Mubarak's memory",
          sub: memoryCount > 0 ? `${memoryCount} learned ${memoryCount === 1 ? 'fact' : 'facts'} about your wedding` : 'Remembers your preferences & decisions',
          sheet: 'memory',
        },
        {
          icon: Sparkles,
          label: 'AI API key',
          sub: (import.meta.env.VITE_ANTHROPIC_KEY || localStorage.getItem('sm_anthropic_key')) ? 'Key configured — Mubarak is active' : 'Tap to configure — required for AI responses',
          sheet: 'apikey',
          alert: !(import.meta.env.VITE_ANTHROPIC_KEY || localStorage.getItem('sm_anthropic_key')),
        },
      ],
    },
    {
      title: 'PREFERENCES',
      rows: [
        { icon: Bell,       label: 'Notifications',        sub: 'Alerts, reminders, push',            sheet: 'notifications' },
        { icon: Smartphone, label: 'Home screen widget',   sub: 'Add ShaadiMubarak.ai to your phone', sheet: 'widget' },
      ],
    },
    {
      title: 'SUPPORT',
      rows: [
        { icon: HelpCircle, label: 'Help & FAQ', sub: 'Common questions & support', sheet: 'help' },
      ],
    },
  ]

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar" style={{ minHeight: 0 }}>
        <StatusBar />
        <motion.div className="flex flex-col gap-6 px-5 pb-6" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="flex items-center mt-2" style={{ position: 'relative', minHeight: '34px' }}>
            <button onClick={() => navigate('/')} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowLeft size={15} color="rgba(26,20,16,0.6)" />
            </button>
            <h1 className="font-work-sans" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '18px', fontWeight: 500, color: '#1A1410', margin: 0, whiteSpace: 'nowrap' }}>Profile</h1>
          </motion.div>

          {/* Avatar + name */}
          <motion.div variants={item} className="glass-card flex items-center gap-4" style={{ padding: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(122,15,70,0.30)' }}>
              <span className="font-cormorant italic" style={{ fontSize: '22px', color: '#FFF', fontWeight: 400 }}>{wedding.couple.bride[0]}</span>
            </div>
            <div>
              <p className="font-work-sans" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px' }}>{wedding.couple.bride} Sharma</p>
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>tarika.jain@gmail.com</p>
            </div>
          </motion.div>

          {/* Wedding summary card */}
          <motion.div variants={item} className="glass-card" style={{ padding: '16px 18px' }}>
            <p className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.14em', margin: '0 0 12px' }}>YOUR WEDDING</p>
            <div className="flex items-center gap-3">
              <div style={{ flex: 1 }}>
                <p className="font-cormorant italic" style={{ fontSize: '20px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', letterSpacing: '-0.01em' }}>{wedding.couple.bride} &amp; {wedding.couple.groom}</p>
                <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>{wedding.venue} · {wedding.date}</p>
              </div>
              <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, border: '1px solid rgba(122,15,70,0.30)', color: '#7A0F46', padding: '4px 12px', borderRadius: '99px', background: 'rgba(122,15,70,0.07)', flexShrink: 0 }}>
                {wedding.daysAway}d
              </span>
            </div>
          </motion.div>

          {/* Settings rows */}
          {settingsSections.map(section => (
            <motion.div key={section.title} variants={item} className="flex flex-col gap-px">
              <p className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.14em', margin: '0 0 8px 2px' }}>{section.title}</p>
              {section.rows.map((row, i) => {
                const Icon = row.icon
                return (
                  <button key={row.label} onClick={() => setActiveSheet(row.sheet)}
                    className="glass-card flex items-center gap-3 w-full text-left"
                    style={{ padding: '14px 16px', cursor: 'pointer', border: 'none', borderRadius: i === 0 && section.rows.length > 1 ? '14px 14px 4px 4px' : i === section.rows.length - 1 && section.rows.length > 1 ? '4px 4px 14px 14px' : section.rows.length === 1 ? '14px' : '4px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="rgba(26,20,16,0.55)" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: '0 0 1px' }}>{row.label}</p>
                      <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>{row.sub}</p>
                    </div>
                    {row.alert && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4501E', flexShrink: 0 }} />}
                    <ChevronRight size={15} color="rgba(26,20,16,0.28)" />
                  </button>
                )
              })}
            </motion.div>
          ))}

          {/* Sign out */}
          <motion.div variants={item}>
            <button onClick={() => setActiveSheet('signout')}
              className="glass-card w-full flex items-center justify-center gap-2 font-work-sans"
              style={{ padding: '14px', border: '1px solid rgba(122,15,70,0.2)', cursor: 'pointer', background: 'rgba(122,15,70,0.04)' }}>
              <LogOut size={15} color="#7A0F46" strokeWidth={1.8} />
              <span style={{ fontSize: '13px', fontWeight: 400, color: '#7A0F46' }}>Sign out</span>
            </button>
          </motion.div>

          <div style={{ height: '160px' }} />
        </motion.div>
      </div>
      <BottomNav />

      {/* Bottom sheets */}
      <AnimatePresence>
        {activeSheet === 'personal'      && <PersonalDetailsSheet onClose={() => handleSheetClose('personal')} />}
        {activeSheet === 'security'      && <SecuritySheet        onClose={() => handleSheetClose('security')} />}
        {activeSheet === 'notifications' && <NotificationsSheet   onClose={() => handleSheetClose('notifications')} />}
        {activeSheet === 'memory'        && <MemorySheet          onClose={() => handleSheetClose('memory')} />}
        {activeSheet === 'apikey'        && <ApiKeySheet          onClose={() => handleSheetClose('apikey')} />}
        {activeSheet === 'widget'        && <WidgetSheet          onClose={() => handleSheetClose('widget')} />}
        {activeSheet === 'help'          && <HelpSheet            onClose={() => handleSheetClose('help')} />}
        {activeSheet === 'signout'       && <SignOutSheet         onClose={() => handleSheetClose('signout')} onSignOut={onSignOut} />}
      </AnimatePresence>
    </div>
  )
}
