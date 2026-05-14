import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare, AlertTriangle, Star, ChevronRight, Phone, Send, X, Clock, ThumbsUp, ThumbsDown,
  Camera, Video, UtensilsCrossed, Flower2, Palette, Music, BookOpen, Sparkles, Music2, Wand2,
  Heart, Users,
} from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import StatusBadge from '../components/ui/StatusBadge'
import { vendorDirectory } from '../data/mockData'
import { getVendorReactions, getReactionSummary } from '../utils/familyUtils'

// Category → icon map (mirrors VendorDetailScreen)
const CAT_ICONS = {
  'Photographer':         Camera,
  'Videographer':         Video,
  'Caterer':              UtensilsCrossed,
  'Florist':              Flower2,
  'Mehndi Artist':        Palette,
  'Makeup Artist':        Sparkles,
  'DJ':                   Music,
  'Pandit':               BookOpen,
  'Decorator':            Wand2,
  'Baraat Band':          Music2,
  'Choreographer':        Users,
  'Invitation Designer':  Heart,
}

// localStorage helpers for vendor favorites
function getFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem('sm_vendor_fav') || '[]')) } catch { return new Set() }
}
export function toggleFavorite(id) {
  const favs = getFavorites()
  favs.has(id) ? favs.delete(id) : favs.add(id)
  localStorage.setItem('sm_vendor_fav', JSON.stringify([...favs]))
  return favs
}
export { getFavorites }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }
const spring = { type: 'spring', stiffness: 420, damping: 32 }
const sheetSpring = { type: 'spring', stiffness: 380, damping: 36 }

const riskOrder = { high: 0, medium: 1, low: 2 }

const DISC_CATS = ['All', 'Photographer', 'Caterer', 'Florist', 'Decorator', 'DJ', 'Pandit', 'Mehndi Artist', 'Videographer']


function draftMessage(vendor) {
  if (vendor.status === 'at_risk') {
    return `Hi ${vendor.name.split(' ')[0]}, this is Ananya. We haven't heard from you in a while and wanted to confirm your availability for the ${vendor.ceremony} on Dec 17. Could you please get back to us at the earliest? Looking forward to working with you!`
  }
  return `Hi ${vendor.name.split(' ')[0]}, this is Ananya. We wanted to follow up on the confirmation for ${vendor.ceremony} on Dec 17. Please let us know if everything is on track. Thank you!`
}

// ── Follow-up bottom sheet ─────────────────────────────────────────────────────
function FollowUpSheet({ vendor, onClose }) {
  const [message, setMessage] = useState(() => draftMessage(vendor))
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(onClose, 1400)
  }

  const handleCall = () => {
    window.location.href = `tel:${vendor.phone}`
  }

  return (
    <>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.50)', zIndex: 320 }} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={sheetSpring}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 321, padding: '20px 20px 44px' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.1)', margin: '0 auto 20px' }} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3" style={{ marginBottom: 16 }}>
          <div>
            <p className="font-cormorant italic" style={{ fontSize: '24px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
              Follow up
            </p>
            <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>
              {vendor.name} · {vendor.category}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={14} color="rgba(26,20,16,0.4)" />
          </button>
        </div>

        {/* Drafted message */}
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Drafted message
        </p>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          className="font-work-sans w-full"
          style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410', lineHeight: 1.65, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '13px', padding: '13px 14px', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box', marginBottom: 16 }}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleCall}
            className="flex items-center justify-center gap-2 font-work-sans"
            style={{ flex: '0 0 auto', padding: '13px 18px', borderRadius: '13px', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.22)', color: '#7A0F46', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <Phone size={14} /> Call
          </button>
          <button onClick={handleSend}
            className="flex items-center justify-center gap-2 font-work-sans flex-1"
            style={{ padding: '13px', borderRadius: '13px', background: sent ? 'rgba(45,96,37,0.9)' : 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', border: 'none', cursor: 'pointer', boxShadow: sent ? 'none' : '0 4px 14px rgba(122,15,70,0.28)', transition: 'background 0.2s ease' }}>
            <Send size={14} /> {sent ? 'Sent!' : 'Send message'}
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ── Shortlist section: categories not yet booked ──────────────────────────────
function ShortlistSection({ onVendorClick, bookedCategories }) {
  // Group vendorDirectory by category, keeping only categories not yet booked
  const groups = {}
  for (const v of vendorDirectory) {
    if (bookedCategories.has(v.category)) continue
    if (!groups[v.category]) groups[v.category] = []
    if (groups[v.category].length < 3) groups[v.category].push(v)
  }
  const entries = Object.entries(groups)
  if (entries.length === 0) return null

  return (
    <div style={{ marginTop: 28 }}>
      {/* Section header */}
      <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase', margin: 0 }}>
          Still to book
        </p>
        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46', background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.18)', padding: '1px 7px', borderRadius: 99 }}>
          {entries.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map(([category, vendors]) => {
          const Icon = CAT_ICONS[category] || Sparkles
          const hasAi = vendors.some(v => v.aiSuggested)
          return (
            <motion.div key={category}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="glass-card" style={{ padding: '14px 0 14px' }}>
              {/* Card header */}
              <div className="flex items-center justify-between gap-2" style={{ padding: '0 16px', marginBottom: 12 }}>
                <div className="flex items-center gap-2.5">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="#7A0F46" strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410', margin: 0 }}>{category}</p>
                    <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
                      {vendors.length} shortlisted{hasAi ? ' · AI picks' : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => onVendorClick(vendors[0].id)}
                  className="font-work-sans flex items-center gap-1"
                  style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Browse <ChevronRight size={12} strokeWidth={2.5} />
                </button>
              </div>

              {/* Horizontal vendor chips */}
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar" style={{ paddingBottom: 2 }}>
                {/* spacer + gap = left indent */}
                <div style={{ flexShrink: 0, width: 6 }} />
                {vendors.map((v, i) => (
                  <motion.button key={v.id}
                    onClick={() => onVendorClick(v.id)}
                    whileTap={{ scale: 0.96 }}
                    style={{ flexShrink: 0, width: 148, padding: '11px 13px', borderRadius: 13, background: '#FFFBF5', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 5px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: '#1A1410', margin: 0, lineHeight: 1.3 }}>{v.name}</p>
                      {v.aiSuggested && (
                        <div style={{ flexShrink: 0, width: 16, height: 16, borderRadius: '50%', background: 'rgba(122,15,70,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={8} color="#7A0F46" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={9} color="#7A0F46" fill="#7A0F46" />
                      <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#1A1410' }}>{v.rating}</span>
                      <span className="font-work-sans" style={{ fontSize: '10px', color: 'rgba(26,20,16,0.4)' }}>({v.reviews})</span>
                    </div>
                    <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: 0 }}>{v.priceRange}</p>
                    {v.tag && (
                      <span className="font-work-sans" style={{ display: 'inline-block', marginTop: 6, fontSize: '8px', fontWeight: 700, color: '#A07020', background: 'rgba(200,151,58,0.10)', border: '1px solid rgba(200,151,58,0.25)', padding: '1px 6px', borderRadius: 99, letterSpacing: '0.05em' }}>{v.tag}</span>
                    )}
                  </motion.button>
                ))}
                <div style={{ flexShrink: 0, width: 6 }} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function MyVendors({ onVendorClick, sortedVendors, atRiskCount, vendors }) {
  const [followUpVendor, setFollowUpVendor] = useState(null)

  return (
    <div style={{ position: 'relative' }}>
      <motion.div className="flex flex-col gap-3" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          {atRiskCount > 0 ? (
            <div className="glass-alert flex items-center gap-3" style={{ padding: '13px 16px' }}>
              <AlertTriangle size={14} color="#B03A10" style={{ flexShrink: 0 }} />
              <p className="font-work-sans flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.75)', margin: 0 }}>
                <span style={{ color: '#B03A10', fontWeight: 600 }}>{atRiskCount} vendors</span> need attention before tomorrow
              </p>
              <span className="font-work-sans rounded-full" style={{ fontSize: '10px', fontWeight: 600, background: '#7A0F46', color: '#FFFFFF', padding: '2px 8px', flexShrink: 0 }}>{atRiskCount}</span>
            </div>
          ) : (
            <div className="glass-warm flex items-center gap-3" style={{ padding: '13px 16px' }}>
              <span style={{ fontSize: '14px' }}>✓</span>
              <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.7)', margin: 0 }}>All vendors confirmed for today</p>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3">
          {sortedVendors.map(vendor => {
            const needsFollowUp = vendor.status === 'at_risk' || vendor.status === 'pending'
            const vendorReactions = getVendorReactions()[String(vendor.id)] || {}
            const reactionSummary = getReactionSummary(vendorReactions)
            const likeCount = Object.values(vendorReactions).filter(r => r === 'like').length
            const dislikeCount = Object.values(vendorReactions).filter(r => r === 'dislike').length
            return (
              <motion.div
                key={vendor.id}
                className="glass-card"
                style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => onVendorClick(String(vendor.id))}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Left: content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Vendor name */}
                  <p className="font-work-sans" style={{ fontSize: '14px', fontWeight: 500, color: '#1A1410', margin: '0 0 5px' }}>
                    {vendor.name}
                  </p>
                  {/* Category + ceremony chips */}
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 7 }}>
                    <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '2px 7px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {vendor.category.toUpperCase()}
                    </span>
                    <span className="font-work-sans flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)' }}>
                      <Clock size={9} strokeWidth={2} />
                      {vendor.ceremony}
                    </span>
                  </div>
                  {/* Status + follow-up */}
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={vendor.status} />
                    {needsFollowUp && (
                      <button
                        onClick={e => { e.stopPropagation(); setFollowUpVendor(vendor) }}
                        className="inline-flex items-center gap-1 font-work-sans flex-shrink-0"
                        style={{ border: '1px solid rgba(122,15,70,0.28)', color: '#7A0F46', background: 'rgba(122,15,70,0.05)', fontSize: '10px', fontWeight: 500, padding: '4px 10px', borderRadius: '99px', cursor: 'pointer' }}>
                        <MessageSquare size={9} /> Follow up
                      </button>
                    )}
                  </div>
                  {/* Family opinion summary */}
                  {reactionSummary && (
                    <div className="flex items-center gap-1.5" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="flex items-center gap-1">
                        {likeCount > 0 && <ThumbsUp size={10} color="#2D6025" fill="rgba(45,96,37,0.25)" strokeWidth={2} />}
                        {dislikeCount > 0 && <ThumbsDown size={10} color="#B03A10" fill="rgba(176,58,16,0.18)" strokeWidth={2} />}
                      </div>
                      <p className="font-cormorant italic" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.58)', margin: 0, lineHeight: 1.35 }}>
                        {reactionSummary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: vendor image */}
                {vendor.image && (
                  <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Still to book */}
      <ShortlistSection
        onVendorClick={onVendorClick}
        bookedCategories={new Set((vendors || []).map(v => v.category))}
      />

      {/* Follow-up sheet */}
      <AnimatePresence>
        {followUpVendor && (
          <FollowUpSheet
            vendor={followUpVendor}
            onClose={() => setFollowUpVendor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function DiscoverVendors({ onVendorClick }) {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? vendorDirectory : vendorDirectory.filter(v => v.category === cat)

  return (
    <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ paddingBottom: '2px' }}>
        {DISC_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="relative font-work-sans flex-shrink-0"
            style={{ fontSize: '11px', fontWeight: 500, padding: '7px 14px', borderRadius: '99px', border: cat === c ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)', background: cat === c ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)', color: cat === c ? '#7A0F46' : 'rgba(26,20,16,0.5)', cursor: 'pointer', transition: 'all 0.18s ease', whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Vendor cards */}
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col gap-3">
          {filtered.map((v, i) => {
            const vendorReactions = getVendorReactions()[v.id] || {}
            const reactionSummary = getReactionSummary(vendorReactions)
            const likeCount = Object.values(vendorReactions).filter(r => r === 'like').length
            const dislikeCount = Object.values(vendorReactions).filter(r => r === 'dislike').length
            return (
              <motion.div key={v.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ ...spring, delay: i * 0.04 }}
                className="glass-card"
                style={{ padding: '16px 18px', cursor: 'pointer' }}
                onClick={() => onVendorClick(v.id)}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{v.name}</span>
                      {v.tag && (
                        <span className="font-work-sans" style={{ fontSize: '8px', fontWeight: 600, color: '#A07020', background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.25)', padding: '2px 7px', borderRadius: '99px', letterSpacing: '0.06em', flexShrink: 0 }}>{v.tag}</span>
                      )}
                    </div>
                    <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.58)' }}>{v.category} · {v.location}</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star size={10} color="#7A0F46" fill="#7A0F46" />
                        <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: '#1A1410' }}>{v.rating}</span>
                        <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.55)' }}>({v.reviews})</span>
                      </div>
                      <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.4)' }}>{v.priceRange}</span>
                    </div>
                    {/* Family opinion summary */}
                    {reactionSummary && (
                      <div className="flex items-center gap-1.5" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <div className="flex items-center gap-1">
                          {likeCount > 0 && <ThumbsUp size={10} color="#2D6025" fill="rgba(45,96,37,0.25)" strokeWidth={2} />}
                          {dislikeCount > 0 && <ThumbsDown size={10} color="#B03A10" fill="rgba(176,58,16,0.18)" strokeWidth={2} />}
                        </div>
                        <p className="font-cormorant italic" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.58)', margin: 0, lineHeight: 1.35 }}>
                          {reactionSummary}
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} color="rgba(26,20,16,0.25)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}

export default function VendorScreen({ vendors = [], setVendors }) {
  const [tab, setTab] = useState('mine')
  const navigate = useNavigate()

  const sortedVendors = [...vendors].sort((a, b) => (riskOrder[a.risk] ?? 3) - (riskOrder[b.risk] ?? 3))
  const atRiskCount   = vendors.filter(v => v.status === 'at_risk' || v.status === 'pending').length

  const handleVendorClick = (id) => navigate(`/vendors/${id}`)

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 500, lineHeight: 1.05, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Vendors</h1>
            <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              {vendors.length} booked · {vendors.filter(v => v.status === 'confirmed').length} confirmed
            </p>
          </motion.div>

          {/* Tab toggle */}
          <motion.div variants={item} className="relative flex" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '3px' }}>
            {[{ id: 'mine', label: 'My Vendors' }, { id: 'discover', label: 'Discover' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative flex-1 font-work-sans"
                style={{ fontSize: '13px', fontWeight: 500, color: tab === t.id ? '#1A1410' : 'rgba(26,20,16,0.58)', padding: '9px 0', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '10px', zIndex: 1 }}>
                {tab === t.id && (
                  <motion.div layoutId="vendor-tab-pill" transition={spring}
                    style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: '#FFFBF5', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', zIndex: -1 }} />
                )}
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {tab === 'mine' ? (
              <motion.div key="mine" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}>
                <MyVendors
                  onVendorClick={handleVendorClick}
                  sortedVendors={sortedVendors}
                  atRiskCount={atRiskCount}
                  vendors={vendors}
                />
              </motion.div>
            ) : (
              <motion.div key="discover" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>
                <DiscoverVendors onVendorClick={handleVendorClick} />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ height: '140px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
