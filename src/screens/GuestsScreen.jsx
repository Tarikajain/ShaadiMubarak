import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Check, X, Clock, Users, Upload, Sheet, Link2, ChevronDown,
  CheckCircle2, RefreshCw, Phone, MessageSquare, MessageCircle, BookUser,
  Info, Globe, Mail, Shirt, Gift, Heart, Sparkles, ExternalLink, ChevronRight,
  Palette, Wand2, Zap, Search,
} from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { guests as mockGuests, wedding } from '../data/mockData'

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
    <span className="inline-flex items-center gap-1 font-outfit"
      style={{ fontSize: '10px', fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.04em', flexShrink: 0 }}>
      <Icon size={9} strokeWidth={2.5} />
      {cfg.label}
    </span>
  )
}

function InitialAvatar({ name, side, size = 36 }) {
  const initial = name.charAt(0).toUpperCase()
  const bg   = side === 'bride' ? 'rgba(200,151,58,0.12)' : 'rgba(26,20,16,0.07)'
  const color = side === 'bride' ? '#A07020' : 'rgba(26,20,16,0.45)'
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: bg, border: `1px solid ${side === 'bride' ? 'rgba(200,151,58,0.25)' : 'rgba(0,0,0,0.08)'}` }}>
      <span className="font-outfit" style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{initial}</span>
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
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.35)', zIndex: 55 }} />
      <motion.div key="guest-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 60, padding: '20px 20px 40px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
          <InitialAvatar name={guest.name} side={guest.side} size={48} />
          <div className="flex-1 min-w-0">
            <p className="font-outfit" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px' }}>{guest.name}</p>
            <div className="flex items-center gap-2">
              <RsvpBadge status={guest.rsvp} />
              <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.35)' }}>{guest.side === 'bride' ? "Bride's side" : "Groom's side"}</span>
            </div>
          </div>
        </div>
        {hasPhone ? (
          <div className="flex flex-col gap-2">
            {actions.map(a => {
              const Icon = a.icon
              return (
                <button key={a.label} onClick={a.onTap} className="flex items-center gap-3 w-full font-outfit"
                  style={{ padding: '14px 16px', borderRadius: '14px', background: a.bg, border: `1px solid ${a.border}`, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: `1px solid ${a.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={a.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{a.label}</p>
                    <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: '1px 0 0' }}>{a.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2" style={{ background: 'rgba(200,151,58,0.07)', border: '1px solid rgba(200,151,58,0.25)', borderRadius: '12px', padding: '12px 14px' }}>
              <Info size={14} color="#A07020" style={{ flexShrink: 0, marginTop: 1 }} />
              <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.5 }}>
                No phone number for <strong style={{ fontWeight: 500, color: '#1A1410' }}>{guest.name}</strong>.{hasEmail && <span> Email: <strong style={{ fontWeight: 400 }}>{guest.contact}</strong></span>}
              </p>
            </div>
            <button onClick={() => window.open(`https://wa.me/?text=${waAskMsg}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 font-outfit"
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
          <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Connect your contacts</p>
          <p className="font-outfit truncate" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>Auto-fill phone numbers from your phone</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onConnect} className="font-outfit"
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
      <motion.div key="imp-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.35)', zIndex: 55 }} />
      <motion.div key="imp-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 60, padding: '20px 20px 36px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 300, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Import guest list</p>
        <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: '0 0 22px' }}>Upload a CSV or Excel file. Columns: Name, Contact, RSVP Status</p>
        <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? '#7A0F46' : 'rgba(0,0,0,0.12)'}`, borderRadius: '16px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(122,15,70,0.04)' : 'transparent', transition: 'all 0.18s ease', marginBottom: '14px' }}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
          <AnimatePresence mode="wait">
            {status === null && (<motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Upload size={20} color="#7A0F46" /></div><p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px' }}>Drop your file here</p><p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>or tap to browse · CSV, XLSX, XLS</p></motion.div>)}
            {status === 'parsing' && (<motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 36, height: 36, margin: '0 auto 12px' }}><RefreshCw size={36} color="#7A0F46" /></motion.div><p className="font-outfit" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: 0 }}>Reading file…</p></motion.div>)}
            {status === 'done' && (<motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><CheckCircle2 size={40} color="#2D6025" style={{ margin: '0 auto 10px', display: 'block' }} /><p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#2D6025', margin: '0 0 2px' }}>{count} guests imported</p></motion.div>)}
            {status === 'error' && (<motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#B03A10', margin: 0 }}>Unsupported file — use CSV or Excel</p></motion.div>)}
          </AnimatePresence>
        </div>
        <p className="font-outfit text-center" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.35)', margin: 0 }}>Need a template?{' '}<button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500, color: '#7A0F46', padding: 0 }}>Download CSV sample ↓</button></p>
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
      <motion.div key="gs-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.35)', zIndex: 55 }} />
      <motion.div key="gs-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 60, padding: '20px 20px 36px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(52,168,83,0.1)', border: '1px solid rgba(52,168,83,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sheet size={20} color="#34A853" /></div>
          <div><p className="font-outfit" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1410', margin: 0 }}>Google Sheets</p><p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Live sync — guests added instantly</p></div>
        </div>
        {connected ? (
          <><div style={{ background: 'rgba(45,96,37,0.06)', border: '1px solid rgba(45,96,37,0.18)', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}><div className="flex items-center gap-2"><div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6025', flexShrink: 0 }} /><span className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#2D6025' }}>Connected</span><span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.35)', marginLeft: 'auto' }}>Synced {lastSync}</span></div></div>
          <div className="flex gap-2"><button onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 1500) }} className="flex items-center justify-center gap-2 font-outfit flex-1" style={{ background: 'rgba(52,168,83,0.08)', border: '1px solid rgba(52,168,83,0.22)', color: '#34A853', fontSize: '13px', fontWeight: 500, padding: '13px', borderRadius: '12px', cursor: 'pointer' }}><motion.div animate={syncing ? { rotate: 360 } : {}} transition={{ duration: 0.8, repeat: syncing ? Infinity : 0, ease: 'linear' }}><RefreshCw size={14} /></motion.div>{syncing ? 'Syncing…' : 'Sync now'}</button><button onClick={onClose} className="font-outfit flex-1" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 500, padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Done</button></div></>
        ) : (
          <><p className="font-outfit" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.6)', margin: '0 0 10px' }}>Paste your Google Sheet link</p>
          <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: '10px' }}><Link2 size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} /><input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/…" style={{ fontSize: '12px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }} /></div>
          <button onClick={handleConnect} disabled={!url.trim() || connecting} className="w-full font-outfit flex items-center justify-center gap-2"
            style={{ background: url.trim() && !connecting ? 'linear-gradient(135deg, #34A853, #2D8A46)' : 'rgba(0,0,0,0.06)', color: url.trim() && !connecting ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: url.trim() && !connecting ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease' }}>
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
  { id: 'bloom',   name: 'Bloom',   gradient: 'linear-gradient(135deg, #F0D5E5, #CDA0C0)', accent: '#7A0F46' },
  { id: 'golden',  name: 'Golden',  gradient: 'linear-gradient(135deg, #F5E8C8, #C8973A)', accent: '#8B6010' },
  { id: 'verdant', name: 'Verdant', gradient: 'linear-gradient(135deg, #D4EDD8, #3D8B52)', accent: '#2D6025' },
  { id: 'minimal', name: 'Minimal', gradient: 'linear-gradient(135deg, #F5F5F0, #C8C4BC)', accent: '#4A4540' },
]

const INVITE_TEMPLATES = [
  { id: 'royal',   name: 'Royal',   gradient: 'linear-gradient(135deg, #7A0F46, #3D0822)', accent: '#7A0F46' },
  { id: 'floral',  name: 'Floral',  gradient: 'linear-gradient(135deg, #F2CADE, #E89AB0)', accent: '#C45A80' },
  { id: 'classic', name: 'Classic', gradient: 'linear-gradient(135deg, #2D2010, #6B4C28)', accent: '#6B4C28' },
]

// ─── Website / Invite Setup Sheet ────────────────────────────────
function AssetSetupSheet({ type, onClose, onSave }) {
  const [mode, setMode] = useState(null) // 'template' | 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customUrl, setCustomUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const templates = type === 'website' ? WEBSITE_TEMPLATES : INVITE_TEMPLATES
  const label = type === 'website' ? 'Wedding Website' : 'Digital Invites'

  const handleSave = () => {
    if (mode === 'template' && !selectedTemplate) return
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
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.35)', zIndex: 55 }} />
      <motion.div key="asset-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 60, padding: '20px 20px 40px', maxHeight: '85%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '26px', fontWeight: 300, color: '#1A1410', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Set up {label}</p>
        <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: '0 0 20px' }}>Choose how you want to manage your {type === 'website' ? 'wedding website' : 'digital invites'}.</p>

        {/* Mode toggle */}
        <div className="flex gap-2" style={{ marginBottom: '20px' }}>
          {[{ id: 'template', label: '✦ Create with templates', desc: 'In-app, instant setup' }, { id: 'custom', label: '🔗 Connect your own', desc: type === 'website' ? 'Existing website URL' : 'Existing invite link' }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} className="flex-1 flex flex-col font-outfit"
              style={{ padding: '12px 12px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer', border: mode === m.id ? '1.5px solid rgba(122,15,70,0.5)' : '1px solid rgba(0,0,0,0.09)', background: mode === m.id ? 'rgba(122,15,70,0.05)' : 'rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: mode === m.id ? '#7A0F46' : '#1A1410' }}>{m.label}</span>
              <span style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', marginTop: '2px' }}>{m.desc}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'template' && (
            <motion.div key="templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Choose a template</p>
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
                {templates.map(t => (
                  <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                    style={{ borderRadius: '14px', overflow: 'hidden', border: selectedTemplate === t.id ? `2px solid ${t.accent}` : '2px solid transparent', cursor: 'pointer', background: 'none', padding: 0, position: 'relative' }}>
                    <div style={{ height: '80px', background: t.gradient }} />
                    <div style={{ padding: '8px 10px', background: '#FFFBF5', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                      <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: '#1A1410' }}>{t.name}</span>
                    </div>
                    {selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {mode === 'custom' && (
            <motion.div key="custom" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>{type === 'website' ? 'Your website URL' : 'Your invite link'}</p>
              <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px', marginBottom: '8px' }}>
                <Link2 size={14} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
                <input value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder={type === 'website' ? 'https://ananya-rahul.wedding' : 'https://invite.example.com/ananya-rahul'}
                  style={{ fontSize: '12px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }} />
              </div>
              <div style={{ background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.15)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
                <div className="flex items-start gap-2">
                  <Zap size={13} color="#7A0F46" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.55 }}>
                    AI can still push event detail updates (date, time, venue) to your connected {type === 'website' ? 'website' : 'invite'} via our integration API.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mode && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleSave}
            disabled={saving || (mode === 'template' && !selectedTemplate) || (mode === 'custom' && !customUrl.trim())}
            className="w-full font-outfit flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}
            whileTap={{ scale: 0.97 }}>
            {saving ? 'Saving…' : type === 'website' ? 'Launch website →' : 'Activate invites →'}
          </motion.button>
        )}
      </motion.div>
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
          <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.5 }}>
            Event details changed? Sync your {entityName} with the latest date, time &amp; venue.
          </p>
        </div>
        <motion.button onClick={onSync} whileTap={{ scale: 0.95 }} className="font-outfit flex-shrink-0"
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
            <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Wedding Website</p>
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>For all guests</p>
          </div>
        </div>
        {isActive ? (
          <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>
            {isConnected ? 'Connected' : 'Live'}
          </span>
        ) : (
          <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', padding: '3px 8px', borderRadius: '99px' }}>Not set up</span>
        )}
      </div>

      {isActive ? (
        <>
          <div className="flex gap-2" style={{ marginBottom: '10px' }}>
            <button className="flex-1 font-outfit flex items-center justify-center gap-1.5"
              style={{ padding: '9px', borderRadius: '10px', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.2)', fontSize: '11px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
              <ExternalLink size={11} />Preview
            </button>
            <button onClick={onSetup} className="flex-1 font-outfit"
              style={{ padding: '9px', borderRadius: '10px', background: 'none', border: '1px solid rgba(0,0,0,0.09)', fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', cursor: 'pointer' }}>
              Change
            </button>
          </div>
          <AiSyncPanel entityName="website" onSync={handleSync} syncing={syncing} />
        </>
      ) : (
        <button onClick={onSetup} className="w-full font-outfit flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 500, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.25)' }}>
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
            <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Digital Invites</p>
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>For all guests</p>
          </div>
        </div>
        {isActive ? (
          <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>Active</span>
        ) : (
          <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', padding: '3px 8px', borderRadius: '99px' }}>Not set up</span>
        )}
      </div>
      {isActive ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.5)' }}>Sent to {Math.floor(mockGuests.length * 0.7)} guests</span>
            <button onClick={onSetup} className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Manage →</button>
          </div>
          <AiSyncPanel entityName="invites" onSync={handleSync} syncing={syncing} />
        </>
      ) : (
        <button onClick={onSetup} className="w-full font-outfit flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #0D2050 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 500, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,58,107,0.22)' }}>
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
          <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Gift Registry</p>
          <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>For all guests</p>
        </div>
        {saved && <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.09)', border: '1px solid rgba(45,96,37,0.22)', padding: '3px 8px', borderRadius: '99px' }}>Linked</span>}
      </div>
      <div className="glass-input flex items-center gap-2" style={{ padding: '10px 12px', marginBottom: '8px' }}>
        <Link2 size={13} color="rgba(26,20,16,0.28)" style={{ flexShrink: 0 }} />
        <input value={url} onChange={e => { setUrl(e.target.value); setSaved(false) }} placeholder="amazon.in/registry/… or any registry link"
          style={{ fontSize: '12px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }} />
        {url.trim() && (
          <button onClick={() => setSaved(true)} className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: '#2D6025', background: 'rgba(45,96,37,0.1)', border: '1px solid rgba(45,96,37,0.22)', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>Save</button>
        )}
      </div>
      <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', margin: 0 }}>Shared in your wedding website and digital invites</p>
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
          <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Wardrobe Planner</p>
          <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
            Core family only
          </p>
        </div>
        <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', padding: '3px 8px', borderRadius: '99px' }}>{planned}/{ceremonies.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {ceremonies.map((c, i) => (
          <div key={c} className="flex items-center justify-between">
            <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.6)' }}>{c}</span>
            <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 400, color: i < planned ? '#2D6025' : 'rgba(200,151,58,0.9)', background: i < planned ? 'rgba(45,96,37,0.07)' : 'rgba(200,151,58,0.08)', border: `1px solid ${i < planned ? 'rgba(45,96,37,0.2)' : 'rgba(200,151,58,0.25)'}`, padding: '2px 8px', borderRadius: '99px' }}>
              {i < planned ? 'Planned' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full font-outfit" style={{ marginTop: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.18)', fontSize: '12px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
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
          <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Guest Favors</p>
          <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Core family coordination</p>
        </div>
        <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 500, color: '#A07020', background: 'rgba(200,151,58,0.09)', border: '1px solid rgba(200,151,58,0.25)', padding: '3px 8px', borderRadius: '99px' }}>{doneCount}/{items.length} ready</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: item.done ? '#2D6025' : 'transparent', border: `1.5px solid ${item.done ? '#2D6025' : 'rgba(0,0,0,0.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.done && <Check size={9} color="#FFFFFF" strokeWidth={2.5} />}
            </div>
            <span className="font-outfit flex-1" style={{ fontSize: '11px', fontWeight: 300, color: item.done ? 'rgba(26,20,16,0.45)' : '#1A1410', textDecoration: item.done ? 'line-through' : 'none' }}>{item.name}</span>
            <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.35)' }}>×{item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Full Guest Assets Tab ────────────────────────────────────────
function GuestAssets() {
  const [websiteConfig, setWebsiteConfig] = useState(null)
  const [inviteConfig, setInviteConfig] = useState(null)
  const [setupSheet, setSetupSheet] = useState(null) // 'website' | 'invite'

  return (
    <>
      <motion.div className="flex flex-col gap-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>

        {/* For All Guests */}
        <div className="flex flex-col gap-3">
          <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>For all guests</p>
          <WebsiteCard config={websiteConfig} onSetup={() => setSetupSheet('website')} />
          <InviteCard config={inviteConfig} onSetup={() => setSetupSheet('invite')} />
          <GiftRegistryCard />
        </div>

        {/* Core Family Only */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Core family</p>
            <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: '#7A0F46', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.2)', padding: '2px 7px', borderRadius: '99px' }}>Restricted</span>
          </div>
          <WardrobeCard />
          <FavorsCard />
        </div>

        <div style={{ height: '80px' }} />
      </motion.div>

      {/* Setup sheets */}
      <AnimatePresence>
        {setupSheet && (
          <AssetSetupSheet
            type={setupSheet}
            onClose={() => setSetupSheet(null)}
            onSave={(cfg) => {
              if (setupSheet === 'website') setWebsiteConfig(cfg)
              else setInviteConfig(cfg)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ─── MAIN SCREEN ────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export default function GuestsScreen() {
  const [mainTab, setMainTab]             = useState('list') // 'list' | 'assets'
  const [filter, setFilter]               = useState('All')
  const [sideFilter, setSideFilter]       = useState('All') // 'All' | 'bride' | 'groom'
  const [search, setSearch]               = useState('')
  const [searchOpen, setSearchOpen]       = useState(false)
  const [showRsvpDrop, setShowRsvpDrop]   = useState(false)
  const [showSideDrop, setShowSideDrop]   = useState(false)
  const [showUploadDrop, setShowUploadDrop] = useState(false)
  const [guestList, setGuestList]         = useState(mockGuests)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [showImport, setShowImport]       = useState(false)
  const [showGoogleSheets, setShowGoogleSheets] = useState(false)
  const [googleConnected, setGoogleConnected]   = useState(false)
  const [lastSync, setLastSync]           = useState(null)
  const [importBanner, setImportBanner]   = useState(null)
  const [contactsStatus, setContactsStatus] = useState('idle')

  const closeDropdowns = () => { setShowRsvpDrop(false); setShowSideDrop(false); setShowUploadDrop(false) }

  const coupleNames = `${wedding.couple.bride} & ${wedding.couple.groom}`
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
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 300, lineHeight: 1.05, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Guests</h1>
            <p className="font-outfit text-center" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              {guestList.length} invited · {guestList.filter(g => g.rsvp === 'confirmed').length} confirmed
            </p>
          </motion.div>

          {/* ── Main tab toggle: Guest List / Guest Assets ── */}
          <motion.div variants={item} className="relative flex" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '3px' }}>
            {[{ id: 'list', label: 'Guest List' }, { id: 'assets', label: 'Guest Assets' }].map(t => (
              <button key={t.id} onClick={() => setMainTab(t.id)}
                className="relative flex-1 font-outfit"
                style={{ fontSize: '13px', fontWeight: 500, color: mainTab === t.id ? '#1A1410' : 'rgba(26,20,16,0.42)', padding: '9px 0', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '10px', zIndex: 1 }}>
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
                <div className="flex items-center gap-2" style={{ overflow: 'hidden' }}>

                  {/* Search — icon that expands to full input */}
                  {/* Search — expands to ~120px, filters stay visible */}
                  <motion.div
                    animate={{ width: searchOpen ? 120 : 36 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={searchOpen ? 'glass-input' : ''}
                    style={{
                      flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6,
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
                          style={{ fontSize: '12px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif', minWidth: 0 }}
                        />
                        {/* Single X: clears text if present, collapses search if empty */}
                        <button
                          onClick={() => search ? setSearch('') : (setSearchOpen(false))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                          <X size={12} color="rgba(26,20,16,0.35)" />
                        </button>
                      </>
                    ) : (
                      <Search size={14} color="rgba(26,20,16,0.45)" />
                    )}
                  </motion.div>

                  {/* Filters — always visible */}
                  <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>

                  {/* RSVP status dropdown */}
                  <div className="relative flex-1" style={{ minWidth: 0 }}>
                    <button onClick={() => { setShowRsvpDrop(v => !v); setShowSideDrop(false); setShowUploadDrop(false) }}
                      className="w-full flex items-center justify-between gap-1.5 font-outfit"
                      style={{ fontSize: '11px', fontWeight: 500, padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s ease',
                        border: filter !== 'All' ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)',
                        background: filter !== 'All' ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                        color: filter !== 'All' ? '#7A0F46' : 'rgba(26,20,16,0.55)',
                      }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filter === 'All' ? 'Status' : filter}</span>
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
                                className="w-full flex items-center justify-between font-outfit"
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
                      className="w-full flex items-center justify-between gap-1.5 font-outfit"
                      style={{ fontSize: '11px', fontWeight: 500, padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s ease',
                        border: sideFilter !== 'All' ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)',
                        background: sideFilter !== 'All' ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                        color: sideFilter !== 'All' ? '#7A0F46' : 'rgba(26,20,16,0.55)',
                      }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sideFilter === 'All' ? 'Both sides' : sideFilter === 'bride' ? `${wedding.couple.bride}'s` : `${wedding.couple.groom}'s`}
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
                              { key: 'bride', label: `${wedding.couple.bride}'s side`, count: guestList.filter(g => g.side === 'bride').length },
                              { key: 'groom', label: `${wedding.couple.groom}'s side`, count: guestList.filter(g => g.side === 'groom').length },
                            ].map(({ key, label, count }) => (
                              <button key={key} onClick={() => { setSideFilter(key); setFilter('All'); setShowSideDrop(false) }}
                                className="w-full flex items-center justify-between font-outfit"
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
                      <Upload size={14} color={showUploadDrop ? '#7A0F46' : 'rgba(26,20,16,0.45)'} />
                    </button>
                    <AnimatePresence>
                      {showUploadDrop && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setShowUploadDrop(false)} />
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}
                            style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '168px', background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 21, overflow: 'hidden' }}>
                            <button onClick={() => { setShowImport(true); setShowUploadDrop(false) }}
                              className="w-full flex items-center gap-2.5 font-outfit"
                              style={{ padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Upload size={12} color="#7A0F46" />
                              </div>
                              <div>
                                <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Import file</p>
                                <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>CSV or Excel</p>
                              </div>
                            </button>
                            <button onClick={() => { setShowGoogleSheets(true); setShowUploadDrop(false) }}
                              className="w-full flex items-center gap-2.5 font-outfit"
                              style={{ padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(52,168,83,0.1)', border: '1px solid rgba(52,168,83,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Sheet size={12} color="#34A853" />
                              </div>
                              <div>
                                <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Google Sheets</p>
                                <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: googleConnected ? '#34A853' : 'rgba(26,20,16,0.4)', margin: 0 }}>{googleConnected ? `Synced ${lastSync}` : 'Live sync'}</p>
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
                      <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025' }}>{importBanner}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pending nudge */}
                {pending.length > 0 && (
                  <div className="glass-alert flex items-center gap-3" style={{ padding: '13px 16px' }}>
                    <Clock size={14} color="#B03A10" style={{ flexShrink: 0 }} />
                    <p className="font-outfit flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.75)', margin: 0 }}>
                      <span style={{ color: '#B03A10', fontWeight: 600 }}>{pending.length} guests</span> haven't responded yet
                    </p>
                    <button className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: '#B03A10', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(196,80,30,0.22)', padding: '4px 10px', borderRadius: '99px', cursor: 'pointer', flexShrink: 0 }}>Nudge all</button>
                  </div>
                )}

                {/* Guest list — grouped by side when "All" selected */}
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {sideFilter === 'All' ? (
                      ['bride', 'groom'].map(side => {
                        const sideGuests = filtered.filter(g => g.side === side)
                        if (sideGuests.length === 0) return null
                        const sideLabel = side === 'bride' ? `${wedding.couple.bride}'s Side` : `${wedding.couple.groom}'s Side`
                        return (
                          <motion.div key={side} layout className="flex flex-col gap-2">
                            {/* Section header */}
                            <div className="flex items-center gap-3" style={{ marginTop: side === 'groom' ? '6px' : '0' }}>
                              <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                {sideLabel}
                              </span>
                              <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
                              <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.28)', letterSpacing: '0.04em' }}>{sideGuests.length}</span>
                            </div>
                            {/* Guests */}
                            {sideGuests.map(guest => (
                              <motion.button key={guest.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                                transition={spring} onClick={() => setSelectedGuest(guest)}
                                className="glass-card flex items-center gap-3 w-full text-left"
                                style={{ padding: '13px 16px', cursor: 'pointer', border: 'none' }} whileTap={{ scale: 0.985 }}>
                                <InitialAvatar name={guest.name} side={guest.side} />
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{guest.name}</span>
                                  <span className="font-outfit truncate" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', marginTop: '1px' }}>
                                    {guest.contact ? (guest.contactSource === 'contacts' ? `📱 ${guest.contact}` : guest.contact) : <span style={{ color: 'rgba(200,151,58,0.8)', fontWeight: 400 }}>No contact info</span>}
                                  </span>
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
                            <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{guest.name}</span>
                            <span className="font-outfit truncate" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', marginTop: '1px' }}>
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
                <button className="w-full flex items-center justify-center gap-2 font-outfit"
                  style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
                  <UserPlus size={15} />Invite guests
                </button>

                <div style={{ height: '80px' }} />
              </motion.div>
            )}

            {/* ─── GUEST ASSETS TAB ───────────────────────────────── */}
            {mainTab === 'assets' && <GuestAssets key="assets" />}

          </AnimatePresence>
        </motion.div>
      </div>

      <BottomNav />

      {/* Modals */}
      <AnimatePresence>
        {selectedGuest && (
          <GuestActionDrawer guest={selectedGuest} onClose={() => setSelectedGuest(null)}
            coupleNames={coupleNames} weddingDate={wedding.date} weddingVenue={wedding.venue} />
        )}
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
        {showGoogleSheets && (
          <GoogleSheetsModal onClose={() => setShowGoogleSheets(false)} onConnect={handleGoogleConnect} connected={googleConnected} lastSync={lastSync} />
        )}
      </AnimatePresence>
    </div>
  )
}
