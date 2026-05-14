import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, Radio, AlertTriangle, ChevronRight, X, Plus, Trash2, Package, Users, CheckSquare, Store, CalendarClock } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { ceremonies, vendors as mockVendors } from '../data/mockData'
import { taskCategories } from '../data/tasksData'

// ── Ceremony rich data ────────────────────────────────────────────────────────
const CEREMONY_DATA = {
  'Haldi Ceremony': {
    image: '/images/haldi.jpg',
    bgSize: '160%',
    bgPosition: 'center 35%',
    gradient: 'linear-gradient(to bottom, rgba(180,100,10,0.25) 0%, rgba(26,20,16,0.82) 100%)',
    color: '#C87010',
    timeline: [
      { time: '9:00 AM', step: 'Family gathers at venue', role: 'All family' },
      { time: '9:30 AM', step: "Haldi paste prepared by bride's mom", role: "Bride's mom" },
      { time: '10:00 AM', step: 'Bride seated — ceremony begins', role: 'Bride' },
      { time: '10:10 AM', step: 'Immediate family applies haldi', role: 'Close family' },
      { time: '10:45 AM', step: 'Extended family & friends join', role: 'All guests' },
      { time: '11:15 AM', step: "Groom's haldi (separate area)", role: "Groom's family" },
      { time: '11:45 AM', step: 'Photography wrap-up & cleanup', role: 'Photographer' },
    ],
    assets: [
      { label: 'Fresh turmeric paste — 5 kg',        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75' },
      { label: 'Marigold flower petals (3 baskets)',  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75' },
      { label: 'Yellow outfits for bride & groom',    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=75' },
      { label: 'Banana leaves for seating',           image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=75' },
      { label: 'Waterproof floor covering',           image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=75' },
      { label: 'Change of clothes for close family',  image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=75' },
      { label: 'Towels & water buckets',              image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=75' },
    ],
    vendorKeys: ['florist', 'photographer'],
    taskCategory: 'mehndi',
    guestNote: 'Close family & friends only',
  },
  'Mehndi': {
    image: '/images/mehndi.jpg',
    bgSize: '105%',
    bgPosition: 'center 25%',
    gradient: 'linear-gradient(to bottom, rgba(90,30,10,0.30) 0%, rgba(26,20,16,0.85) 100%)',
    color: '#7A0F46',
    timeline: [
      { time: '11:30 AM', step: 'Mehndi artist arrives & sets up', role: 'Artist' },
      { time: '12:00 PM', step: "Bride's full bridal mehndi begins", role: 'Bride + Artist' },
      { time: '1:30 PM',  step: 'Bridesmaids & close ladies', role: 'Bridal party' },
      { time: '2:30 PM',  step: 'Family members — open session', role: 'Family' },
      { time: '4:00 PM',  step: 'Drying time — music & snacks', role: 'All' },
      { time: '4:30 PM',  step: 'Reveal & photography', role: 'Photographer' },
      { time: '5:00 PM',  step: 'Artist packs up', role: 'Artist' },
    ],
    assets: [
      { label: 'Mehndi design reference photos',      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=75' },
      { label: 'Comfortable seating for bride',        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75' },
      { label: 'Snacks & refreshments for guests',    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75' },
      { label: 'Bluetooth speaker & playlist',        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=75' },
      { label: 'Lemon & sugar sealant mix',           image: 'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=400&q=75' },
      { label: 'Mustard oil for darkening',           image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75' },
      { label: 'Tissue & wet wipes',                  image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=75' },
    ],
    vendorKeys: ['mehndi_artist', 'photographer'],
    taskCategory: 'mehndi',
    guestNote: 'Ladies ceremony — all welcome',
  },
  'Sangeet': {
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&fit=crop',
    gradient: 'linear-gradient(to bottom, rgba(20,20,80,0.30) 0%, rgba(10,10,26,0.88) 100%)',
    color: '#1A3A6B',
    timeline: [
      { time: '6:00 PM', step: 'Venue setup & sound check', role: 'DJ + Decorator' },
      { time: '7:00 PM', step: 'Doors open — cocktail hour', role: 'All guests' },
      { time: '7:30 PM', step: "Welcome by bride's family", role: "Bride's family" },
      { time: '7:45 PM', step: "Performances by groom's family", role: "Groom's family" },
      { time: '8:30 PM', step: "Bride's family performances", role: "Bride's family" },
      { time: '9:15 PM', step: "Couple's dance & open floor", role: 'All' },
      { time: '10:00 PM', step: 'Dinner buffet opens', role: 'Caterer' },
      { time: '1:00 AM', step: 'Event closes', role: 'All' },
    ],
    assets: [
      { label: 'Choreographed dance props',           image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=75' },
      { label: 'Matching outfits per group',          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=75' },
      { label: 'Pre-loaded DJ set list',              image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=75' },
      { label: 'Stage backdrop & fairy lights',       image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=75' },
      { label: 'Printed lyric sheets',               image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=75' },
      { label: 'Photo booth props',                   image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=75' },
    ],
    vendorKeys: ['dj', 'caterer', 'decorator'],
    taskCategory: 'music',
    guestNote: 'All invited guests',
  },
  'Baraat Procession': {
    image: '/images/baraat.jpg',
    bgSize: '180%',
    bgPosition: '40% 25%',
    gradient: 'linear-gradient(to bottom, rgba(100,50,10,0.25) 0%, rgba(26,20,16,0.82) 100%)',
    color: '#8B4513',
    timeline: [
      { time: '3:30 PM', step: 'Groom gets ready — sehra tied', role: "Groom's family" },
      { time: '4:00 PM', step: 'Band arrives & warms up', role: 'Baraat Band' },
      { time: '4:10 PM', step: 'Procession begins from starting point', role: 'All baraat guests' },
      { time: '4:15 PM', step: 'Groom mounted / decorated vehicle', role: 'Groom' },
      { time: '4:15 PM', step: 'Dancing procession down the route', role: 'Family & friends' },
      { time: '5:00 PM', step: 'Arrival at wedding venue', role: 'All' },
      { time: '5:10 PM', step: 'Milni ceremony — families meet', role: 'Both families' },
    ],
    assets: [
      { label: "Sehra — groom's floral headpiece",   image: 'https://images.unsplash.com/photo-1519741347686-c1e331fcb55f?w=400&q=75' },
      { label: 'Decorated horse / vintage car',       image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=75' },
      { label: 'Cash for band & dancers (tips)',      image: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&q=75' },
      { label: 'Route map for all guests',            image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=75' },
      { label: 'Matching sherwani for baraat party',  image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=75' },
      { label: 'Flower garlands for milni',           image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=75' },
    ],
    vendorKeys: ['band', 'decorator'],
    taskCategory: 'venue',
    guestNote: "Groom's family & close friends",
  },
  'Pheras & Vows': {
    image: '/images/pheras.jpg',
    bgSize: '140%',
    bgPosition: 'center 55%',
    gradient: 'linear-gradient(to bottom, rgba(60,30,10,0.20) 0%, rgba(26,20,16,0.85) 100%)',
    color: '#5C0B35',
    timeline: [
      { time: '6:30 PM', step: 'Mandap setup complete — pandit arrives', role: 'Pandit + Decorator' },
      { time: '7:00 PM', step: 'Jaimala — couple exchanges garlands', role: 'Couple' },
      { time: '7:15 PM', step: 'Kanyadaan — bride given away', role: "Bride's parents" },
      { time: '7:30 PM', step: 'Sacred fire lit — pheras begin', role: 'Pandit + Couple' },
      { time: '8:00 PM', step: 'Saat phere (seven rounds) complete', role: 'Couple' },
      { time: '8:10 PM', step: 'Sindoor & mangalsutra ceremony', role: 'Groom' },
      { time: '8:20 PM', step: 'Couple declared married — blessings', role: 'All guests' },
      { time: '8:30 PM', step: 'Photography & family portraits', role: 'Photographer' },
    ],
    assets: [
      { label: 'Sacred fire — havan kund materials',  image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=75' },
      { label: 'Flowers for mandap decoration',       image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75' },
      { label: 'Mangalsutra (pre-confirmed)',          image: 'https://images.unsplash.com/photo-1573408301185-9519f7cf65ee?w=400&q=75' },
      { label: 'Sindoor & thali',                     image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&q=75' },
      { label: 'Coconut, betel leaves & rice',        image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=400&q=75' },
      { label: "Bride's bridal jewelry checklist",    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=75' },
      { label: 'Wedding rings',                       image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75' },
    ],
    vendorKeys: ['pandit', 'photographer', 'caterer'],
    taskCategory: 'venue',
    guestNote: 'All invited guests — main ceremony',
  },
  'Reception': {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop',
    gradient: 'linear-gradient(to bottom, rgba(10,10,30,0.30) 0%, rgba(10,10,20,0.88) 100%)',
    color: '#1A3A6B',
    timeline: [
      { time: '8:30 PM', step: 'Venue doors open — cocktail reception', role: 'All guests' },
      { time: '9:00 PM', step: "Couple's grand entry", role: 'Couple + DJ' },
      { time: '9:10 PM', step: 'First dance', role: 'Couple' },
      { time: '9:20 PM', step: "Welcome speech — bride's father", role: "Bride's father" },
      { time: '9:30 PM', step: "Groom's speech & toast", role: 'Groom' },
      { time: '9:45 PM', step: 'Dinner service begins', role: 'Caterer' },
      { time: '10:30 PM', step: 'Open dance floor', role: 'DJ + All' },
      { time: '12:00 AM', step: 'Cake cutting', role: 'Couple' },
      { time: '1:00 AM', step: "Bidaai — bride's farewell", role: "Bride's family" },
    ],
    assets: [
      { label: 'Wedding cake (pre-ordered)',          image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=75' },
      { label: "Couple's first dance playlist",       image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=75' },
      { label: 'Stage & sweetheart table décor',      image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=75' },
      { label: 'Name cards & seating chart',          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=75' },
      { label: "Signing book & pen",                  image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=75' },
      { label: 'Sparklers for grand entry',           image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=75' },
      { label: 'Bridal emergency kit',                image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=75' },
    ],
    vendorKeys: ['dj', 'caterer', 'photographer', 'decorator'],
    taskCategory: 'venue',
    guestNote: 'All invited guests',
  },
}

const STATUS_CONFIG = {
  done:     { label: 'Done',     color: '#2D6025', bg: 'rgba(45,96,37,0.12)',   border: 'rgba(45,96,37,0.28)'  },
  live:     { label: 'Live',     color: '#7A0F46', bg: 'rgba(122,15,70,0.12)', border: 'rgba(122,15,70,0.35)' },
  upcoming: { label: 'Upcoming', color: 'rgba(255,255,255,0.70)', bg: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.22)' },
  at_risk:  { label: 'At risk',  color: '#F07040', bg: 'rgba(196,80,30,0.15)', border: 'rgba(196,80,30,0.40)' },
}

const DETAIL_TABS = ['Timeline', 'Notes', 'Guests', 'Tasks', 'Vendors']

const spring = { type: 'spring', stiffness: 380, damping: 36 }

// ── Ceremony detail bottom sheet ──────────────────────────────────────────────
function CeremonyDetail({ ceremony, tasks, vendors, guests, onClose }) {
  const data = CEREMONY_DATA[ceremony.name] || {}
  const [activeTab, setActiveTab] = useState('Timeline')
  const [notes, setNotes] = useState([])
  const [noteInput, setNoteInput] = useState('')
  const st = STATUS_CONFIG[ceremony.status] || STATUS_CONFIG.upcoming

  const addNote = () => {
    if (!noteInput.trim()) return
    setNotes(prev => [...prev, { id: Date.now(), text: noteInput.trim(), author: 'You', time: 'Just now' }])
    setNoteInput('')
  }

  // Filtered data for this ceremony
  const ceremonyVendors = (vendors || mockVendors).filter(v =>
    (data.vendorKeys || []).some(k => v.name?.toLowerCase().includes(k.split('_')[0]) || v.category?.toLowerCase().includes(k.split('_')[0]))
  )
  const ceremonyTasks = (tasks || []).filter(t => t.category === data.taskCategory || !data.taskCategory)
  const ceremonyGuests = (guests || []).filter(g => g.tier === 'core' || g.tier === 'close' || !data.guestNote?.includes('Close'))

  const statusDot = { done: '✓', live: '●', upcoming: '○', at_risk: '⚠' }

  return (
    <>
      {/* Backdrop */}
      <motion.div key="cd-bd"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.55)', zIndex: 60 }} />

      {/* Sheet */}
      <motion.div key="cd-sh"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={spring}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, maxHeight: '90%', display: 'flex', flexDirection: 'column' }}>

        {/* Hero image */}
        <div style={{ position: 'relative', height: 160, borderRadius: '22px 22px 0 0', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${data.image})`, backgroundSize: data.bgSize || 'cover', backgroundPosition: data.bgPosition || 'center', backgroundRepeat: 'no-repeat' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(26,20,16,0.72) 100%)' }} />
          {/* Handle */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.40)' }} />
          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.30)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="#FFFFFF" strokeWidth={2} />
          </button>
          {/* Status badge */}
          <span className="font-work-sans" style={{ position: 'absolute', top: 22, left: 18, fontSize: '9px', fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 99, padding: '3px 9px', letterSpacing: '0.06em' }}>
            {st.label.toUpperCase()}
          </span>
          {/* Name + time */}
          <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
            <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 3px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{ceremony.name}</p>
            <div className="flex items-center gap-1.5">
              <Clock size={11} color="rgba(255,255,255,0.70)" strokeWidth={2} />
              <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.75)' }}>{ceremony.time}</span>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0, paddingLeft: 18, paddingRight: 18 }}>
          {DETAIL_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="font-work-sans flex-shrink-0"
              style={{ fontSize: '12px', fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#7A0F46' : 'rgba(26,20,16,0.45)', padding: '12px 12px 10px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #7A0F46' : '2px solid transparent', marginBottom: -1 }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '18px 18px 36px' }}>

          {/* ── Timeline ── */}
          {activeTab === 'Timeline' && (
            <div>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                {ceremony.name} · Step by step
              </p>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 1, background: 'rgba(122,15,70,0.15)' }} />
                <div className="flex flex-col gap-0">
                  {(data.timeline || []).map((step, i) => (
                    <div key={i} className="flex gap-3" style={{ paddingBottom: 20, position: 'relative' }}>
                      {/* Time */}
                      <div style={{ width: 52, flexShrink: 0, textAlign: 'right' }}>
                        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(26,20,16,0.42)', lineHeight: 1.3 }}>{step.time}</span>
                      </div>
                      {/* Dot */}
                      <div style={{ width: 18, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: i === 0 ? '#7A0F46' : 'rgba(122,15,70,0.25)', border: '2px solid #7A0F46', flexShrink: 0 }} />
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, paddingTop: 1 }}>
                        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', lineHeight: 1.4 }}>{step.step}</p>
                        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.42)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '2px 8px' }}>{step.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Assets ── */}
          {activeTab === 'Timeline' && (data.assets || []).length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 12px' }}>Assets needed</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(data.assets || []).map((asset, i) => (
                  <div key={i} style={{ position: 'relative', height: 96, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${asset.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.72) 100%)' }} />
                    <p className="font-work-sans" style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '6px 8px 8px',
                      fontSize: '10px', fontWeight: 500, color: '#FFFFFF',
                      margin: 0, lineHeight: 1.35,
                    }}>
                      {asset.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notes ── */}
          {activeTab === 'Notes' && (
            <div>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 14px' }}>Family notes</p>

              {/* Add note */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <input
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNote()}
                  placeholder="Add a note for the family…"
                  className="font-work-sans"
                  style={{ flex: 1, padding: '11px 13px', borderRadius: 12, border: '1px solid rgba(122,15,70,0.22)', fontSize: '13px', fontWeight: 400, color: '#1A1410', background: '#FFFFFF', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                <button onClick={addNote} style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="flex flex-col items-center gap-2" style={{ padding: '28px 0', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={18} color="#7A0F46" strokeWidth={1.5} />
                  </div>
                  <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(26,20,16,0.45)', margin: 0 }}>No notes yet</p>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.35)', margin: 0 }}>Add reminders, tips or instructions for family</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {notes.map(note => (
                    <div key={note.id} className="flex gap-3 items-start" style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(122,15,70,0.04)', border: '1px solid rgba(122,15,70,0.14)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(122,15,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: '#7A0F46' }}>Y</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 600, color: '#7A0F46' }}>{note.author}</span>
                          <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.35)' }}>{note.time}</span>
                        </div>
                        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', margin: 0, lineHeight: 1.5 }}>{note.text}</p>
                      </div>
                      <button onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                        <Trash2 size={12} color="rgba(26,20,16,0.30)" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Guests ── */}
          {activeTab === 'Guests' && (
            <div>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 6px' }}>Guests</p>
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: '0 0 14px' }}>{data.guestNote}</p>
              {ceremonyGuests.length === 0 ? (
                <EmptyState icon={Users} label="No guests found" sub="Guest list not yet populated" />
              ) : (
                <div className="flex flex-col gap-2">
                  {ceremonyGuests.slice(0, 12).map(g => (
                    <div key={g.id} className="flex items-center gap-3" style={{ padding: '10px 13px', borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: g.side === 'bride' ? 'rgba(122,15,70,0.12)' : 'rgba(26,58,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 700, color: g.side === 'bride' ? '#7A0F46' : '#1A3A6B' }}>{g.name?.[0] || '?'}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 1px' }}>{g.name}</p>
                        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0, textTransform: 'capitalize' }}>{g.side}'s side · {g.tier}</p>
                      </div>
                      <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                        color: g.rsvp === 'confirmed' ? '#2D6025' : g.rsvp === 'declined' ? '#B03A10' : '#A07020',
                        background: g.rsvp === 'confirmed' ? 'rgba(45,96,37,0.08)' : g.rsvp === 'declined' ? 'rgba(196,80,30,0.08)' : 'rgba(200,151,58,0.10)',
                        border: `1px solid ${g.rsvp === 'confirmed' ? 'rgba(45,96,37,0.22)' : g.rsvp === 'declined' ? 'rgba(196,80,30,0.22)' : 'rgba(200,151,58,0.30)'}`,
                      }}>
                        {g.rsvp ? g.rsvp.charAt(0).toUpperCase() + g.rsvp.slice(1) : 'Pending'}
                      </span>
                    </div>
                  ))}
                  {ceremonyGuests.length > 12 && (
                    <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.40)', margin: '4px 0 0' }}>+{ceremonyGuests.length - 12} more guests</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Tasks ── */}
          {activeTab === 'Tasks' && (
            <div>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 14px' }}>
                Related tasks · {ceremonyTasks.filter(t => !t.done).length} pending
              </p>
              {ceremonyTasks.length === 0 ? (
                <EmptyState icon={CheckSquare} label="No tasks linked" sub="Tasks for this ceremony will appear here" />
              ) : (
                <div className="flex flex-col gap-2">
                  {ceremonyTasks.filter(t => !t.done).map(t => {
                    const cat = taskCategories[t.category]
                    return (
                      <div key={t.id} className="flex items-center gap-3" style={{ padding: '11px 13px', borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.priority === 'high' ? '#B03A10' : t.priority === 'medium' ? '#A07020' : '#2D6025', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</p>
                          <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0 }}>{cat?.label || t.category}</p>
                        </div>
                        <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: t.priority === 'high' ? '#B03A10' : t.priority === 'medium' ? '#A07020' : '#2D6025', background: t.priority === 'high' ? 'rgba(196,80,30,0.08)' : t.priority === 'medium' ? 'rgba(200,151,58,0.10)' : 'rgba(45,96,37,0.08)', border: `1px solid ${t.priority === 'high' ? 'rgba(196,80,30,0.22)' : t.priority === 'medium' ? 'rgba(200,151,58,0.30)' : 'rgba(45,96,37,0.22)'}`, borderRadius: 99, padding: '3px 8px', textTransform: 'capitalize', flexShrink: 0 }}>
                          {t.priority}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Vendors ── */}
          {activeTab === 'Vendors' && (
            <div>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 14px' }}>Vendors for this ceremony</p>
              {ceremonyVendors.length === 0 ? (
                <EmptyState icon={Store} label="No vendors linked" sub="Vendors booked for this event will appear here" />
              ) : (
                <div className="flex flex-col gap-2">
                  {ceremonyVendors.map(v => (
                    <div key={v.id} className="flex items-center gap-3" style={{ padding: '11px 13px', borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)' }}>
                      <img src={v.image} alt={v.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410', margin: '0 0 2px' }}>{v.name}</p>
                        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0 }}>{v.category} · {v.ceremony}</p>
                      </div>
                      <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                        color: v.status === 'confirmed' ? '#2D6025' : v.status === 'at_risk' ? '#B03A10' : '#A07020',
                        background: v.status === 'confirmed' ? 'rgba(45,96,37,0.08)' : v.status === 'at_risk' ? 'rgba(196,80,30,0.08)' : 'rgba(200,151,58,0.10)',
                        border: `1px solid ${v.status === 'confirmed' ? 'rgba(45,96,37,0.22)' : v.status === 'at_risk' ? 'rgba(196,80,30,0.22)' : 'rgba(200,151,58,0.30)'}`,
                        flexShrink: 0,
                      }}>
                        {v.status === 'at_risk' ? 'At risk' : v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </>
  )
}

// ── Empty state helper ────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, label, sub }) {
  return (
    <div className="flex flex-col items-center gap-2" style={{ padding: '28px 0', textAlign: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color="#7A0F46" strokeWidth={1.5} />
      </div>
      <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(26,20,16,0.45)', margin: 0 }}>{label}</p>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.35)', margin: 0 }}>{sub}</p>
    </div>
  )
}

// ── Ceremony tile (vibe-card style) ──────────────────────────────────────────
function CeremonyTile({ ceremony, index, onOpen }) {
  const data = CEREMONY_DATA[ceremony.name] || {}
  const st = STATUS_CONFIG[ceremony.status] || STATUS_CONFIG.upcoming
  const isLive = ceremony.status === 'live'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, delay: index * 0.06 }}
      onClick={() => onOpen(ceremony)}
      style={{ position: 'relative', height: 168, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>

      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${data.image || ''})`,
        backgroundSize: data.bgSize || 'cover',
        backgroundPosition: data.bgPosition || 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: data.gradient || 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(26,20,16,0.82) 100%)' }} />

      {/* Done dimming */}
      {ceremony.status === 'done' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.30)' }} />
      )}

      {/* Top row: index + status */}
      <div className="flex items-center justify-between" style={{ position: 'absolute', top: 14, left: 16, right: 16 }}>
        <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-work-sans flex items-center gap-1.5" style={{ fontSize: '10px', fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 99, padding: '4px 10px', backdropFilter: 'blur(6px)', letterSpacing: '0.04em' }}>
          {isLive && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7A0F46', display: 'inline-block', animation: 'pulse 1.6s ease-in-out infinite' }} />}
          {st.label}
        </span>
      </div>

      {/* Bottom: name + time + tap hint */}
      <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
        <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 5px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{ceremony.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={11} color="rgba(255,255,255,0.65)" strokeWidth={2} />
            <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.70)' }}>{ceremony.time}</span>
            {ceremony.vendors?.length > 0 && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>·</span>
                <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{ceremony.vendors.length} vendors</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
            <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.80)' }}>View</span>
            <ChevronRight size={11} color="rgba(255,255,255,0.70)" strokeWidth={2} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function CeremoniesScreen({ tasks, vendors, guests }) {
  const [selected, setSelected] = useState(null)

  const liveCount = ceremonies.filter(c => c.status === 'live').length
  const doneCount = ceremonies.filter(c => c.status === 'done').length

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />

        <div className="flex flex-col px-5 gap-3">
          {/* Header */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 500, margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Ceremonies
            </h1>
            <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.40)', margin: '0 0 16px' }}>
              {doneCount} complete · {liveCount > 0 ? `${liveCount} live now · ` : ''}{ceremonies.length - doneCount - liveCount} upcoming
            </p>
          </div>

          {/* Tiles — in sequence */}
          {ceremonies.map((c, i) => (
            <CeremonyTile key={c.id} ceremony={c} index={i} onOpen={setSelected} />
          ))}

          <div style={{ height: '80px' }} />
        </div>
      </div>

      <BottomNav />

      {/* Detail sheet */}
      <AnimatePresence>
        {selected && (
          <CeremonyDetail
            ceremony={selected}
            tasks={tasks}
            vendors={vendors}
            guests={guests}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
