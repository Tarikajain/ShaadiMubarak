import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Check, X, Clock, Users, Upload, Sheet, Link2, ChevronDown,
  CheckCircle2, RefreshCw, Phone, MessageSquare, MessageCircle, BookUser,
  Info, Globe, Mail, Shirt, Gift, Heart, Sparkles, ExternalLink, ChevronRight,
  Palette, Wand2, Zap, Search, ArrowLeft,
} from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { guests as mockGuests } from '../data/mockData'
import { useWeddingProfile } from '../hooks/useWeddingProfile'
import { VIBES, DEFAULT_VIBE } from '../data/vibesData'
import { getWeddingProfile } from '../utils/profileUtils'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }
const spring = { type: 'spring', stiffness: 420, damping: 32 }

const FILTERS = ['All', 'Confirmed', 'Pending', 'Declined']

const rsvpConfig = {
  confirmed: { label: 'Confirmed', color: '#2D6025', bg: 'rgba(45,96,37,0.08)',  border: 'rgba(45,96,37,0.22)',  icon: Check },
  pending:   { label: 'Pending',   color: '#A07020', bg: 'rgba(200,151,58,0.1)', border: 'rgba(200,151,58,0.3)', icon: Clock },
  declined:  { label: 'Declined',  color: '#B03A10', bg: 'rgba(122,15,70,0.08)', border: 'rgba(196,80,30,0.22)', icon: X },
}

function RsvpBadge({ status }) {
  const cfg = rsvpConfig[status]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 font-work-sans"
      style={{ fontSize: '10px', fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.04em', flexShrink: 0 }}>
      <Icon size={9} strokeWidth={2.5} />
      {cfg.label}
    </span>
  )
}

function InitialAvatar({ name, side, size = 36 }) {
  const initial = name.charAt(0).toUpperCase()
  const bg   = side === 'bride' ? 'rgba(200,151,58,0.12)' : 'rgba(26,20,16,0.07)'
  const color = side === 'bride' ? '#A07020' : 'rgba(26,20,16,0.62)'
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: bg, border: `1px solid ${side === 'bride' ? 'rgba(200,151,58,0.25)' : 'rgba(0,0,0,0.08)'}` }}>
      <span className="font-work-sans" style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{initial}</span>
    </div>
  )
}

// ─── Guest Action Drawer ──────────────────────────────────────────────────────
function GuestActionDrawer({ guest, onClose, coupleNames, weddingDate, weddingVenue }) {
  const hasPhone = guest.contact && guest.contact.startsWith('+')
  const hasEmail = guest.contact && guest.contact.includes('@')
  const waNumber = hasPhone ? guest.contact.replace(/\D/g, '') : null
  const waInviteMsg = encodeURIComponent(`Hello ${guest.name.split(' ')[0]}! 🎉 You're warmly invited to ${coupleNames}'s wedding on ${weddingDate} at ${weddingVenue}. We would be so happy to have you celebrate with us!`)
  const waAskMsg = encodeURIComponent(`Hi! Do you happen to have ${guest.name}'s phone number? We'd love to reach them for ${coupleNames}'s wedding. Thank you! 🙏`)

  const actions = hasPhone ? [
    { icon: Phone, label: 'Call', sub: guest.contact, color: '#2D6025', bg: 'rgba(45,96,37,0.07)', border: 'rgba(45,96,37,0.20)', onTap: () => window.open(`tel:${guest.contact.replace(/\s/g,'')}`, '_self') },
    { icon: MessageSquare, label: 'Message', sub: 'Send SMS', color: '#1A3A6B', bg: 'rgba(26,58,107,0.07)', border: 'rgba(26,58,107,0.20)', onTap: () => window.open(`sms:${guest.contact.replace(/\s/g,'')}`, '_self') },
    { icon: MessageCircle, label: 'WhatsApp', sub: 'Send invite', color: '#128C7E', bg: 'rgba(18,140,126,0.07)', border: 'rgba(18,140,126,0.20)', onTap: () => window.open(`https://wa.me/${waNumber}?text=${waInviteMsg}`, '_blank') },
  ] : []

  return (
    <>
      <motion.div key="guest-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420 }} />
      <motion.div key="guest-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 40px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
          <InitialAvatar name={guest.name} side={guest.side} size={48} />
          <div className="flex-1 min-w-0">
            <p className="font-work-sans" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px' }}>{guest.name}</p>
            <div className="flex items-center gap-2">
              <RsvpBadge status={guest.rsvp} />
              <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)' }}>{guest.side === 'bride' ? "Bride's side" : "Groom's side"}</span>
            </div>
          </div>
        </div>
        {hasPhone ? (
          <div className="flex flex-col gap-2">
            {actions.map(a => {
              const Icon = a.icon
              return (
                <button key={a.label} onClick={a.onTap} className="flex items-center gap-3 w-full font-work-sans"
                  style={{ padding: '14px 16px', borderRadius: '14px', background: a.bg, border: `1px solid ${a.border}`, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: `1px solid ${a.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={a.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{a.label}</p>
                    <p style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '1px 0 0' }}>{a.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2" style={{ background: 'rgba(200,151,58,0.07)', border: '1px solid rgba(200,151,58,0.25)', borderRadius: '12px', padding: '12px 14px' }}>
              <Info size={14} color="#A07020" style={{ flexShrink: 0, marginTop: 1 }} />
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.5 }}>
                No phone number for <strong style={{ fontWeight: 500, color: '#1A1410' }}>{guest.name}</strong>.{hasEmail && <span> Email: <strong style={{ fontWeight: 400 }}>{guest.contact}</strong></span>}
              </p>
            </div>
            <button onClick={() => window.open(`https://wa.me/?text=${waAskMsg}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 font-work-sans"
              style={{ background: 'rgba(18,140,126,0.1)', border: '1px solid rgba(18,140,126,0.28)', color: '#128C7E', fontSize: '14px', fontWeight: 500, padding: '14px', borderRadius: '14px', cursor: 'pointer' }}>
              <MessageCircle size={16} strokeWidth={1.8} />Ask on WhatsApp
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}

// ─── Contacts Banner ─────────────────────────────────────────────────────────
function ContactsBanner({ onConnect, onDismiss, status }) {
  if (status === 'granted' || status === 'dismissed') return null
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.18)', borderRadius: '12px', padding: '10px 12px' }}>
      <div className="flex items-center gap-2">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookUser size={13} color="#7A0F46" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Connect your contacts</p>
          <p className="font-work-sans truncate" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>Auto-fill phone numbers from your phone</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onConnect} className="font-work-sans"
            style={{ padding: '6px 11px', borderRadius: '8px', background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', border: 'none', fontSize: '11px', fontWeight: 500, color: '#FFFBF5', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Allow
          </button>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: 'rgba(26,20,16,0.3)' }}>
            <X size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── CSV parser ──────────────────────────────────────────────────────────────
function parseCsv(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())
  const nameIdx  = headers.findIndex(h => h.includes('name'))
  const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('contact') || h.includes('phone'))
  const rsvpIdx  = headers.findIndex(h => h.includes('rsvp') || h.includes('status'))
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    const rsvpRaw = (cols[rsvpIdx] || '').toLowerCase()
    return { id: `csv-${Date.now()}-${i}`, name: cols[nameIdx] || cols[0] || 'Unknown', contact: cols[emailIdx] || '', rsvp: rsvpRaw.includes('confirm') ? 'confirmed' : rsvpRaw.includes('declin') ? 'declined' : 'pending', side: 'bride', tier: 'everyone' }
  }).filter(g => g.name && g.name !== 'Unknown')
}

// ─── Import Sheet modal ───────────────────────────────────────────────────────
function ImportModal({ onClose, onImport }) {
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState(null)
  const [count, setCount] = useState(0)
  const processFile = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) { setStatus('error'); return }
    setStatus('parsing')
    const reader = new FileReader()
    reader.onload = (e) => {
      try { const parsed = parseCsv(e.target.result); setCount(parsed.length); setStatus('done'); setTimeout(() => { onImport(parsed); onClose() }, 1200) }
      catch { setStatus('error') }
    }
    reader.readAsText(file)
  }
  return (
    <>
      <motion.div key="imp-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420 }} />
      <motion.div key="imp-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 36px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Import guest list</p>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 22px' }}>Upload a CSV or Excel file. Columns: Name, Contact, RSVP Status</p>
        <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? '#7A0F46' : 'rgba(0,0,0,0.12)'}`, borderRadius: '16px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(122,15,70,0.04)' : 'transparent', transition: 'all 0.18s ease', marginBottom: '14px' }}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
          <AnimatePresence mode="wait">
            {status === null && (<motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Upload size={20} color="#7A0F46" /></div><p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px' }}>Drop your file here</p><p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>or tap to browse · CSV, XLSX, XLS</p></motion.div>)}
            {status === 'parsing' && (<motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 36, height: 36, margin: '0 auto 12px' }}><RefreshCw size={36} color="#7A0F46" /></motion.div><p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: 0 }}>Reading file…</p></motion.div>)}
            {status === 'done' && (<motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><CheckCircle2 size={40} color="#2D6025" style={{ margin: '0 auto 10px', display: 'block' }} /><p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#2D6025', margin: '0 0 2px' }}>{count} guests imported</p></motion.div>)}
            {status === 'error' && (<motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#B03A10', margin: 0 }}>Unsupported file — use CSV or Excel</p></motion.div>)}
          </AnimatePresence>
        </div>
        <p className="font-work-sans text-center" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: 0 }}>Need a template?{' '}<button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500, color: '#7A0F46', padding: 0 }}>Download CSV sample ↓</button></p>
      </motion.div>
    </>
  )
}

// ─── Google Sheets modal ─────────────────────────────────────────────────────
function GoogleSheetsModal({ onClose, onConnect, connected, lastSync }) {
  const [url, setUrl] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const handleConnect = () => {
    if (!url.trim()) return
    setConnecting(true)
    setTimeout(() => { setConnecting(false); onConnect(url); onClose() }, 1400)
  }
  return (
    <>
      <motion.div key="gs-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420 }} />
      <motion.div key="gs-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 36px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(52,168,83,0.1)', border: '1px solid rgba(52,168,83,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sheet size={20} color="#34A853" /></div>
          <div><p className="font-work-sans" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1410', margin: 0 }}>Google Sheets</p><p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Live sync — guests added instantly</p></div>
        </div>
        {connected ? (
          <><div style={{ background: 'rgba(45,96,37,0.06)', border: '1px solid rgba(45,96,37,0.18)', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}><div className="flex items-center gap-2"><div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6025', flexShrink: 0 }} /><span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#2D6025' }}>Connected</span><span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', marginLeft: 'auto' }}>Synced {lastSync}</span></div></div>
          <div className="flex gap-2"><button onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 1500) }} className="flex items-center justify-center gap-2 font-work-sans flex-1" style={{ background: 'rgba(52,168,83,0.08)', border: '1px solid rgba(52,168,83,0.22)', color: '#34A853', fontSize: '13px', fontWeight: 500, padding: '13px', borderRadius: '12px', cursor: 'pointer' }}><motion.div animate={syncing ? { rotate: 360 } : {}} transition={{ duration: 0.8, repeat: syncing ? Infinity : 0, ease: 'linear' }}><RefreshCw size={14} /></motion.div>{syncing ? 'Syncing…' : 'Sync now'}</button><button onClick={onClose} className="font-work-sans flex-1" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Done</button></div></>
        ) : (
          <><p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.6)', margin: '0 0 10px' }}>Paste your Google Sheet link</p>
          <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: '10px' }}><Link2 size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} /><input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/…" style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} /></div>
          <button onClick={handleConnect} disabled={!url.trim() || connecting} className="w-full font-work-sans flex items-center justify-center gap-2"
            style={{ background: url.trim() && !connecting ? 'linear-gradient(135deg, #34A853, #2D8A46)' : 'rgba(0,0,0,0.06)', color: url.trim() && !connecting ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: url.trim() && !connecting ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease' }}>
            {connecting ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><RefreshCw size={15} /></motion.div>Connecting…</>) : (<><Sheet size={15} />Connect Google Sheets</>)}
          </button></>
        )}
      </motion.div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ─── GUEST ASSETS TAB ───────────────────────────────────────────
// ════════════════════════════════════════════════════════════════

const WEBSITE_TEMPLATES = [
  {
    id: 'meera',  name: 'Traditional',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&h=260&q=75',
    accent: '#7A0F46', accentBg: 'rgba(122,15,70,0.08)',
  },
  {
    id: 'zara',   name: 'Modern',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&h=260&q=75',
    accent: '#C45A80', accentBg: 'rgba(196,90,128,0.08)',
  },
  {
    id: 'priya',  name: 'Contemporary',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&h=260&q=75',
    accent: '#2D6025', accentBg: 'rgba(45,96,37,0.08)',
  },
  {
    id: 'ananya', name: 'Royal',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&h=260&q=75',
    accent: '#1A3A6B', accentBg: 'rgba(26,58,107,0.08)',
  },
]


const INVITE_TEMPLATES = [
  { id: 'royal',   name: 'Royal',   gradient: 'linear-gradient(135deg, #7A0F46, #3D0822)', accent: '#7A0F46' },
  { id: 'floral',  name: 'Floral',  gradient: 'linear-gradient(135deg, #F2CADE, #E89AB0)', accent: '#C45A80' },
  { id: 'classic', name: 'Classic', gradient: 'linear-gradient(135deg, #2D2010, #6B4C28)', accent: '#6B4C28' },
]

// ─── Website live-preview mockup ─────────────────────────────────
function WebsitePreviewMock({ templateId }) {
  const t = WEBSITE_TEMPLATES.find(t => t.id === templateId) || WEBSITE_TEMPLATES[0]
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Mock browser chrome */}
      <div style={{ height: 26, background: '#f0eeec', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 5, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{ flex: 1, height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.08)', marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 7.5, color: 'rgba(0,0,0,0.38)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}>ananya-rahul.wedding</span>
        </div>
      </div>
      {/* Website nav */}
      <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, fontWeight: 600, color: t.accent, letterSpacing: '0.02em' }}>A &amp; R</span>
        <div style={{ display: 'flex', gap: 14 }}>
          {['Story', 'Events', 'Photos', 'RSVP'].map(n => (
            <span key={n} style={{ fontSize: 8, fontFamily: 'Inter, sans-serif', color: 'rgba(0,0,0,0.42)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{n}</span>
          ))}
        </div>
      </div>
      {/* Hero */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.4s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.62) 100%)' }} />
        {/* Couple names */}
        <div style={{ position: 'absolute', top: '28%', left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 500, color: '#fff', margin: '0 0 6px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>Ananya &amp; Rahul</p>
          <div style={{ width: 36, height: 1, background: 'rgba(255,255,255,0.5)', margin: '0 auto 10px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>December 19, 2026 · Udaipur</p>
        </div>
        {/* Countdown */}
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24 }}>
          {[['218', 'Days'], ['14', 'Hrs'], ['32', 'Min']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1 }}>{n}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 7.5, color: 'rgba(255,255,255,0.65)', margin: '3px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Below-fold teaser */}
      <div style={{ flexShrink: 0, padding: '12px 20px 10px', textAlign: 'center', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9.5, color: 'rgba(26,20,16,0.45)', margin: 0, lineHeight: 1.55 }}>
          Join us as we begin our forever — Dec 19 at The Leela, Udaipur
        </p>
      </div>
    </div>
  )
}

function TemplatePreviewCard({ t, height }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: Math.max(9, height * 0.16), fontWeight: 600, color: '#fff', letterSpacing: '0.01em' }}>A &amp; R</span>
      </div>
      <div style={{ position: 'absolute', top: 8, left: 8, width: 8, height: 8, borderRadius: '50%', background: t.accent, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

// ─── Full-screen Wedding Website Setup ───────────────────────────
// ─── Website choice drawer (shown before the full setup screen) ──
function WebsiteChoiceDrawer({ onClose, onSelectTemplate, onSelectConnect }) { // zIndex 440/441 — above agent pill (430)
  return (
    <>
      <motion.div key="wcd-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.45)', zIndex: 440 }} />
      <motion.div key="wcd-sh"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 441, padding: '20px 20px 44px' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.10)', margin: '0 auto 20px' }} />
        {/* Header */}
        <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Wedding Website</p>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', textAlign: 'center', margin: '0 0 22px', lineHeight: 1.5 }}>How would you like to get started?</p>
        {/* Choice tiles */}
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button onClick={onSelectTemplate} whileTap={{ scale: 0.97 }}
            className="font-work-sans"
            style={{ flex: 1, borderRadius: 16, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.09)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 14px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={17} color="rgba(26,20,16,0.65)" strokeWidth={1.6} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410', margin: '0 0 3px', lineHeight: 1.2 }}>Create from template</p>
              <p style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: 0, lineHeight: 1.45 }}>Pick a style, Mubarak fills in your details</p>
            </div>
          </motion.button>
          <motion.button onClick={onSelectConnect} whileTap={{ scale: 0.97 }}
            className="font-work-sans"
            style={{ flex: 1, borderRadius: 16, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.09)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 14px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={17} color="rgba(26,20,16,0.65)" strokeWidth={1.6} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410', margin: '0 0 3px', lineHeight: 1.2 }}>Connect existing site</p>
              <p style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: 0, lineHeight: 1.45 }}>Paste your URL — AI still updates it</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

function WeddingWebsiteSetupScreen({ onClose, onSave, onOpenAgent, initialConfig = null, initialMode = null }) {
  const [mode, setMode] = useState(initialMode) // null | 'template' | 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialConfig?.template || WEBSITE_TEMPLATES[0].id
  )
  const [customUrl, setCustomUrl] = useState(initialConfig?.url || '')
  const [connected, setConnected] = useState(!!initialConfig?.url)
  const carouselRef = useRef(null)

  // Hero image: use the profile vibe image (or default)
  const _profile = getWeddingProfile()
  const _vibe = VIBES.find(v => v.id === _profile?.vibe) || DEFAULT_VIBE
  const heroImage = _vibe.img

  // ── Active site view (website already configured) ──────────────
  if (initialConfig) {
    return (
      <motion.div key="ws-active"
        initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 32 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: 'absolute', inset: '0 0 64px 0', background: '#FFFBF5', zIndex: 420, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <StatusBar />
        {/* Header */}
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '10px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '99px', padding: '6px 12px 6px 8px', cursor: 'pointer' }}>
            <ChevronRight size={14} color="rgba(26,20,16,0.65)" strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(26,20,16,0.65)' }}>Guests</span>
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6025', display: 'inline-block' }} />
            <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: '#2D6025' }}>
              {initialConfig.mode === 'template' ? 'Live' : 'Connected'}
            </span>
          </span>
        </div>
        {/* Preview — fills all available space */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {initialConfig.mode === 'template' ? (
            <WebsitePreviewMock templateId={initialConfig.template || WEBSITE_TEMPLATES[0].id} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '32px 28px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link2 size={22} color="#2D6025" strokeWidth={1.6} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 500, color: '#1A1410', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Your site is connected</p>
                <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: 0, lineHeight: 1.6 }}>{initialConfig.url}</p>
              </div>
              <button onClick={onOpenAgent} className="font-work-sans"
                style={{ marginTop: 8, padding: '10px 20px', borderRadius: '99px', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.2)', fontSize: '12px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
                Ask Mubarak to update it →
              </button>
            </div>
          )}
        </div>
        {/* Action buttons */}
        <div style={{ flexShrink: 0, padding: '12px 20px 0', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FFFBF5' }}>
          {/* Secondary row: Change setup + Edit */}
          <div style={{ display: 'flex', gap: 9, marginBottom: 9 }}>
            <button
              onClick={() => { onSave(null); onClose() }}
              className="font-work-sans"
              style={{ flex: 1, padding: '12px', borderRadius: '13px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.09)', fontSize: '13px', fontWeight: 500, color: 'rgba(26,20,16,0.6)', cursor: 'pointer' }}>
              Change setup
            </button>
            <button
              onClick={() => { onClose(); setTimeout(() => onOpenAgent?.('What would you like to change on your wedding website?'), 320) }}
              className="font-work-sans"
              style={{ flex: 1, padding: '12px', borderRadius: '13px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.22)', fontSize: '13px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
              Edit
            </button>
          </div>
          {/* Primary: Preview */}
          <button
            onClick={() => {
              const url = initialConfig.mode === 'custom' && initialConfig.url ? initialConfig.url : 'https://ananya-rahul.wedding'
              window.open(url, '_blank')
            }}
            className="font-montserrat w-full flex items-center justify-center gap-2"
            style={{ padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', boxShadow: '0 6px 20px rgba(122,15,70,0.28)', fontSize: '13px', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none', marginBottom: 80 }}>
            Preview live site →
          </button>
        </div>
      </motion.div>
    )
  }

  const handleTemplateSelect = (id) => setSelectedTemplate(id)

  const handlePersonalise = () => {
    onSave({ mode: 'template', template: selectedTemplate })
    // Open agent in-place — don't close the screen
    if (onOpenAgent) {
      const t = WEBSITE_TEMPLATES.find(t => t.id === selectedTemplate)
      onOpenAgent(`I've picked the ${t?.name || selectedTemplate} template for my wedding website. Help me personalise it with our details.`)
    }
  }

  const handleConnect = () => {
    if (!customUrl.trim()) return
    setConnected(true)
    onSave({ mode: 'custom', url: customUrl })
  }

  const handleAskMubarak = () => {
    onClose()
    if (onOpenAgent) setTimeout(onOpenAgent, 280)
  }

  return (
    <motion.div key="ws-screen"
      initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ position: 'absolute', inset: 0, background: '#FFFBF5', zIndex: 420, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Status bar */}
      <StatusBar />

      {/* Header — only shown when a mode is active (template / custom) */}
      {mode && (
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#FFFBF5', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '99px', padding: '7px 14px 7px 10px', cursor: 'pointer' }}>
            <ChevronRight size={14} color="rgba(26,20,16,0.55)" strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)' }}>Guests</span>
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.30)' }}>·</span>
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: '#1A1410' }}>Wedding Website</span>
          </button>
          <button onClick={() => setMode(null)} className="font-work-sans"
            style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.2)', padding: '5px 11px', borderRadius: '99px', cursor: 'pointer' }}>
            Change
          </button>
        </div>
      )}

      {/* ── NULL state: choose mode ── */}
      <AnimatePresence mode="wait">
        {mode === null && (
          <motion.div key="null-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Preview hero — fixed height, back pill floats inside like vendor detail */}
            <div style={{ flex: '0 0 52%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(26,20,16,0.88) 100%)' }} />
              {/* Back pill — vendor-detail style, floats over hero */}
              <button onClick={onClose}
                style={{ position: 'absolute', top: 12, left: 16, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(26,20,16,0.50)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '99px', padding: '6px 12px 6px 8px', cursor: 'pointer', zIndex: 2 }}>
                <ChevronRight size={14} color="#FFFBF5" strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
                <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#FFFBF5' }}>Guests</span>
              </button>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px', textAlign: 'center' }}>
                <p className="font-cormorant italic" style={{ fontSize: '34px', fontWeight: 500, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Ananya &amp; Rahul</p>
                <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.45)', margin: '0 auto 10px' }} />
                <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>December 19, 2026 · Udaipur</p>
              </div>
            </div>
            {/* Mode choice tiles — horizontal, equal weight */}
            <div style={{ flex: 1, padding: '16px 20px 28px', background: '#FFFBF5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', textAlign: 'center', margin: '0 0 12px' }}>How would you like to set up your website?</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button onClick={() => setMode('template')} whileTap={{ scale: 0.97 }}
                  className="font-work-sans"
                  style={{ flex: 1, borderRadius: '16px', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.09)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '18px 12px' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Palette size={15} color="rgba(26,20,16,0.65)" strokeWidth={1.6} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', lineHeight: 1.25 }}>Build from a template</p>
                    <p style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0, lineHeight: 1.4 }}>Pick a style, Mubarak fills in your details</p>
                  </div>
                </motion.button>
                <motion.button onClick={() => setMode('custom')} whileTap={{ scale: 0.97 }}
                  className="font-work-sans"
                  style={{ flex: 1, borderRadius: '16px', background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.09)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '18px 12px' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link2 size={15} color="rgba(26,20,16,0.65)" strokeWidth={1.6} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', lineHeight: 1.25 }}>Connect your own site</p>
                    <p style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0, lineHeight: 1.4 }}>Paste a URL — AI still updates it</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TEMPLATE mode ── */}
        {mode === 'template' && (
          <motion.div key="template-mode" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Live website preview — fixed height so carousel + button + agent pill all fit */}
            <div style={{ flex: '0 0 260px', padding: '12px 16px 8px', position: 'relative', minHeight: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div key={selectedTemplate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <WebsitePreviewMock templateId={selectedTemplate} />
                </motion.div>
              </AnimatePresence>
              {/* Preview badge */}
              <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,20,16,0.62)', backdropFilter: 'blur(6px)', borderRadius: 99, padding: '4px 11px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>Preview only · edits via Mubarak</span>
              </div>
            </div>

            {/* Template carousel + CTA — fixed panel, leaves room for agent bar pill */}
            <div style={{ flexShrink: 0, background: '#FFFBF5', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 12, paddingBottom: 80 }}>
              {/* Templates label */}
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.45)', letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 9px', paddingLeft: 20 }}>Templates</p>
              {/* Carousel */}
              <div ref={carouselRef}
                style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, paddingLeft: 20, paddingRight: 20, scrollSnapType: 'x mandatory', scrollPaddingLeft: 20, msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="no-scrollbar">
                  {WEBSITE_TEMPLATES.map(t => {
                    const isActive = selectedTemplate === t.id
                    return (
                      <motion.button key={t.id} onClick={() => handleTemplateSelect(t.id)} whileTap={{ scale: 0.96 }}
                        style={{ flexShrink: 0, width: 110, borderRadius: 12, overflow: 'hidden', border: isActive ? `2.5px solid ${t.accent}` : '2px solid rgba(0,0,0,0.07)', cursor: 'pointer', padding: 0, background: 'none', scrollSnapAlign: 'start', boxShadow: isActive ? `0 4px 14px ${t.accentBg}` : '0 1px 6px rgba(0,0,0,0.08)' }}>
                        <div style={{ position: 'relative' }}>
                          <TemplatePreviewCard t={t} height={68} />
                          {isActive && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                              style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.3)', zIndex: 2 }}>
                              <Check size={10} color="#fff" strokeWidth={2.5} />
                            </motion.div>
                          )}
                        </div>
                        <div style={{ padding: '7px 9px 8px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                          <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500, color: isActive ? t.accent : '#1A1410', margin: 0 }}>{t.name}</p>
                        </div>
                      </motion.button>
                    )
                  })}
              </div>

              {/* Personalise CTA */}
              <div style={{ padding: '12px 16px 0' }}>
                <motion.button onClick={handlePersonalise} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2"
                  style={{ padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                  <Wand2 size={15} />
                  Personalise with Mubarak →
                </motion.button>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── CUSTOM / Connect URL mode ── */}
        {mode === 'custom' && (
          <motion.div key="custom-mode" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 40px' }}>
            {/* Icon header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Globe size={28} color="#7A0F46" strokeWidth={1.5} />
              </div>
              <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Connect your website</p>
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', margin: 0, textAlign: 'center', lineHeight: 1.55 }}>
                Paste your wedding website URL below. Mubarak can still push date, venue and RSVP updates directly to it.
              </p>
            </div>

            {/* URL input */}
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>Your website URL</p>
            <div className="glass-input flex items-center gap-2" style={{ padding: '13px 16px', marginBottom: 10 }}>
              <Link2 size={15} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
              <input value={customUrl} onChange={e => { setCustomUrl(e.target.value); setConnected(false) }}
                placeholder="https://ananya-rahul.wedding"
                style={{ fontSize: '13px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
            </div>

            {/* AI sync note */}
            <div style={{ background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.14)', borderRadius: 12, padding: '12px 14px', marginBottom: 24 }}>
              <div className="flex items-start gap-2">
                <Zap size={13} color="#7A0F46" style={{ flexShrink: 0, marginTop: 1 }} />
                <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.6 }}>
                  Mubarak can push event detail updates — date, time, venue — to your connected website via our integration API.
                </p>
              </div>
            </div>

            {/* Connect button */}
            {!connected ? (
              <motion.button onClick={handleConnect} whileTap={{ scale: 0.97 }}
                disabled={!customUrl.trim()}
                className="w-full font-montserrat flex items-center justify-center gap-2"
                style={{ padding: '15px', borderRadius: '14px', background: customUrl.trim() ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(0,0,0,0.07)', color: customUrl.trim() ? '#FFFBF5' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', border: 'none', cursor: customUrl.trim() ? 'pointer' : 'default', boxShadow: customUrl.trim() ? '0 6px 20px rgba(122,15,70,0.28)' : 'none', marginBottom: 12 }}>
                <Globe size={15} />
                Connect website →
              </motion.button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: 'rgba(45,96,37,0.07)', border: '1px solid rgba(45,96,37,0.2)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Check size={15} color="#2D6025" strokeWidth={2.5} />
                  <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025' }}>Website connected successfully</span>
                </div>
                <motion.button onClick={handleAskMubarak} whileTap={{ scale: 0.97 }}
                  className="w-full font-montserrat flex items-center justify-center gap-2"
                  style={{ padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                  <Wand2 size={15} />
                  Ask Mubarak to update details →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav — same as every screen */}
      <BottomNav />
    </motion.div>
  )
}

// ─── Template Picker Sheet (drill-down) ──────────────────────────
function TemplatePickerSheet({ onClose, onSelect, onOpenAgent }) {
  const [selected, setSelected] = useState(null)
  const [launching, setLaunching] = useState(false)

  const handlePersonalise = () => {
    setLaunching(true)
    setTimeout(() => {
      onSelect(selected)
      onClose()
      if (onOpenAgent) onOpenAgent()
    }, 700)
  }

  return (
    <>
      <motion.div key="tpl-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,1)', zIndex: 420}} />
      <motion.div key="tpl-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, maxHeight: '90%', overflowY: 'auto', paddingBottom: 40 }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '20px auto 0' }} />

        {/* Header */}
        <div style={{ padding: '18px 20px 0' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: 0, letterSpacing: '-0.02em' }}>
              Choose a template
            </p>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <X size={14} color="rgba(26,20,16,0.5)" strokeWidth={2} />
            </button>
          </div>
          <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', margin: '0 0 20px', lineHeight: 1.5 }}>
            Pick a style — Mubarak will personalise it with your details.
          </p>
        </div>

        {/* Template cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px', marginBottom: 20 }}>
          {WEBSITE_TEMPLATES.map(t => {
            const isSelected = selected === t.id
            return (
              <motion.button key={t.id} onClick={() => setSelected(t.id)} whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 16, overflow: 'hidden', border: isSelected ? `2px solid ${t.accent}` : '2px solid transparent', cursor: 'pointer', background: 'none', padding: 0, position: 'relative', boxShadow: isSelected ? `0 4px 18px ${t.accentBg}` : '0 1px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}>
                {/* CSS template preview */}
                <div style={{ position: 'relative' }}>
                  <TemplatePreviewCard t={t} height={130} />
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 480, damping: 28 }}
                      style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', zIndex: 2 }}>
                      <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </div>
                {/* Label */}
                <div style={{ padding: '10px 12px 12px', background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{t.name}</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ padding: '0 20px' }}>
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                <div style={{ background: 'rgba(122,15,70,0.05)', border: '1px solid rgba(122,15,70,0.14)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={13} color="#7A0F46" />
                  <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.5 }}>
                    Mubarak will fill in your names, dates and venue automatically.
                  </p>
                </div>
                <motion.button onClick={handlePersonalise} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 font-montserrat"
                  style={{ padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                  <Wand2 size={15} />
                  {launching ? 'Opening Mubarak…' : 'Personalise with Mubarak →'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          {!selected && (
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.40)', textAlign: 'center', margin: 0 }}>
              Select a template above to continue
            </p>
          )}
        </div>
      </motion.div>
    </>
  )
}

// ─── Website / Invite Setup Sheet ────────────────────────────────
// ─── Asset tile config ────────────────────────────────────────────
const CORE_ASSETS = [
  { id: 'website',  label: 'Wedding Website',  icon: Globe,  color: '#7A0F46', iconBg: 'rgba(122,15,70,0.10)', iconBorder: 'rgba(122,15,70,0.20)',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&h=220&q=75' },
  { id: 'invites',  label: 'Digital Invites',  icon: Mail,   color: '#1A3A6B', iconBg: 'rgba(26,58,107,0.10)',  iconBorder: 'rgba(26,58,107,0.20)',
    image: '/images/invites.jpg', bgPosition: 'center 30%' },
  { id: 'registry', label: 'Gift Registry',    icon: Gift,   color: '#2D6025', iconBg: 'rgba(45,96,37,0.10)',   iconBorder: 'rgba(45,96,37,0.20)',
    image: '/images/registry.jpg', bgPosition: 'center 40%' },
  { id: 'wardrobe', label: 'Wardrobe Planner', icon: Shirt,  color: '#7A0F46', iconBg: 'rgba(122,15,70,0.10)',  iconBorder: 'rgba(122,15,70,0.20)',
    image: '/images/wardrobe.jpg', bgPosition: 'center 20%' },
  { id: 'favors',   label: 'Guest Favors',     icon: Heart,  color: '#A07020', iconBg: 'rgba(160,112,32,0.10)', iconBorder: 'rgba(160,112,32,0.22)',
    image: '/images/favors.jpg', bgPosition: 'center center' },
]

function AssetSetupSheet({ type, onClose, onSave, onOpenAgent }) {
  const [mode, setMode] = useState(null) // 'template' | 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customUrl, setCustomUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const label = type === 'website' ? 'Wedding Website' : 'Digital Invites'

  const handleModeSelect = (modeId) => {
    setMode(modeId)
    if (modeId === 'template' && type === 'website') {
      // For website: open the rich template picker drill-down
      setShowTemplatePicker(true)
    }
  }

  const handleSave = () => {
    if (mode === 'custom' && !customUrl.trim()) return
    setSaving(true)
    setTimeout(() => {
      onSave({ mode, template: selectedTemplate, url: customUrl })
      onClose()
    }, 900)
  }

  return (
    <>
      <motion.div key="asset-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420 }} />
      <motion.div key="asset-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 40px', maxHeight: '85%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Set up {label}</p>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 20px' }}>Choose how you want to manage your {type === 'website' ? 'wedding website' : 'digital invites'}.</p>

        {/* Mode toggle */}
        <div className="flex gap-2" style={{ marginBottom: '20px' }}>
          {[
            { id: 'template', label: '✦ Create with templates', desc: 'In-app, instant setup' },
            { id: 'custom',   label: '🔗 Connect your own',     desc: type === 'website' ? 'Existing website URL' : 'Existing invite link' },
          ].map(m => (
            <button key={m.id} onClick={() => handleModeSelect(m.id)} className="flex-1 flex flex-col font-work-sans"
              style={{ padding: '12px 12px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer', border: mode === m.id ? '1.5px solid rgba(122,15,70,0.5)' : '1px solid rgba(0,0,0,0.09)', background: mode === m.id ? 'rgba(122,15,70,0.05)' : 'rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: mode === m.id ? '#7A0F46' : '#1A1410' }}>{m.label}</span>
              <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', marginTop: '2px' }}>{m.desc}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* For website template mode: show a selected template summary (after picker) or prompt to browse */}
          {mode === 'template' && type === 'website' && (
            <motion.div key="tpl-summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {selectedTemplate ? (() => {
                const t = WEBSITE_TEMPLATES.find(t => t.id === selectedTemplate)
                return (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${t.accent}`, marginBottom: 10 }}>
                      <TemplatePreviewCard t={t} height={90} />
                      <div style={{ padding: '10px 12px', background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{t.name}</p>
                        </div>
                        <button onClick={() => setShowTemplatePicker(true)} className="font-work-sans"
                          style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.2)', padding: '5px 10px', borderRadius: '99px', cursor: 'pointer' }}>
                          Change
                        </button>
                      </div>
                    </div>
                    <motion.button onClick={handleSave} whileTap={{ scale: 0.97 }}
                      className="w-full font-montserrat flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                      {saving ? 'Saving…' : 'Launch website →'}
                    </motion.button>
                  </div>
                )
              })() : (
                <motion.button onClick={() => setShowTemplatePicker(true)} whileTap={{ scale: 0.97 }}
                  className="w-full font-work-sans flex items-center justify-center gap-2"
                  style={{ padding: '15px', borderRadius: '14px', background: 'rgba(122,15,70,0.07)', border: '1.5px dashed rgba(122,15,70,0.30)', color: '#7A0F46', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginBottom: 20 }}>
                  <Palette size={14} />
                  Browse templates →
                </motion.button>
              )}
            </motion.div>
          )}

          {/* For invites template mode: inline simple picker (unchanged) */}
          {mode === 'template' && type !== 'website' && (
            <motion.div key="invite-templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Choose a template</p>
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
                {INVITE_TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                    style={{ borderRadius: '14px', overflow: 'hidden', border: selectedTemplate === t.id ? `2px solid ${t.accent}` : '2px solid transparent', cursor: 'pointer', background: 'none', padding: 0, position: 'relative' }}>
                    <div style={{ height: '80px', background: t.gradient }} />
                    <div style={{ padding: '8px 10px', background: '#FFFBF5', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                      <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: '#1A1410' }}>{t.name}</span>
                    </div>
                    {selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedTemplate && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleSave}
                  disabled={saving}
                  className="w-full font-montserrat flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}
                  whileTap={{ scale: 0.97 }}>
                  {saving ? 'Saving…' : 'Activate invites →'}
                </motion.button>
              )}
            </motion.div>
          )}

          {mode === 'custom' && (
            <motion.div key="custom" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>{type === 'website' ? 'Your website URL' : 'Your invite link'}</p>
              <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: '8px' }}>
                <Link2 size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
                <input value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder={type === 'website' ? 'https://ananya-rahul.wedding' : 'https://invite.example.com/ananya-rahul'}
                  style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div style={{ background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.15)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
                <div className="flex items-start gap-2">
                  <Zap size={13} color="#7A0F46" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.55 }}>
                    AI can still push event detail updates (date, time, venue) to your connected {type === 'website' ? 'website' : 'invite'} via our integration API.
                  </p>
                </div>
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleSave}
                disabled={saving || !customUrl.trim()}
                className="w-full font-montserrat flex items-center justify-center gap-2"
                style={{ background: customUrl.trim() ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(0,0,0,0.07)', color: customUrl.trim() ? '#FFFBF5' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: customUrl.trim() ? 'pointer' : 'default', boxShadow: customUrl.trim() ? '0 6px 20px rgba(122,15,70,0.28)' : 'none' }}
                whileTap={{ scale: customUrl.trim() ? 0.97 : 1 }}>
                {saving ? 'Saving…' : type === 'website' ? 'Connect website →' : 'Connect invites →'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Template picker drill-down — stacked above this sheet */}
      <AnimatePresence>
        {showTemplatePicker && (
          <TemplatePickerSheet
            onClose={() => setShowTemplatePicker(false)}
            onSelect={(tplId) => setSelectedTemplate(tplId)}
            onOpenAgent={onOpenAgent}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── AI Sync Panel ────────────────────────────────────────────────
function AiSyncPanel({ entityName, onSync, syncing }) {
  return (
    <div style={{ background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.14)', borderRadius: '12px', padding: '12px 14px' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <Sparkles size={13} color="#7A0F46" style={{ flexShrink: 0, marginTop: 1 }} />
          <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.5 }}>
            Event details changed? Sync your {entityName} with the latest date, time &amp; venue.
          </p>
        </div>
        <motion.button onClick={onSync} whileTap={{ scale: 0.95 }} className="font-work-sans flex-shrink-0"
          style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46', background: 'rgba(122,15,70,0.09)', border: '1px solid rgba(122,15,70,0.22)', padding: '6px 11px', borderRadius: '99px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <motion.div animate={syncing ? { rotate: 360 } : {}} transition={{ duration: 0.8, repeat: syncing ? Infinity : 0, ease: 'linear' }}>
            <Wand2 size={10} />
          </motion.div>
          {syncing ? 'Syncing…' : 'AI Sync'}
        </motion.button>
      </div>
    </div>
  )
}

// ─── Asset Cards ─────────────────────────────────────────────────
function WebsiteCard({ config, onSetup }) {
  const [syncing, setSyncing] = useState(false)
  const handleSync = () => { setSyncing(true); setTimeout(() => setSyncing(false), 2200) }
  const isLive = config?.mode === 'template'
  const isConnected = config?.mode === 'custom'
  const isActive = isLive || isConnected

  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Globe size={16} color="#7A0F46" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Wedding Website</p>
          </div>
        </div>
        {isActive ? (
          <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>
            {isConnected ? 'Connected' : 'Live'}
          </span>
        ) : (
          <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', padding: '3px 8px', borderRadius: '99px' }}>Not set up</span>
        )}
      </div>

      {isActive ? (
        <>
          <div className="flex gap-2" style={{ marginBottom: '10px' }}>
            <button className="flex-1 font-work-sans flex items-center justify-center gap-1.5"
              style={{ padding: '9px', borderRadius: '10px', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.2)', fontSize: '11px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
              <ExternalLink size={11} />Preview
            </button>
            <button onClick={onSetup} className="flex-1 font-work-sans"
              style={{ padding: '9px', borderRadius: '10px', background: 'none', border: '1px solid rgba(0,0,0,0.09)', fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', cursor: 'pointer' }}>
              Change
            </button>
          </div>
          <AiSyncPanel entityName="website" onSync={handleSync} syncing={syncing} />
        </>
      ) : (
        <button onClick={onSetup} className="w-full font-work-sans flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.25)' }}>
          <Palette size={13} />Set up your website
        </button>
      )}
    </div>
  )
}

function InviteCard({ config, onSetup }) {
  const [syncing, setSyncing] = useState(false)
  const handleSync = () => { setSyncing(true); setTimeout(() => setSyncing(false), 2200) }
  const isActive = !!config?.mode

  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(26,58,107,0.08)', border: '1px solid rgba(26,58,107,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={16} color="#1A3A6B" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Digital Invites</p>
          </div>
        </div>
        {isActive ? (
          <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>Active</span>
        ) : (
          <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', padding: '3px 8px', borderRadius: '99px' }}>Not set up</span>
        )}
      </div>
      {isActive ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.5)' }}>Sent to {Math.floor(mockGuests.length * 0.7)} guests</span>
            <button onClick={onSetup} className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Manage →</button>
          </div>
          <AiSyncPanel entityName="invites" onSync={handleSync} syncing={syncing} />
        </>
      ) : (
        <button onClick={onSetup} className="w-full font-work-sans flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #0D2050 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,58,107,0.22)' }}>
          <Mail size={13} />Create invites
        </button>
      )}
    </div>
  )
}

function GiftRegistryCard() {
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState(false)
  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div className="flex items-center gap-3 mb-3">
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Gift size={16} color="#2D6025" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Gift Registry</p>
        </div>
        {saved && <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>Linked</span>}
      </div>
      <div className="glass-input flex items-center gap-2" style={{ padding: '10px 12px', marginBottom: '8px' }}>
        <Link2 size={13} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
        <input value={url} onChange={e => { setUrl(e.target.value); setSaved(false) }} placeholder="amazon.in/registry/… or any registry link"
          style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
        {url.trim() && (
          <button onClick={() => setSaved(true)} className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.1)', border: '1px solid rgba(45,96,37,0.22)', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>Save</button>
        )}
      </div>
      <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', margin: 0 }}>Shared in your wedding website and digital invites</p>
    </div>
  )
}

function WardrobeCard() {
  const ceremonies = ['Mehndi · Dec 17', 'Sangeet · Dec 18', 'Baraat · Dec 19', 'Pheras · Dec 19', 'Reception · Dec 19']
  const [planned, setPlanned] = useState(2)
  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div className="flex items-center gap-3 mb-3">
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shirt size={16} color="#7A0F46" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Wardrobe Planner</p>
          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
            Core family only
          </p>
        </div>
        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', padding: '3px 8px', borderRadius: '99px' }}>{planned}/{ceremonies.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {ceremonies.map((c, i) => (
          <div key={c} className="flex items-center justify-between">
            <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.6)' }}>{c}</span>
            <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: i < planned ? '#2D6025' : 'rgba(200,151,58,0.9)', background: i < planned ? 'rgba(45,96,37,0.07)' : 'rgba(200,151,58,0.08)', border: `1px solid ${i < planned ? 'rgba(45,96,37,0.2)' : 'rgba(200,151,58,0.25)'}`, padding: '2px 8px', borderRadius: '99px' }}>
              {i < planned ? 'Planned' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full font-work-sans" style={{ marginTop: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.18)', fontSize: '12px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
        Plan outfits →
      </button>
    </div>
  )
}

function FavorsCard() {
  const items = [{ name: 'Personalised photo frames', qty: 320, done: true }, { name: 'Mithai boxes', qty: 500, done: true }, { name: 'Mehendi kits for guests', qty: 100, done: false }, { name: 'Thank-you cards', qty: 500, done: false }]
  const doneCount = items.filter(i => i.done).length
  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div className="flex items-center gap-3 mb-3">
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(160,112,32,0.08)', border: '1px solid rgba(160,112,32,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Heart size={16} color="#A07020" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Guest Favors</p>
          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Core family coordination</p>
        </div>
        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: '#A07020', background: 'rgba(200,151,58,0.09)', border: '1px solid rgba(200,151,58,0.25)', padding: '3px 8px', borderRadius: '99px' }}>{doneCount}/{items.length} ready</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: item.done ? '#2D6025' : 'transparent', border: `1.5px solid ${item.done ? '#2D6025' : 'rgba(0,0,0,0.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.done && <Check size={9} color="#FFFFFF" strokeWidth={2.5} />}
            </div>
            <span className="font-work-sans flex-1" style={{ fontSize: '11px', fontWeight: 400, color: item.done ? 'rgba(26,20,16,0.62)' : '#1A1410', textDecoration: item.done ? 'line-through' : 'none' }}>{item.name}</span>
            <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)' }}>×{item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Asset detail sheets ─────────────────────────────────────────

function FavorsSheet({ onClose }) {
  const GUEST_TYPES = ['All guests', "Bride's side", "Groom's side", 'VIP / Core family']
  const [activeType, setActiveType] = useState('All guests')
  const [items, setItems] = useState([
    { name: 'Personalised photo frames', qty: 320, types: ['All guests'] },
    { name: 'Mithai boxes',              qty: 500, types: ['All guests'] },
    { name: 'Mehendi kits',              qty: 100, types: ["Bride's side", 'VIP / Core family'] },
    { name: 'Thank-you cards',           qty: 500, types: ['All guests'] },
  ])
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty]   = useState('')
  const visible = activeType === 'All guests' ? items : items.filter(it => it.types.includes(activeType))

  const toggleType = (item, type) => {
    setItems(prev => prev.map(it => it.name !== item.name ? it : {
      ...it,
      types: it.types.includes(type)
        ? (it.types.length > 1 ? it.types.filter(t => t !== type) : it.types) // keep at least 1
        : [...it.types, type],
    }))
  }
  const addItem = () => {
    if (!newName.trim()) return
    setItems(prev => [...prev, { name: newName.trim(), qty: parseInt(newQty) || 0, types: ['All guests'] }])
    setNewName(''); setNewQty('')
  }

  return (
    <>
      <motion.div key="favors-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420}} />
      <motion.div key="favors-sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 44px', maxHeight: '82%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 18px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(160,112,32,0.10)', border: '1px solid rgba(160,112,32,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Heart size={18} color="#A07020" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0, letterSpacing: '-0.02em' }}>Guest Favors</p>
          </div>
        </div>

        {/* Guest type filter */}
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>Show favors for</p>
        <div className="flex gap-2 flex-wrap" style={{ marginBottom: 16 }}>
          {GUEST_TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(t)} className="font-work-sans"
              style={{ fontSize: '11px', fontWeight: 500, padding: '6px 12px', borderRadius: '99px', cursor: 'pointer', border: activeType === t ? '1px solid rgba(160,112,32,0.5)' : '1px solid rgba(0,0,0,0.09)', background: activeType === t ? 'rgba(160,112,32,0.10)' : 'rgba(0,0,0,0.02)', color: activeType === t ? '#A07020' : 'rgba(26,20,16,0.5)' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Favor items */}
        <div className="flex flex-col gap-2" style={{ marginBottom: 16 }}>
          {visible.map(item => (
            <div key={item.name} className="glass-card" style={{ padding: '12px 14px' }}>
              <div className="flex items-start justify-between gap-2" style={{ marginBottom: activeType === 'All guests' ? 8 : 0 }}>
                <div>
                  <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: '0 0 2px' }}>{item.name}</p>
                  <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', margin: 0 }}>Qty: {item.qty}</p>
                </div>
              </div>
              {activeType === 'All guests' && (
                <div className="flex flex-wrap gap-1.5">
                  {GUEST_TYPES.filter(t => t !== 'All guests').map(t => (
                    <button key={t} onClick={() => toggleType(item, t)} className="font-work-sans"
                      style={{ fontSize: '10px', fontWeight: 500, padding: '3px 9px', borderRadius: '99px', cursor: 'pointer', border: item.types.includes(t) ? '1px solid rgba(160,112,32,0.45)' : '1px solid rgba(0,0,0,0.09)', background: item.types.includes(t) ? 'rgba(160,112,32,0.09)' : 'transparent', color: item.types.includes(t) ? '#A07020' : 'rgba(26,20,16,0.4)' }}>
                      {item.types.includes(t) ? '✓ ' : ''}{t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add favor */}
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>Add favor</p>
        <div className="flex gap-2">
          <div className="glass-input flex-1 flex items-center" style={{ padding: '9px 12px' }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Favor name" onKeyDown={e => e.key === 'Enter' && addItem()}
              style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <div className="glass-input flex items-center" style={{ padding: '9px 12px', width: 72 }}>
            <input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="Qty" type="number"
              style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button onClick={addItem} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(160,112,32,0.10)', border: '1px solid rgba(160,112,32,0.28)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={14} color="#A07020" strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

function WardrobeSheet({ onClose }) {
  const ceremonies = ['Mehndi · Dec 17', 'Sangeet · Dec 18', 'Baraat · Dec 19', 'Pheras · Dec 19', 'Reception · Dec 19']
  const [planned, setPlanned] = useState(2)
  return (
    <>
      <motion.div key="wd-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420}} />
      <motion.div key="wd-sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 44px', maxHeight: '80%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 18px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(122,15,70,0.10)', border: '1px solid rgba(122,15,70,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shirt size={18} color="#7A0F46" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0, letterSpacing: '-0.02em' }}>Wardrobe Planner</p>
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Plan outfits per ceremony for the family</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {ceremonies.map((c, i) => (
            <div key={c} className="glass-card flex items-center justify-between" style={{ padding: '12px 14px' }}>
              <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410' }}>{c}</span>
              <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: i < planned ? '#2D6025' : '#A07020', background: i < planned ? 'rgba(45,96,37,0.08)' : 'rgba(200,151,58,0.09)', border: `1px solid ${i < planned ? 'rgba(45,96,37,0.22)' : 'rgba(200,151,58,0.28)'}`, padding: '3px 9px', borderRadius: '99px' }}>
                {i < planned ? 'Planned' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full font-work-sans" style={{ marginTop: 16, padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg,#7A0F46,#5C0B35)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.25)' }}>
          Plan outfits →
        </button>
      </motion.div>
    </>
  )
}

function RegistrySheet({ onClose }) {
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  return (
    <>
      <motion.div key="rg-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420}} />
      <motion.div key="rg-sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 18px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(45,96,37,0.10)', border: '1px solid rgba(45,96,37,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Gift size={18} color="#2D6025" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0, letterSpacing: '-0.02em' }}>Gift Registry</p>
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Shared via website &amp; digital invites</p>
          </div>
        </div>
        <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: 10 }}>
          <Link2 size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
          <input value={url} onChange={e => { setUrl(e.target.value); setSaved(false) }} placeholder="amazon.in/registry/… or any registry link"
            style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
        </div>
        {url.trim() && !saved && (
          <button onClick={() => setSaved(true)} className="w-full font-work-sans"
            style={{ padding: '13px', borderRadius: '13px', background: 'linear-gradient(135deg,#2D6025,#1e4419)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,96,37,0.25)' }}>
            Save registry link →
          </button>
        )}
        {saved && (
          <div style={{ background: 'rgba(45,96,37,0.07)', border: '1px solid rgba(45,96,37,0.2)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={14} color="#2D6025" strokeWidth={2.5} />
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025' }}>Registry linked — guests will see this on your website &amp; invite</span>
          </div>
        )}
      </motion.div>
    </>
  )
}

function CustomAssetSheet({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  return (
    <>
      <motion.div key="ca-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 420}} />
      <motion.div key="ca-sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 421, padding: '20px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 18px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center' }}>Add custom asset</p>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 20px' }}>Track anything else you're managing for your guests.</p>
        <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 7px' }}>Asset name</p>
        <div className="glass-input flex items-center" style={{ padding: '12px 14px', marginBottom: 14 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Shuttle coordination, Hotel blocks…"
            style={{ fontSize: '13px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
        </div>
        <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 7px' }}>Note (optional)</p>
        <div className="glass-input flex items-center" style={{ padding: '12px 14px', marginBottom: 20 }}>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Brief description"
            style={{ fontSize: '13px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button onClick={() => { if (name.trim()) { onSave({ name: name.trim(), note }); onClose() } }}
          disabled={!name.trim()}
          className="w-full font-work-sans"
          style={{ padding: '15px', borderRadius: '14px', background: name.trim() ? 'linear-gradient(135deg,#7A0F46,#5C0B35)' : 'rgba(0,0,0,0.07)', color: name.trim() ? '#FFFBF5' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', border: 'none', cursor: name.trim() ? 'pointer' : 'default', boxShadow: name.trim() ? '0 6px 20px rgba(122,15,70,0.28)' : 'none' }}>
          Add asset →
        </button>
      </motion.div>
    </>
  )
}

// ─── Full Guest Assets Tab ────────────────────────────────────────
function GuestAssets({ onOpenAgent, onOpenWebsite, websiteConfig }) {
  const [inviteConfig, setInviteConfig]     = useState(null)
  const [openSheet, setOpenSheet]           = useState(null) // 'invites'|'registry'|'wardrobe'|'favors'|'custom'
  const [customAssets, setCustomAssets]     = useState([])

  const getStatus = (id) => {
    if (id === 'website') return websiteConfig ? (websiteConfig.mode === 'template' ? 'Live' : 'Connected') : null
    if (id === 'invites') return inviteConfig ? 'Active' : null
    return null
  }

  const allTiles = [
    ...CORE_ASSETS,
    ...customAssets.map(a => ({ id: `custom_${a.name}`, label: a.name, icon: Sparkles, color: '#7A0F46', iconBg: 'rgba(122,15,70,0.09)', iconBorder: 'rgba(122,15,70,0.20)', tileBg: 'linear-gradient(145deg,rgba(122,15,70,0.08) 0%,rgba(122,15,70,0.02) 100%)', custom: true })),
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>


        {/* 2-column tile grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          {allTiles.map(asset => {
            const Icon = asset.icon
            const status = getStatus(asset.id)
            return (
              <motion.button key={asset.id} onClick={() => asset.id === 'website' ? onOpenWebsite() : setOpenSheet(asset.id)}
                whileTap={{ scale: 0.97 }}
                style={{ position: 'relative', height: 150, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', padding: 0, border: 'none', display: 'block' }}>
                {/* Full-bleed image */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${asset.image})`, backgroundSize: 'cover', backgroundPosition: asset.bgPosition || 'center' }} />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.72) 100%)' }} />
                {/* Status badge */}
                {status && (
                  <span className="font-work-sans" style={{ position: 'absolute', top: 9, right: 9, fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(45,96,37,0.28)', padding: '2px 7px', borderRadius: '99px' }}>{status}</span>
                )}
                {/* Label at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px 13px', textAlign: 'left' }}>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 1px', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.label}</p>
                  <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(255,255,255,0.62)', margin: 0 }}>{status ? 'Tap to manage' : 'Not set up'}</p>
                </div>
              </motion.button>
            )
          })}

          {/* Add custom tile */}
          <motion.button onClick={() => setOpenSheet('custom')} whileTap={{ scale: 0.97 }}
            style={{ background: 'transparent', border: '1.5px dashed rgba(122,15,70,0.25)', borderRadius: 16, padding: '22px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 130 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, lineHeight: 1, color: '#7A0F46', fontWeight: 400 }}>+</span>
            </div>
            <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#7A0F46', margin: 0, textAlign: 'center' }}>Add custom</p>
          </motion.button>
        </div>

        <div style={{ height: '140px' }} />
      </motion.div>

      {/* Sheets */}
      <AnimatePresence>
        {openSheet === 'invites' && (
          <AssetSetupSheet
            type="invite"
            onClose={() => setOpenSheet(null)}
            onSave={(cfg) => setInviteConfig(cfg)}
            onOpenAgent={onOpenAgent}
          />
        )}
        {openSheet === 'registry' && <RegistrySheet onClose={() => setOpenSheet(null)} />}
        {openSheet === 'wardrobe' && <WardrobeSheet onClose={() => setOpenSheet(null)} />}
        {openSheet === 'favors'   && <FavorsSheet   onClose={() => setOpenSheet(null)} />}
        {openSheet === 'custom'   && <CustomAssetSheet onClose={() => setOpenSheet(null)} onSave={(a) => setCustomAssets(prev => [...prev, a])} />}
      </AnimatePresence>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ─── MAIN SCREEN ────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export default function GuestsScreen({ guests: guestsProp, setGuests: setGuestsProp, onOpenAgent }) {
  const wp = useWeddingProfile()
  const [mainTab, setMainTab]             = useState('list') // 'list' | 'assets'
  const [showWebsiteChoice, setShowWebsiteChoice] = useState(false)
  const [websiteInitialMode, setWebsiteInitialMode] = useState(null)
  const [showWebsiteSetup, setShowWebsiteSetup] = useState(false)
  const [websiteConfig, setWebsiteConfig]       = useState(null)
  const [filter, setFilter]               = useState('All')
  const [sideFilter, setSideFilter]       = useState('All') // 'All' | 'bride' | 'groom'
  const [search, setSearch]               = useState('')
  const [searchOpen, setSearchOpen]       = useState(false)
  const [showRsvpDrop, setShowRsvpDrop]   = useState(false)
  const [showSideDrop, setShowSideDrop]   = useState(false)
  const [showUploadDrop, setShowUploadDrop] = useState(false)
  // Use external state if provided (from AgentBar mutations), otherwise fall back to local
  const [localGuestList, setLocalGuestList] = useState(() => guestsProp && guestsProp.length > 0 ? guestsProp : mockGuests)
  const guestList    = guestsProp     ?? localGuestList
  const setGuestList = setGuestsProp  ?? setLocalGuestList
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [showImport, setShowImport]       = useState(false)
  const [showGoogleSheets, setShowGoogleSheets] = useState(false)
  const [googleConnected, setGoogleConnected]   = useState(false)
  const [lastSync, setLastSync]           = useState(null)
  const [importBanner, setImportBanner]   = useState(null)
  const [contactsStatus, setContactsStatus] = useState('idle')

  const anyOverlayOpen = showWebsiteChoice || showWebsiteSetup || showImport || showGoogleSheets || !!selectedGuest
  useEffect(() => {
    window.dispatchEvent(new Event(anyOverlayOpen ? 'sm_overlay_open' : 'sm_overlay_close'))
    return () => { window.dispatchEvent(new Event('sm_overlay_close')) }
  }, [anyOverlayOpen])

  const closeDropdowns = () => { setShowRsvpDrop(false); setShowSideDrop(false); setShowUploadDrop(false) }

  const coupleNames = `${wp.bride} & ${wp.groom}`
  const sideFiltered   = sideFilter === 'All' ? guestList : guestList.filter(g => g.side === sideFilter)
  const searchFiltered = search.trim()
    ? sideFiltered.filter(g => {
        const q = search.trim().toLowerCase()
        const nameMatch = g.name.toLowerCase().split(/\s+/).some(word => word.startsWith(q))
        const contactMatch = g.contact && g.contact.toLowerCase().startsWith(q)
        return nameMatch || contactMatch
      })
    : sideFiltered
  const filtered   = filter === 'All' ? searchFiltered : searchFiltered.filter(g => g.rsvp === filter.toLowerCase())
  const confirmed  = sideFiltered.filter(g => g.rsvp === 'confirmed')
  const pending    = sideFiltered.filter(g => g.rsvp === 'pending')
  const declined   = sideFiltered.filter(g => g.rsvp === 'declined')

  const handleImport = (newGuests) => {
    setGuestList(prev => [...prev, ...newGuests])
    setImportBanner(`${newGuests.length} guests imported`)
    setTimeout(() => setImportBanner(null), 3500)
  }
  const handleGoogleConnect = () => {
    setGoogleConnected(true); setLastSync('just now')
    setImportBanner('Google Sheets connected — syncing live')
    setTimeout(() => setImportBanner(null), 3500)
  }
  const handleContactsConnect = useCallback(async () => {
    if ('contacts' in navigator && navigator.contacts) {
      try {
        const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true })
        setGuestList(prev => prev.map(g => {
          if (g.contact) return g
          const match = contacts.find(c => c.name?.some(n => n.toLowerCase().includes(g.name.split(' ')[0].toLowerCase())))
          if (!match) return g
          return { ...g, contact: match.tel?.[0] || match.email?.[0] || g.contact, contactSource: 'contacts' }
        }))
        setContactsStatus('granted')
        setImportBanner('Contacts synced — phone numbers added where matched')
        setTimeout(() => setImportBanner(null), 4000)
      } catch (err) { if (err.name !== 'AbortError') setContactsStatus('unavailable') }
    } else {
      setContactsStatus('unavailable')
      setImportBanner('Contacts access is available on mobile browsers')
      setTimeout(() => setImportBanner(null), 4500)
    }
  }, [])

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-4 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 500, lineHeight: 1.05, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Guests</h1>
            <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              {guestList.length} invited · {guestList.filter(g => g.rsvp === 'confirmed').length} confirmed
            </p>
          </motion.div>

          {/* ── Main tab toggle: Guest List / Guest Assets ── */}
          <motion.div variants={item} className="relative flex" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '3px' }}>
            {[{ id: 'list', label: 'Guest List' }, { id: 'assets', label: 'Guest Assets' }].map(t => (
              <button key={t.id} onClick={() => setMainTab(t.id)}
                className="relative flex-1 font-work-sans"
                style={{ fontSize: '13px', fontWeight: 500, color: mainTab === t.id ? '#1A1410' : 'rgba(26,20,16,0.58)', padding: '9px 0', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '10px', zIndex: 1 }}>
                {mainTab === t.id && (
                  <motion.div layoutId="guests-main-tab" transition={spring}
                    style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: '#FFFBF5', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', zIndex: -1 }} />
                )}
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* ── TAB CONTENT ── */}
          <AnimatePresence mode="wait">

            {/* ─── GUEST LIST TAB ─────────────────────────────────── */}
            {mainTab === 'list' && (
              <motion.div key="list" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}
                className="flex flex-col gap-4">

                {/* Combined search + filter row */}
                <div className="flex items-center gap-2">

                  {/* Search — icon that expands to full input */}
                  {/* Search — expands to ~120px, filters stay visible */}
                  <motion.div
                    animate={{ width: searchOpen ? 116 : 36, flexShrink: searchOpen ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={searchOpen ? 'glass-input' : ''}
                    style={{
                      overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6, flexShrink: searchOpen ? 1 : 0, minWidth: searchOpen ? 60 : 36,
                      ...(searchOpen
                        ? { padding: '8px 10px', height: 36 }
                        : { width: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(0,0,0,0.09)', background: 'rgba(0,0,0,0.02)', cursor: 'pointer', justifyContent: 'center' }
                      ),
                    }}
                    onClick={!searchOpen ? () => setSearchOpen(true) : undefined}
                  >
                    {searchOpen ? (
                      <>
                        <input
                          autoFocus
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search…"
                          style={{ fontSize: '12px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif', minWidth: 0 }}
                        />
                        {/* Single X: clears text if present, collapses search if empty */}
                        <button
                          onClick={() => search ? setSearch('') : (setSearchOpen(false))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                          <X size={12} color="rgba(26,20,16,0.50)" />
                        </button>
                      </>
                    ) : (
                      <Search size={14} color="rgba(26,20,16,0.62)" />
                    )}
                  </motion.div>

                  {/* Filters — always visible */}
                  <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>

                  {/* RSVP status dropdown */}
                  <div className="relative flex-1" style={{ minWidth: 0 }}>
                    <button onClick={() => { setShowRsvpDrop(v => !v); setShowSideDrop(false); setShowUploadDrop(false) }}
                      className="w-full flex items-center justify-between gap-1.5 font-work-sans"
                      style={{ fontSize: '11px', fontWeight: 500, padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s ease',
                        border: filter !== 'All' ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)',
                        background: filter !== 'All' ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                        color: filter !== 'All' ? '#7A0F46' : 'rgba(26,20,16,0.55)',
                      }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filter === 'All' ? 'All' : filter}</span>
                      <ChevronDown size={11} style={{ flexShrink: 0, transition: 'transform 0.18s', transform: showRsvpDrop ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>
                    <AnimatePresence>
                      {showRsvpDrop && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setShowRsvpDrop(false)} />
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}
                            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 21, overflow: 'hidden' }}>
                            {[
                              { label: 'All',       count: sideFiltered.length },
                              { label: 'Confirmed', count: confirmed.length },
                              { label: 'Pending',   count: pending.length },
                              { label: 'Declined',  count: declined.length },
                            ].map(({ label, count }) => (
                              <button key={label} onClick={() => { setFilter(label); setShowRsvpDrop(false) }}
                                className="w-full flex items-center justify-between font-work-sans"
                                style={{ padding: '10px 14px', background: filter === label ? 'rgba(122,15,70,0.06)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '12px', fontWeight: filter === label ? 500 : 300, color: filter === label ? '#7A0F46' : '#1A1410' }}>{label === 'All' ? 'All statuses' : label}</span>
                                <span style={{ fontSize: '10px', fontWeight: 600, color: filter === label ? '#7A0F46' : 'rgba(26,20,16,0.3)', background: filter === label ? 'rgba(122,15,70,0.1)' : 'rgba(0,0,0,0.05)', padding: '1px 7px', borderRadius: '99px' }}>{count}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Side dropdown */}
                  <div className="relative flex-1" style={{ minWidth: 0 }}>
                    <button onClick={() => { setShowSideDrop(v => !v); setShowRsvpDrop(false); setShowUploadDrop(false) }}
                      className="w-full flex items-center justify-between gap-1.5 font-work-sans"
                      style={{ fontSize: '11px', fontWeight: 500, padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s ease',
                        border: sideFilter !== 'All' ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)',
                        background: sideFilter !== 'All' ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                        color: sideFilter !== 'All' ? '#7A0F46' : 'rgba(26,20,16,0.55)',
                      }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sideFilter === 'All' ? 'Both sides' : sideFilter === 'bride' ? `${wp.bride}'s` : `${wp.groom}'s`}
                      </span>
                      <ChevronDown size={11} style={{ flexShrink: 0, transition: 'transform 0.18s', transform: showSideDrop ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>
                    <AnimatePresence>
                      {showSideDrop && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setShowSideDrop(false)} />
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}
                            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 21, overflow: 'hidden' }}>
                            {[
                              { key: 'All',   label: 'Both sides',             count: guestList.length },
                              { key: 'bride', label: `${wp.bride}'s side`, count: guestList.filter(g => g.side === 'bride').length },
                              { key: 'groom', label: `${wp.groom}'s side`, count: guestList.filter(g => g.side === 'groom').length },
                            ].map(({ key, label, count }) => (
                              <button key={key} onClick={() => { setSideFilter(key); setFilter('All'); setShowSideDrop(false) }}
                                className="w-full flex items-center justify-between font-work-sans"
                                style={{ padding: '10px 14px', background: sideFilter === key ? 'rgba(122,15,70,0.06)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '12px', fontWeight: sideFilter === key ? 500 : 300, color: sideFilter === key ? '#7A0F46' : '#1A1410' }}>{label}</span>
                                <span style={{ fontSize: '10px', fontWeight: 600, color: sideFilter === key ? '#7A0F46' : 'rgba(26,20,16,0.3)', background: sideFilter === key ? 'rgba(122,15,70,0.1)' : 'rgba(0,0,0,0.05)', padding: '1px 7px', borderRadius: '99px' }}>{count}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Upload icon button */}
                  <div className="relative">
                    <button onClick={() => { setShowUploadDrop(v => !v); setShowRsvpDrop(false); setShowSideDrop(false) }}
                      style={{ width: 36, height: 36, borderRadius: '10px', border: showUploadDrop ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)', background: showUploadDrop ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s ease' }}>
                      <Upload size={14} color={showUploadDrop ? '#7A0F46' : 'rgba(26,20,16,0.62)'} />
                    </button>
                    <AnimatePresence>
                      {showUploadDrop && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setShowUploadDrop(false)} />
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}
                            style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '168px', background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 21, overflow: 'hidden' }}>
                            <button onClick={() => { setShowImport(true); setShowUploadDrop(false) }}
                              className="w-full flex items-center gap-2.5 font-work-sans"
                              style={{ padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Upload size={12} color="#7A0F46" />
                              </div>
                              <div>
                                <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Import file</p>
                                <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>CSV or Excel</p>
                              </div>
                            </button>
                            <button onClick={() => { setShowGoogleSheets(true); setShowUploadDrop(false) }}
                              className="w-full flex items-center gap-2.5 font-work-sans"
                              style={{ padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(52,168,83,0.1)', border: '1px solid rgba(52,168,83,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Sheet size={12} color="#34A853" />
                              </div>
                              <div>
                                <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Google Sheets</p>
                                <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: googleConnected ? '#34A853' : 'rgba(26,20,16,0.4)', margin: 0 }}>{googleConnected ? `Synced ${lastSync}` : 'Live sync'}</p>
                              </div>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>{/* end upload relative */}

                  </div>{/* end filters flex */}

                </div>{/* end combined row */}

                {/* Contacts banner */}
                <AnimatePresence>
                  {contactsStatus === 'idle' && <ContactsBanner onConnect={handleContactsConnect} onDismiss={() => setContactsStatus('dismissed')} status={contactsStatus} />}
                </AnimatePresence>

                {/* Import success banner */}
                <AnimatePresence>
                  {importBanner && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.2)', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="#2D6025" style={{ flexShrink: 0 }} />
                      <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025' }}>{importBanner}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pending nudge */}
                {pending.length > 0 && (
                  <div className="glass-alert flex items-center gap-3" style={{ padding: '13px 16px' }}>
                    <Clock size={14} color="#B03A10" style={{ flexShrink: 0 }} />
                    <p className="font-work-sans flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.75)', margin: 0 }}>
                      <span style={{ color: '#B03A10', fontWeight: 600 }}>{pending.length} guests</span> haven't responded yet
                    </p>
                    <button className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#B03A10', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(196,80,30,0.22)', padding: '4px 10px', borderRadius: '99px', cursor: 'pointer', flexShrink: 0 }}>Nudge all</button>
                  </div>
                )}

                {/* Guest list — grouped by side when "All" selected */}
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {sideFilter === 'All' ? (
                      ['bride', 'groom'].map(side => {
                        const sideGuests = filtered.filter(g => g.side === side)
                        if (sideGuests.length === 0) return null
                        const sideLabel = side === 'bride' ? `${wp.bride}'s Side` : `${wp.groom}'s Side`
                        return (
                          <motion.div key={side} layout className="flex flex-col gap-2">
                            {/* Section header */}
                            <div className="flex items-center gap-3" style={{ marginTop: side === 'groom' ? '6px' : '0' }}>
                              <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                {sideLabel}
                              </span>
                              <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
                              <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.28)', letterSpacing: '0.04em' }}>{sideGuests.length}</span>
                            </div>
                            {/* Guests */}
                            {sideGuests.map(guest => (
                              <motion.button key={guest.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                                transition={spring} onClick={() => setSelectedGuest(guest)}
                                className="glass-card flex items-center gap-3 w-full text-left"
                                style={{ padding: '13px 16px', cursor: 'pointer', border: 'none' }} whileTap={{ scale: 0.985 }}>
                                <InitialAvatar name={guest.name} side={guest.side} />
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{guest.name}</span>
                                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '1px' }}>
                                    <span className="font-work-sans truncate" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.54)' }}>
                                      {guest.contact ? (guest.contactSource === 'contacts' ? `📱 ${guest.contact}` : guest.contact) : <span style={{ color: 'rgba(200,151,58,0.8)', fontWeight: 400 }}>No contact info</span>}
                                    </span>
                                    {guest.ceremony && (
                                      <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', borderRadius: 99, padding: '1px 6px', flexShrink: 0 }}>
                                        {guest.ceremony}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <RsvpBadge status={guest.rsvp} />
                              </motion.button>
                            ))}
                          </motion.div>
                        )
                      })
                    ) : (
                      filtered.map(guest => (
                        <motion.button key={guest.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                          transition={spring} onClick={() => setSelectedGuest(guest)}
                          className="glass-card flex items-center gap-3 w-full text-left"
                          style={{ padding: '13px 16px', cursor: 'pointer', border: 'none' }} whileTap={{ scale: 0.985 }}>
                          <InitialAvatar name={guest.name} side={guest.side} />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{guest.name}</span>
                            <span className="font-work-sans truncate" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', marginTop: '1px' }}>
                              {guest.contact ? (guest.contactSource === 'contacts' ? `📱 ${guest.contact}` : guest.contact) : <span style={{ color: 'rgba(200,151,58,0.8)', fontWeight: 400 }}>No contact info</span>}
                            </span>
                          </div>
                          <RsvpBadge status={guest.rsvp} />
                        </motion.button>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Invite CTA */}
                <button className="w-full flex items-center justify-center gap-2 font-work-sans"
                  style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                  <UserPlus size={15} />Invite guests
                </button>

                <div style={{ height: '140px' }} />
              </motion.div>
            )}

            {/* ─── GUEST ASSETS TAB ───────────────────────────────── */}
            {mainTab === 'assets' && (
              <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                <GuestAssets onOpenAgent={onOpenAgent} onOpenWebsite={() => websiteConfig ? setShowWebsiteSetup(true) : setShowWebsiteChoice(true)} websiteConfig={websiteConfig} />
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      <BottomNav />

      {/* Modals */}
      <AnimatePresence>
        {selectedGuest && (
          <GuestActionDrawer guest={selectedGuest} onClose={() => setSelectedGuest(null)}
            coupleNames={coupleNames} weddingDate={wp.date} weddingVenue={wp.venue} />
        )}
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
        {showGoogleSheets && (
          <GoogleSheetsModal onClose={() => setShowGoogleSheets(false)} onConnect={handleGoogleConnect} connected={googleConnected} lastSync={lastSync} />
        )}
        {showWebsiteChoice && (
          <WebsiteChoiceDrawer
            onClose={() => setShowWebsiteChoice(false)}
            onSelectTemplate={() => {
              setShowWebsiteChoice(false)
              setWebsiteInitialMode('template')
              setShowWebsiteSetup(true)
            }}
            onSelectConnect={() => {
              setShowWebsiteChoice(false)
              setWebsiteInitialMode('custom')
              setShowWebsiteSetup(true)
            }}
          />
        )}
        {showWebsiteSetup && (
          <WeddingWebsiteSetupScreen
            onClose={() => { setShowWebsiteSetup(false); setWebsiteInitialMode(null) }}
            onSave={(cfg) => setWebsiteConfig(cfg)}
            onOpenAgent={onOpenAgent}
            initialConfig={websiteConfig}
            initialMode={websiteInitialMode}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
