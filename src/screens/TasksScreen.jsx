import { useState, useContext, createContext, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown, ChevronUp, Calendar, Check, RotateCcw, X, Pencil, MapPin, Users, UserPlus, MessageCircle, Navigation, Search, Phone, ThumbsUp, ThumbsDown } from 'lucide-react'
import { getVendorReactions, getReactionSummary } from '../utils/familyUtils'

// Instagram SVG (not in this lucide version)
const InstaIcon = ({ size = 13, color = '#7A0F46' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill={color} stroke="none"/>
  </svg>
)
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { initialTasks, taskCategories, formatDue } from '../data/tasksData'

const spring = { type: 'spring', stiffness: 420, damping: 32 }

// ── Filter dropdown pill ──────────────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = value !== options[0].value
  const activeLabel = options.find(o => o.value === value)?.label

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="font-work-sans flex items-center gap-1"
        style={{
          fontSize: '12px', fontWeight: 500, padding: '8px 12px', borderRadius: 99, cursor: 'pointer',
          border: isActive ? '1px solid rgba(122,15,70,0.40)' : '1px solid rgba(0,0,0,0.09)',
          background: isActive ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
          color: isActive ? '#7A0F46' : 'rgba(26,20,16,0.60)',
          whiteSpace: 'nowrap',
        }}>
        {isActive ? activeLabel : label}
        <ChevronDown size={11} color={isActive ? '#7A0F46' : 'rgba(26,20,16,0.38)'} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 90,
              background: '#FFFBF5', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.13)', minWidth: 150, overflow: 'hidden',
            }}>
            {options.map(opt => (
              <button key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className="font-work-sans"
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 15px', fontSize: '13px', fontWeight: value === opt.value ? 500 : 400,
                  color: value === opt.value ? '#7A0F46' : '#1A1410',
                  background: value === opt.value ? 'rgba(122,15,70,0.06)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const WEDDING_PEOPLE = [
  { id: 'bride',     name: 'Ananya', role: 'Bride',           initials: 'An', color: '#7A0F46', bg: 'rgba(122,15,70,0.10)' },
  { id: 'groom',     name: 'Rahul',  role: 'Groom',           initials: 'Ra', color: '#1A3A6B', bg: 'rgba(26,58,107,0.10)' },
  { id: 'bride_mom', name: 'Priya',  role: "Bride's Mom",     initials: 'Pr', color: '#2D6025', bg: 'rgba(45,96,37,0.10)'  },
  { id: 'bride_dad', name: 'Suresh', role: "Bride's Dad",     initials: 'Su', color: '#8B4513', bg: 'rgba(139,69,19,0.10)' },
  { id: 'groom_mom', name: 'Meena',  role: "Groom's Mom",     initials: 'Me', color: '#2D6025', bg: 'rgba(45,96,37,0.10)'  },
  { id: 'groom_dad', name: 'Vikram', role: "Groom's Dad",     initials: 'Vi', color: '#8B4513', bg: 'rgba(139,69,19,0.10)' },
  { id: 'moh',       name: 'Divya',  role: 'Maid of Honour',  initials: 'Di', color: '#7A0F46', bg: 'rgba(122,15,70,0.10)' },
  { id: 'bestman',   name: 'Arjun',  role: 'Best Man',        initials: 'Ar', color: '#1A3A6B', bg: 'rgba(26,58,107,0.10)' },
]

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#B03A10', bg: 'rgba(196,80,30,0.08)',  border: 'rgba(196,80,30,0.22)'  },
  medium: { label: 'Medium', color: '#A07020', bg: 'rgba(200,151,58,0.10)', border: 'rgba(200,151,58,0.30)' },
  low:    { label: 'Low',    color: '#2D6025', bg: 'rgba(45,96,37,0.08)',   border: 'rgba(45,96,37,0.22)'   },
}

// ── Shared task state via context ─────────────────────────────────────────────
export const TasksContext = createContext(null)
export function useTasks() { return useContext(TasksContext) }

// ── AI-curated vendor suggestions (venue/decorator tasks) ─────────────────────
const SUGGESTED_DECORATORS = [
  { id: 'sd1', name: 'The Decor Studio', handle: '@thedecor.studio', specialty: 'Luxury floral mandap & table scapes', style: 'Grand & opulent', budget: '₹5–12L', rating: 4.9, reviews: 412, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80&fit=crop', phone: '+91 98400 44200', instagram: 'https://instagram.com/thedecor.studio' },
  { id: 'sd2', name: 'Blooms & Beyond', handle: '@bloomsandbeyond.in', specialty: 'Garden & romantic florals', style: 'Soft & romantic', budget: '₹1.5–4L', rating: 4.7, reviews: 203, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&q=80&fit=crop', phone: '+91 99400 22310', instagram: 'https://instagram.com/bloomsandbeyond.in' },
  { id: 'sd3', name: 'Kalank Events', handle: '@kalankevents', specialty: 'Traditional & fusion North Indian', style: 'Rich & traditional', budget: '₹3–7L', rating: 4.8, reviews: 318, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80&fit=crop', phone: '+91 98100 55678', instagram: 'https://instagram.com/kalankevents' },
  { id: 'sd4', name: 'Minimal Shaadi Co.', handle: '@minimalshaadi', specialty: 'Modern minimalist & pastel themes', style: 'Clean & contemporary', budget: '₹80k–2L', rating: 4.6, reviews: 147, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80&fit=crop', phone: '+91 97300 11456', instagram: 'https://instagram.com/minimalshaadi' },
  { id: 'sd5', name: 'Regal Weddings', handle: '@regalweddings.in', specialty: 'Palace-style heritage decor', style: 'Heritage & majestic', budget: '₹10–25L', rating: 5.0, reviews: 89, image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200&q=80&fit=crop', phone: '+91 98200 77890', instagram: 'https://instagram.com/regalweddings.in' },
]

// ── Task Detail Drawer ────────────────────────────────────────────────────────
export function TaskDetailDrawer({ task, onClose, onEdit, onUpdateAssignees }) {
  const navigate = useNavigate()
  const cat = taskCategories[task.category] || taskCategories.vendors
  const pri = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const [showAssignPicker, setShowAssignPicker] = useState(false)
  const assignPickerRef = useRef(null)
  const assignees = (task.assignees || []).map(id => WEDDING_PEOPLE.find(p => p.id === id)).filter(Boolean)
  const showSuggestedVendors = task.category === 'venue' || task.title?.toLowerCase().includes('decorator') || task.title?.toLowerCase().includes('decor')

  const toggleAssignee = (personId) => {
    const current = task.assignees || []
    const next = current.includes(personId)
      ? current.filter(id => id !== personId)
      : [...current, personId]
    onUpdateAssignees(task.id, next)
  }

  // Close picker on outside click
  useEffect(() => {
    if (!showAssignPicker) return
    const handler = (e) => { if (!assignPickerRef.current?.contains(e.target)) setShowAssignPicker(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAssignPicker])

  const mapsUrl = task.location ? `https://maps.google.com/?q=${encodeURIComponent(task.location)}` : null

  return (
    <>
      <motion.div key="td-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.55)', zIndex: 60 }} />
      <motion.div key="td-sh"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, maxHeight: '90%', overflowY: 'auto' }}
      >
        {/* ── Cover image ── */}
        <div style={{ position: 'relative', height: 172, flexShrink: 0, overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
          <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(26,20,16,0.78) 100%)' }} />

          {/* Drag handle */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.40)' }} />

          {/* Top-right icon buttons: Edit + Close */}
          <div className="flex items-center gap-2" style={{ position: 'absolute', top: 18, right: 16 }}>
            <button
              onClick={() => { onClose(); setTimeout(() => onEdit(task), 100) }}
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pencil size={14} color="#FFFFFF" strokeWidth={2} />
            </button>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} color="#FFFFFF" strokeWidth={2} />
            </button>
          </div>

          {/* Title */}
          <p className="font-cormorant italic" style={{ position: 'absolute', bottom: 44, left: 18, right: 18, fontSize: '22px', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {task.title}
          </p>

          {/* Category chip + Priority badge — below title, still inside image */}
          <div className="flex items-center gap-2" style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
            <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.20)', padding: '3px 9px', borderRadius: 99, letterSpacing: '0.06em' }}>
              {cat.label.split(' ')[0].toUpperCase()}
            </span>
            <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 700, color: pri.color, background: 'rgba(255,255,255,0.90)', border: `1px solid ${pri.border}`, padding: '3px 9px', borderRadius: 99, letterSpacing: '0.05em' }}>
              {pri.label.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ padding: '18px 20px 40px' }}>

          {/* Due date */}
          <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
            <Calendar size={13} color="rgba(26,20,16,0.54)" />
            <span className="font-work-sans" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.55)' }}>
              {task.dueDate ? formatDue(task.dueDate) : 'No due date set'}
            </span>
          </div>

          {/* Location — only when a location is set */}
          {task.location && (
            <div style={{ marginBottom: 18 }}>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 7px' }}>Location</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(26,20,16,0.03)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '10px 12px', textDecoration: 'none' }}>
                <MapPin size={14} color="#7A0F46" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span className="font-work-sans" style={{ fontSize: '12px', color: '#1A1410', flex: 1 }}>{task.location}</span>
                <Navigation size={11} color="#7A0F46" strokeWidth={2} style={{ flexShrink: 0 }} />
              </a>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div style={{ marginBottom: 18 }}>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 7px' }}>Notes</p>
              <p className="font-work-sans" style={{ fontSize: '13px', color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.6 }}>{task.description}</p>
            </div>
          )}

          {/* ── Assigned to — upward multi-select dropdown ── */}
          <div style={{ marginBottom: 20, position: 'relative' }} ref={assignPickerRef}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Assigned to {assignees.length > 0 ? `· ${assignees.length}` : ''}
            </p>

            {/* Tap area — shows pills + placeholder */}
            <button
              onClick={() => setShowAssignPicker(v => !v)}
              className="w-full text-left"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minHeight: 44, padding: '8px 12px', borderRadius: 12, border: showAssignPicker ? '1px solid rgba(122,15,70,0.35)' : '1px solid rgba(0,0,0,0.09)', background: showAssignPicker ? 'rgba(122,15,70,0.03)' : 'rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {assignees.length === 0 && (
                <span className="font-work-sans flex items-center gap-1.5" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.40)' }}>
                  <Users size={13} color="rgba(26,20,16,0.28)" /> Tap to assign family members…
                </span>
              )}
              {assignees.map(p => (
                <span key={p.id} className="font-work-sans flex items-center gap-1"
                  style={{ background: p.bg, border: `1px solid ${p.color}40`, borderRadius: 99, padding: '3px 8px 3px 5px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: p.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 700, color: '#FFF', flexShrink: 0 }}>{p.initials}</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: p.color }}>{p.name}</span>
                </span>
              ))}
              <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <ChevronDown size={13} color="rgba(26,20,16,0.30)" style={{ transform: showAssignPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </span>
            </button>

            {/* Upward dropdown — 0px gap, flush against the field */}
            <AnimatePresence>
              {showAssignPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 10, background: '#FFFBF5', borderRadius: '14px 14px 0 0', border: '1px solid rgba(0,0,0,0.10)', borderBottom: 'none', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 8px 0' }}>
                    <p className="font-work-sans" style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.10em', textTransform: 'uppercase', padding: '2px 8px 8px' }}>Select family members</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                      {WEDDING_PEOPLE.map(p => {
                        const isAssigned = (task.assignees || []).includes(p.id)
                        return (
                          <button key={p.id} onClick={() => toggleAssignee(p.id)}
                            className="flex items-center gap-2 font-work-sans"
                            style={{ padding: '8px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', border: isAssigned ? `1.5px solid ${p.color}44` : '1px solid rgba(0,0,0,0.06)', background: isAssigned ? p.bg : 'rgba(0,0,0,0.015)', transition: 'all 0.12s' }}>
                            {/* Checkbox */}
                            <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: isAssigned ? `2px solid ${p.color}` : '1.5px solid rgba(26,20,16,0.22)', background: isAssigned ? p.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
                              {isAssigned && <Check size={9} color="#FFF" strokeWidth={3} />}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: '12px', fontWeight: 500, color: isAssigned ? p.color : '#1A1410', margin: 0 }}>{p.name}</p>
                              <p style={{ fontSize: '9px', color: 'rgba(26,20,16,0.38)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.role}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <button onClick={() => setShowAssignPicker(false)}
                      className="font-work-sans w-full"
                      style={{ marginTop: 8, padding: '9px', borderRadius: 10, background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.22)', fontSize: '12px', fontWeight: 600, color: '#7A0F46', cursor: 'pointer' }}>
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── AI-curated vendor suggestions ── */}
          {showSuggestedVendors && (
            <div style={{ marginBottom: 8 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, background: 'linear-gradient(135deg,#7A0F46,#5C0B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: '#fff' }}>✦</span>
                </div>
                <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>AI-curated decorators</p>
                <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.20)', borderRadius: 99, padding: '2px 7px' }}>Researched</span>
              </div>
              <div className="flex flex-col gap-3">
                {SUGGESTED_DECORATORS.map(v => {
                  const vendorReactions = getVendorReactions()[v.id] || {}
                  const reactionSummary = getReactionSummary(vendorReactions)
                  const likeCount = Object.values(vendorReactions).filter(r => r === 'like').length
                  const dislikeCount = Object.values(vendorReactions).filter(r => r === 'dislike').length
                  return (
                    <div key={v.id}
                      style={{ borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => { onClose(); setTimeout(() => navigate(`/vendors/${v.id}`), 120) }}
                    >
                      {/* Image strip */}
                      <div style={{ position: 'relative', height: 80, overflow: 'hidden' }}>
                        <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,20,16,0.55) 0%, transparent 60%)' }} />
                        <div style={{ position: 'absolute', top: 8, left: 12, bottom: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.80)', background: 'rgba(0,0,0,0.30)', borderRadius: 99, padding: '2px 8px' }}>{v.budget}</span>
                          <div className="flex items-center gap-1">
                            <span style={{ fontSize: 9, color: '#F5A623' }}>★</span>
                            <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: '#FFFFFF' }}>{v.rating}</span>
                            <span className="font-work-sans" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.60)' }}>({v.reviews})</span>
                          </div>
                        </div>
                      </div>
                      {/* Info row */}
                      <div style={{ padding: '11px 13px 12px' }}>
                        <div className="flex items-start gap-3">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 600, color: '#1A1410', margin: '0 0 1px' }}>{v.name}</p>
                            <p className="font-work-sans" style={{ fontSize: '10px', color: '#7A0F46', margin: '0 0 3px' }}>{v.handle}</p>
                            <p className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(26,20,16,0.55)', margin: 0 }}>{v.specialty}</p>
                          </div>
                          {/* 3 icon-only action buttons */}
                          <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
                            <a href={v.instagram} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(122,15,70,0.08)', border: '1px solid rgba(122,15,70,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                              <InstaIcon size={14} color="#7A0F46" />
                            </a>
                            <a href={`https://wa.me/${v.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(37,211,102,0.09)', border: '1px solid rgba(37,211,102,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                              <MessageCircle size={14} color="#25D366" strokeWidth={2} />
                            </a>
                            <a href={`tel:${v.phone}`}
                              onClick={e => e.stopPropagation()}
                              style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(26,20,16,0.04)', border: '1px solid rgba(26,20,16,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                              <Phone size={14} color="rgba(26,20,16,0.55)" strokeWidth={2} />
                            </a>
                          </div>
                        </div>
                        {/* Family opinion summary */}
                        {reactionSummary && (
                          <div className="flex items-center gap-1.5" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="flex items-center gap-0.5">
                              {likeCount > 0 && <ThumbsUp size={10} color="#2D6025" fill="rgba(45,96,37,0.25)" strokeWidth={2} />}
                              {dislikeCount > 0 && <ThumbsDown size={10} color="#B03A10" fill="rgba(176,58,16,0.18)" strokeWidth={2} />}
                            </div>
                            <p className="font-cormorant italic" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.58)', margin: 0, lineHeight: 1.35 }}>
                              {reactionSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </>
  )
}

// ── Date picker mini-modal ────────────────────────────────────────────────────
function DatePickerModal({ task, onClose, onSave }) {
  const [date, setDate] = useState(task.dueDate || '')
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 70 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 71, padding: '20px 20px 36px' }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: '0 0 4px', textAlign: 'center' }}>Set due date</p>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: '0 0 18px' }}>{task.title}</p>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="font-work-sans"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 13, border: '1px solid rgba(122,15,70,0.3)', fontSize: '14px', fontWeight: 400, color: '#1A1410', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
        />
        <div className="flex gap-2">
          <button onClick={onClose}
            className="font-work-sans flex-1"
            style={{ padding: '13px', borderRadius: 13, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.03)', fontSize: '14px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => { onSave(date); onClose() }}
            className="font-work-sans flex-1"
            style={{ padding: '13px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.28)' }}>
            Save
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ── Task tile ─────────────────────────────────────────────────────────────────
function TaskTile({ task, onToggle, onSetDue, onEdit, onDetail, compact = false }) {
  const cat = taskCategories[task.category] || taskCategories.vendors
  const dueLabel = task.dueDate ? formatDue(task.dueDate) : 'No date'
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.done
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: task.done ? 0.6 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={spring}
        className="glass-card"
        style={{ padding: compact ? '12px 12px' : '13px 14px', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            border: `2px solid ${task.done ? '#7A0F46' : 'rgba(0,0,0,0.18)'}`,
            background: task.done ? '#7A0F46' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s ease',
          }}
        >
          {task.done && <Check size={12} color="#FFFFFF" strokeWidth={2.5} />}
        </button>

        {/* Content — tappable to open detail drawer */}
        <div style={{ flex: 1, minWidth: 0, cursor: task.done ? 'default' : 'pointer' }}
          onClick={() => !task.done && onDetail && onDetail(task)}>
          <p className="font-work-sans" style={{
            fontSize: compact ? '12px' : '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 3px',
            textDecoration: task.done ? 'line-through' : 'none',
            opacity: task.done ? 0.55 : 1,
          }}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category chip */}
            <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '2px 7px', letterSpacing: '0.04em' }}>
              {cat.label.split(' ')[0].toUpperCase()}
            </span>
            {/* Due date */}
            <button
              onClick={() => !task.done && setShowDatePicker(true)}
              className="font-work-sans flex items-center gap-1"
              style={{ fontSize: '10px', fontWeight: 400, color: isOverdue ? '#B03A10' : 'rgba(26,20,16,0.54)', background: 'none', border: 'none', cursor: task.done ? 'default' : 'pointer', padding: 0 }}
            >
              <Calendar size={9} strokeWidth={2} />
              {dueLabel}
            </button>
          </div>
        </div>

        {/* Square category image */}
        <div style={{ width: compact ? 48 : 56, height: compact ? 48 : 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, opacity: task.done ? 0.4 : 1 }}>
          <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </motion.div>

      {/* Date picker portal */}
      <AnimatePresence>
        {showDatePicker && (
          <DatePickerModal
            task={task}
            onClose={() => setShowDatePicker(false)}
            onSave={(date) => onSetDue(task.id, date)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ category, tasks, onToggle, onSetDue, onEdit, onDetail }) {
  const [open, setOpen] = useState(true)
  const cat = taskCategories[category] || taskCategories.vendors
  const undone = tasks.filter(t => !t.done)
  if (undone.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 w-full"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 10px', marginBottom: 0 }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.62)', letterSpacing: '0.08em', flex: 1, textAlign: 'left' }}>
          {cat.label.toUpperCase()} · {undone.length}
        </span>
        {open ? <ChevronUp size={12} color="rgba(26,20,16,0.3)" /> : <ChevronDown size={12} color="rgba(26,20,16,0.3)" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2">
            {undone.map(t => <TaskTile key={t.id} task={t} onToggle={onToggle} onSetDue={onSetDue} onEdit={onEdit} onDetail={onDetail} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── History section ───────────────────────────────────────────────────────────
function HistorySection({ tasks, onToggle }) {
  const [open, setOpen] = useState(false)
  const done = tasks.filter(t => t.done)
  if (done.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 w-full"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0 10px' }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2D6025', flexShrink: 0 }} />
        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.62)', letterSpacing: '0.08em', flex: 1, textAlign: 'left' }}>
          COMPLETED · {done.length}
        </span>
        {open ? <ChevronUp size={12} color="rgba(26,20,16,0.3)" /> : <ChevronDown size={12} color="rgba(26,20,16,0.3)" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2">
            {done.map(task => (
              <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card flex items-center gap-3"
                style={{ padding: '11px 14px', opacity: 0.65 }}>
                {/* Undo button */}
                <button
                  onClick={() => onToggle(task.id)}
                  title="Mark as not done"
                  style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', border: '2px solid #7A0F46', background: '#7A0F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', margin: 0, textDecoration: 'line-through' }}>{task.title}</p>
                  <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.50)', margin: '2px 0 0' }}>
                    {taskCategories[task.category]?.label || ''} · Completed
                  </p>
                </div>
                <button onClick={() => onToggle(task.id)}
                  className="font-work-sans flex items-center gap-1"
                  style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(26,20,16,0.4)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 99, padding: '4px 9px', cursor: 'pointer', flexShrink: 0 }}>
                  <RotateCcw size={9} />
                  Undo
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Add Task Sheet ────────────────────────────────────────────────────────────
function AddTaskSheet({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('venue')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')

  const submit = () => {
    if (!title.trim()) return
    onAdd({
      id: `t-${Date.now()}`,
      title: title.trim(),
      category,
      dueDate,
      priority,
      done: false,
      description: '',
    })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 60 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, padding: '20px 20px 36px' }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 18px' }} />
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0 }}>New task</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} color="rgba(26,20,16,0.4)" />
          </button>
        </div>

        {/* Title */}
        <div className="glass-input flex items-center" style={{ padding: '12px 14px', marginBottom: 12 }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title…"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ fontSize: '14px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Category */}
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>CATEGORY</p>
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
          {Object.entries(taskCategories).map(([key, cat]) => (
            <button key={key} onClick={() => setCategory(key)}
              className="font-work-sans"
              style={{ fontSize: '10px', fontWeight: 500, padding: '5px 11px', borderRadius: 99, cursor: 'pointer', transition: 'all 0.15s ease',
                border: category === key ? '1px solid rgba(122,15,70,0.45)' : '1px solid rgba(0,0,0,0.09)',
                background: category === key ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)',
                color: category === key ? '#7A0F46' : 'rgba(26,20,16,0.5)',
              }}>
              {cat.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Priority + Due date row */}
        <div className="flex gap-2" style={{ marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>PRIORITY</p>
            <div className="flex gap-1">
              {['high', 'medium', 'low'].map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="font-work-sans flex-1"
                  style={{ fontSize: '10px', fontWeight: 500, padding: '6px 0', borderRadius: 9, cursor: 'pointer', transition: 'all 0.15s ease', textTransform: 'capitalize',
                    border: priority === p ? '1px solid rgba(122,15,70,0.45)' : '1px solid rgba(0,0,0,0.09)',
                    background: priority === p ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)',
                    color: priority === p ? '#7A0F46' : 'rgba(26,20,16,0.5)',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>DUE DATE</p>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="font-work-sans"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 400, color: '#1A1410', outline: 'none', boxSizing: 'border-box', background: '#FFFBF5' }}
            />
          </div>
        </div>

        <button onClick={submit} disabled={!title.trim()}
          className="w-full font-work-sans"
          style={{ background: title.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.06)', color: title.trim() ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '14px', borderRadius: 14, border: 'none', cursor: title.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease', boxShadow: title.trim() ? '0 4px 14px rgba(122,15,70,0.25)' : 'none' }}>
          Add task
        </button>
      </motion.div>
    </>
  )
}

// ── Edit Task Sheet ───────────────────────────────────────────────────────────
function EditTaskSheet({ task, onClose, onSave }) {
  const [title, setTitle]       = useState(task.title)
  const [category, setCategory] = useState(task.category)
  const [dueDate, setDueDate]   = useState(task.dueDate || '')
  const [priority, setPriority] = useState(task.priority || 'medium')

  const submit = () => {
    if (!title.trim()) return
    onSave({ ...task, title: title.trim(), category, dueDate, priority })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 60 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, padding: '20px 20px 36px' }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 18px' }} />
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Edit task</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} color="rgba(26,20,16,0.4)" />
          </button>
        </div>

        {/* Title */}
        <div className="glass-input flex items-center" style={{ padding: '12px 14px', marginBottom: 12 }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title…"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ fontSize: '14px', fontWeight: 400, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Category */}
        <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>CATEGORY</p>
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
          {Object.entries(taskCategories).map(([key, cat]) => (
            <button key={key} onClick={() => setCategory(key)}
              className="font-work-sans"
              style={{ fontSize: '10px', fontWeight: 500, padding: '5px 11px', borderRadius: 99, cursor: 'pointer', transition: 'all 0.15s ease',
                border: category === key ? '1px solid rgba(122,15,70,0.45)' : '1px solid rgba(0,0,0,0.09)',
                background: category === key ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)',
                color: category === key ? '#7A0F46' : 'rgba(26,20,16,0.5)',
              }}>
              {cat.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Priority + Due date row */}
        <div className="flex gap-2" style={{ marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>PRIORITY</p>
            <div className="flex gap-1">
              {['high', 'medium', 'low'].map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="font-work-sans flex-1"
                  style={{ fontSize: '10px', fontWeight: 500, padding: '6px 0', borderRadius: 9, cursor: 'pointer', transition: 'all 0.15s ease', textTransform: 'capitalize',
                    border: priority === p ? '1px solid rgba(122,15,70,0.45)' : '1px solid rgba(0,0,0,0.09)',
                    background: priority === p ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)',
                    color: priority === p ? '#7A0F46' : 'rgba(26,20,16,0.5)',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>DUE DATE</p>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="font-work-sans"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 400, color: '#1A1410', outline: 'none', boxSizing: 'border-box', background: '#FFFBF5' }}
            />
          </div>
        </div>

        <button onClick={submit} disabled={!title.trim()}
          className="w-full font-work-sans"
          style={{ background: title.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.06)', color: title.trim() ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '14px', borderRadius: 14, border: 'none', cursor: title.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease', boxShadow: title.trim() ? '0 4px 14px rgba(122,15,70,0.25)' : 'none' }}>
          Save changes
        </button>
      </motion.div>
    </>
  )
}

// ── Main TasksScreen ──────────────────────────────────────────────────────────
export default function TasksScreen({ tasks, setTasks }) {
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [whenFilter,     setWhenFilter]     = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showSearch,     setShowSearch]     = useState(false)
  const [searchQuery,    setSearchQuery]    = useState('')
  const [showAdd, setShowAdd]         = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [detailTask, setDetailTask]   = useState(null)

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [setTasks])

  const setDue = useCallback((id, date) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, dueDate: date } : t))
  }, [setTasks])

  const addTask = useCallback((task) => {
    setTasks(prev => [task, ...prev])
  }, [setTasks])

  const saveEdit = useCallback((updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }, [setTasks])

  const updateAssignees = useCallback((id, assignees) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignees } : t))
    // keep detail drawer in sync
    setDetailTask(prev => prev?.id === id ? { ...prev, assignees } : prev)
  }, [setTasks])

  // Date helpers
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const inOneWeek = new Date(today); inOneWeek.setDate(today.getDate() + 7)

  const undoneTasks = tasks.filter(t => !t.done)
  const highCount = undoneTasks.filter(t => t.priority === 'high').length
  const doneCount = tasks.filter(t => t.done).length

  const filteredTasks = undoneTasks.filter(t => {
    // Status filter
    if (statusFilter === 'urgent' && t.priority !== 'high') return false
    if (statusFilter === 'upcoming') {
      const d = t.dueDate ? new Date(t.dueDate + 'T00:00:00') : null
      if (!d || d < today || d > inOneWeek) return false
    }
    if (statusFilter === 'pending') {
      if (t.priority === 'high') return false
      const d = t.dueDate ? new Date(t.dueDate + 'T00:00:00') : null
      if (d && d <= inOneWeek) return false
    }
    // When filter
    if (whenFilter !== 'all') {
      if (!t.dueDate) return false
      const d = new Date(t.dueDate + 'T00:00:00')
      if (whenFilter === 'today'     && d.getTime() !== today.getTime())     return false
      if (whenFilter === 'tomorrow'  && d.getTime() !== tomorrow.getTime())  return false
      if (whenFilter === 'yesterday' && d.getTime() !== yesterday.getTime()) return false
      if (whenFilter === 'this_week' && (d < today || d > inOneWeek))        return false
    }
    // Category filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    // Search
    if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />

        <div className="flex flex-col px-5 gap-4">
          {/* Header */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 500, margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>Tasks</h1>
            <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: '0 0 14px' }}>
              {undoneTasks.length} pending · {highCount} urgent · {doneCount} done
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full font-work-sans flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.28)' }}>
              <Plus size={15} color="#FFFFFF" strokeWidth={2.2} />
              Add a task
            </button>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => { setShowSearch(v => !v); if (showSearch) setSearchQuery('') }}
                style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0, cursor: 'pointer',
                  border: showSearch ? '1px solid rgba(122,15,70,0.40)' : '1px solid rgba(0,0,0,0.09)',
                  background: showSearch ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <Search size={14} color={showSearch ? '#7A0F46' : 'rgba(26,20,16,0.45)'} strokeWidth={2} />
              </button>
              {/* Dropdowns */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ flex: 1, paddingBottom: 2 }}>
                <FilterDropdown
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all',      label: 'All status'  },
                    { value: 'urgent',   label: 'Urgent'      },
                    { value: 'upcoming', label: 'Upcoming'    },
                    { value: 'pending',  label: 'Pending'     },
                  ]}
                />
                <FilterDropdown
                  label="When"
                  value={whenFilter}
                  onChange={setWhenFilter}
                  options={[
                    { value: 'all',       label: 'Any time'   },
                    { value: 'today',     label: 'Today'      },
                    { value: 'tomorrow',  label: 'Tomorrow'   },
                    { value: 'yesterday', label: 'Yesterday'  },
                    { value: 'this_week', label: 'This week'  },
                  ]}
                />
                <FilterDropdown
                  label="Category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: 'all', label: 'All categories' },
                    ...Object.entries(taskCategories).map(([key, cat]) => ({
                      value: key,
                      label: cat.label,
                    })),
                  ]}
                />
              </div>
            </div>

            {/* Animated search input */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ overflow: 'hidden' }}>
                  <div className="glass-input flex items-center gap-2" style={{ padding: '10px 13px' }}>
                    <Search size={13} color="rgba(26,20,16,0.35)" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks…"
                      className="font-work-sans"
                      style={{ flex: 1, fontSize: '13px', fontWeight: 400, color: '#1A1410', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                        <X size={13} color="rgba(26,20,16,0.4)" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {sortedTasks.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-center"
                  style={{ padding: '32px 0' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <Check size={24} color="#2D6025" />
                  </div>
                  <p className="font-work-sans" style={{ fontSize: '14px', fontWeight: 500, color: '#2D6025', margin: 0 }}>All caught up!</p>
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>No tasks match this filter</p>
                </motion.div>
              ) : (
                sortedTasks.map(task => (
                  <TaskTile key={task.id} task={task} onToggle={toggleTask} onSetDue={setDue} onEdit={setEditingTask} onDetail={setDetailTask} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Completed history */}
          <HistorySection tasks={tasks} onToggle={toggleTask} />

          <div style={{ height: '80px' }} />
        </div>
      </div>

      <BottomNav />

      <AnimatePresence>
        {showAdd && <AddTaskSheet onClose={() => setShowAdd(false)} onAdd={addTask} />}
        <AnimatePresence>
          {detailTask && (
            <TaskDetailDrawer
              task={detailTask}
              onClose={() => setDetailTask(null)}
              onEdit={setEditingTask}
              onUpdateAssignees={updateAssignees}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editingTask && (
            <EditTaskSheet task={editingTask} onClose={() => setEditingTask(null)} onSave={saveEdit} />
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  )
}
