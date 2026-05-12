import { useState, useContext, createContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown, ChevronUp, Calendar, Check, RotateCcw, X, Pencil, MapPin, Users, UserPlus, MessageCircle, Navigation } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { initialTasks, taskCategories, formatDue } from '../data/tasksData'

const spring = { type: 'spring', stiffness: 420, damping: 32 }
const FILTERS = ['All', 'Today', 'This week', 'By category']

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

// ── Task Detail Drawer ────────────────────────────────────────────────────────
function TaskDetailDrawer({ task, onClose, onEdit, onUpdateAssignees }) {
  const cat = taskCategories[task.category] || taskCategories.vendors
  const pri = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const [showAssignPicker, setShowAssignPicker] = useState(false)
  const assignees = (task.assignees || []).map(id => WEDDING_PEOPLE.find(p => p.id === id)).filter(Boolean)

  const toggleAssignee = (personId) => {
    const current = task.assignees || []
    const next = current.includes(personId)
      ? current.filter(id => id !== personId)
      : [...current, personId]
    onUpdateAssignees(task.id, next)
  }

  const mapsUrl = task.location
    ? `https://maps.google.com/?q=${encodeURIComponent(task.location)}`
    : null

  return (
    <>
      <motion.div key="td-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.40)', zIndex: 60 }} />
      <motion.div key="td-sh"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, maxHeight: '88%', overflowY: 'auto' }}
      >
        {/* Cover image with gradient overlay */}
        <div style={{ position: 'relative', height: 148, flexShrink: 0, overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
          <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(26,20,16,0.65) 100%)' }} />
          {/* Drag handle */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.45)' }} />
          {/* Category chip */}
          <span className="font-outfit" style={{ position: 'absolute', top: 22, left: 20, fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.22)', padding: '3px 9px', borderRadius: 99, letterSpacing: '0.06em' }}>
            {cat.label.toUpperCase()}
          </span>
          {/* Priority badge */}
          <span className="font-outfit" style={{ position: 'absolute', top: 22, right: 20, fontSize: '9px', fontWeight: 700, color: pri.color, background: 'rgba(255,255,255,0.92)', border: `1px solid ${pri.border}`, padding: '3px 9px', borderRadius: 99, letterSpacing: '0.05em' }}>
            {pri.label.toUpperCase()}
          </span>
          {/* Title on image */}
          <p className="font-cormorant italic" style={{ position: 'absolute', bottom: 16, left: 20, right: 20, fontSize: '22px', fontWeight: 300, color: '#FFFFFF', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {task.title}
          </p>
        </div>

        <div style={{ padding: '18px 20px 40px' }}>

          {/* Due date row */}
          <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
            <Calendar size={13} color="rgba(26,20,16,0.38)" />
            <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.55)' }}>
              {task.dueDate ? formatDue(task.dueDate) : 'No due date set'}
            </span>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 18 }}>
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 7px' }}>Location</p>
            {task.location ? (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(26,20,16,0.03)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '10px 12px', textDecoration: 'none' }}>
                <MapPin size={14} color="#7A0F46" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 400, color: '#1A1410', flex: 1 }}>{task.location}</span>
                <Navigation size={11} color="#7A0F46" strokeWidth={2} style={{ flexShrink: 0 }} />
              </a>
            ) : (
              <div className="flex items-center gap-2" style={{ padding: '10px 12px', background: 'rgba(26,20,16,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12 }}>
                <MapPin size={14} color="rgba(26,20,16,0.25)" strokeWidth={2} />
                <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.38)' }}>No visit needed — handle remotely</span>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div style={{ marginBottom: 18 }}>
              <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 7px' }}>Notes</p>
              <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.65)', margin: 0, lineHeight: 1.6 }}>{task.description}</p>
            </div>
          )}

          {/* Assigned to */}
          <div style={{ marginBottom: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                Assigned to {assignees.length > 0 ? `· ${assignees.length}` : ''}
              </p>
              <button onClick={() => setShowAssignPicker(v => !v)}
                className="font-outfit flex items-center gap-1"
                style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46', background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.22)', padding: '5px 11px', borderRadius: 99, cursor: 'pointer' }}>
                <UserPlus size={11} /> {showAssignPicker ? 'Done' : 'Assign'}
              </button>
            </div>

            {/* Assignee pills */}
            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2" style={{ marginBottom: showAssignPicker ? 12 : 0 }}>
                {assignees.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 font-outfit"
                    style={{ background: p.bg, border: `1px solid ${p.color}30`, borderRadius: 99, padding: '5px 10px 5px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: '#FFFFFF' }}>{p.initials}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: p.color }}>{p.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: 300, color: 'rgba(26,20,16,0.4)' }}>{p.role}</span>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${p.name}! Could you help with: "${task.title}"? 🙏`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                      <MessageCircle size={11} color={p.color} strokeWidth={2} />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* People picker */}
            <AnimatePresence>
              {showAssignPicker && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {WEDDING_PEOPLE.map(p => {
                      const isAssigned = (task.assignees || []).includes(p.id)
                      return (
                        <button key={p.id} onClick={() => toggleAssignee(p.id)}
                          className="flex items-center gap-2 font-outfit"
                          style={{ padding: '9px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', border: isAssigned ? `1.5px solid ${p.color}55` : '1px solid rgba(0,0,0,0.08)', background: isAssigned ? p.bg : 'rgba(0,0,0,0.02)' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: isAssigned ? p.color : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: isAssigned ? '#FFFFFF' : 'rgba(26,20,16,0.4)' }}>{p.initials}</span>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '12px', fontWeight: 500, color: isAssigned ? p.color : '#1A1410', margin: 0 }}>{p.name}</p>
                            <p style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.role}</p>
                          </div>
                          {isAssigned && <Check size={12} color={p.color} strokeWidth={2.5} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {assignees.length === 0 && !showAssignPicker && (
              <div className="flex items-center gap-2" style={{ padding: '10px 12px', background: 'rgba(26,20,16,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12 }}>
                <Users size={13} color="rgba(26,20,16,0.25)" />
                <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.38)' }}>Not yet assigned to anyone</span>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex gap-2">
            <button onClick={() => { onClose(); setTimeout(() => onEdit(task), 100) }}
              className="font-outfit flex items-center justify-center gap-2 flex-1"
              style={{ padding: '13px', borderRadius: 13, border: '1px solid rgba(122,15,70,0.28)', background: 'rgba(122,15,70,0.05)', fontSize: '13px', fontWeight: 500, color: '#7A0F46', cursor: 'pointer' }}>
              <Pencil size={13} /> Edit task
            </button>
            <button onClick={onClose}
              className="font-outfit flex-1"
              style={{ padding: '13px', borderRadius: 13, border: '1px solid rgba(0,0,0,0.09)', background: 'rgba(0,0,0,0.02)', fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', cursor: 'pointer' }}>
              Close
            </button>
          </div>
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 70 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 71, padding: '20px 20px 36px', maxWidth: 430, margin: '0 auto' }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 20px' }} />
        <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 300, color: '#1A1410', margin: '0 0 4px' }}>Set due date</p>
        <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: '0 0 18px' }}>{task.title}</p>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="font-outfit"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 13, border: '1px solid rgba(122,15,70,0.3)', fontSize: '14px', fontWeight: 400, color: '#1A1410', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
        />
        <div className="flex gap-2">
          <button onClick={onClose}
            className="font-outfit flex-1"
            style={{ padding: '13px', borderRadius: 13, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.03)', fontSize: '14px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => { onSave(date); onClose() }}
            className="font-outfit flex-1"
            style={{ padding: '13px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.28)' }}>
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
          <p className="font-outfit" style={{
            fontSize: compact ? '12px' : '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 3px',
            textDecoration: task.done ? 'line-through' : 'none',
            opacity: task.done ? 0.55 : 1,
          }}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category chip */}
            <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 99, padding: '2px 7px', letterSpacing: '0.04em' }}>
              {cat.label.split(' ')[0].toUpperCase()}
            </span>
            {/* Due date */}
            <button
              onClick={() => !task.done && setShowDatePicker(true)}
              className="font-outfit flex items-center gap-1"
              style={{ fontSize: '10px', fontWeight: 400, color: isOverdue ? '#B03A10' : 'rgba(26,20,16,0.38)', background: 'none', border: 'none', cursor: task.done ? 'default' : 'pointer', padding: 0 }}
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
        <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.45)', letterSpacing: '0.08em', flex: 1, textAlign: 'left' }}>
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
        <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(26,20,16,0.45)', letterSpacing: '0.08em', flex: 1, textAlign: 'left' }}>
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
                  <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)', margin: 0, textDecoration: 'line-through' }}>{task.title}</p>
                  <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.35)', margin: '2px 0 0' }}>
                    {taskCategories[task.category]?.label || ''} · Completed
                  </p>
                </div>
                <button onClick={() => onToggle(task.id)}
                  className="font-outfit flex items-center gap-1"
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
          <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 300, color: '#1A1410', margin: 0 }}>New task</p>
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
            style={{ fontSize: '14px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }}
          />
        </div>

        {/* Category */}
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>CATEGORY</p>
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
          {Object.entries(taskCategories).map(([key, cat]) => (
            <button key={key} onClick={() => setCategory(key)}
              className="font-outfit"
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
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>PRIORITY</p>
            <div className="flex gap-1">
              {['high', 'medium', 'low'].map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="font-outfit flex-1"
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
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>DUE DATE</p>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="font-outfit"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 300, color: '#1A1410', outline: 'none', boxSizing: 'border-box', background: '#FFFBF5' }}
            />
          </div>
        </div>

        <button onClick={submit} disabled={!title.trim()}
          className="w-full font-outfit"
          style={{ background: title.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.06)', color: title.trim() ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 500, padding: '14px', borderRadius: 14, border: 'none', cursor: title.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease', boxShadow: title.trim() ? '0 4px 14px rgba(122,15,70,0.25)' : 'none' }}>
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.4)', zIndex: 60 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 61, padding: '20px 20px 36px' }}
      >
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 18px' }} />
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 300, color: '#1A1410', margin: 0 }}>Edit task</p>
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
            style={{ fontSize: '14px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }}
          />
        </div>

        {/* Category */}
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>CATEGORY</p>
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
          {Object.entries(taskCategories).map(([key, cat]) => (
            <button key={key} onClick={() => setCategory(key)}
              className="font-outfit"
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
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>PRIORITY</p>
            <div className="flex gap-1">
              {['high', 'medium', 'low'].map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="font-outfit flex-1"
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
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.4)', letterSpacing: '0.08em', margin: '0 0 8px' }}>DUE DATE</p>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="font-outfit"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 300, color: '#1A1410', outline: 'none', boxSizing: 'border-box', background: '#FFFBF5' }}
            />
          </div>
        </div>

        <button onClick={submit} disabled={!title.trim()}
          className="w-full font-outfit"
          style={{ background: title.trim() ? 'linear-gradient(135deg, #7A0F46, #5C0B35)' : 'rgba(0,0,0,0.06)', color: title.trim() ? '#FFFFFF' : 'rgba(26,20,16,0.3)', fontSize: '14px', fontWeight: 500, padding: '14px', borderRadius: 14, border: 'none', cursor: title.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.18s ease', boxShadow: title.trim() ? '0 4px 14px rgba(122,15,70,0.25)' : 'none' }}>
          Save changes
        </button>
      </motion.div>
    </>
  )
}

// ── Main TasksScreen ──────────────────────────────────────────────────────────
export default function TasksScreen({ tasks, setTasks }) {
  const [filter, setFilter]           = useState('All')
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

  // Filter undone tasks
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const inOneWeek = new Date(today); inOneWeek.setDate(today.getDate() + 7)

  const undoneTasks = tasks.filter(t => !t.done)
  const filteredTasks = filter === 'All' ? undoneTasks
    : filter === 'Today' ? undoneTasks.filter(t => { const d = new Date(t.dueDate); d.setHours(0,0,0,0); return d <= today })
    : filter === 'This week' ? undoneTasks.filter(t => { const d = new Date(t.dueDate); return d <= inOneWeek })
    : undoneTasks // By category handled below

  // Group by category for "By category" view
  const byCategory = {}
  if (filter === 'By category') {
    undoneTasks.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = []
      byCategory[t.category].push(t)
    })
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  const highCount = undoneTasks.filter(t => t.priority === 'high').length
  const doneCount = tasks.filter(t => t.done).length

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
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 300, margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>Tasks</h1>
            <p className="font-outfit text-center" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: '0 0 14px' }}>
              {undoneTasks.length} pending · {highCount} urgent · {doneCount} done
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full font-outfit flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7A0F46, #5C0B35)', color: '#FFFFFF', fontSize: '13px', fontWeight: 500, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,15,70,0.28)' }}>
              <Plus size={15} color="#FFFFFF" strokeWidth={2.2} />
              Add a task
            </button>
          </div>

          {/* Priority stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Urgent', value: undoneTasks.filter(t => t.priority === 'high').length, color: '#7A0F46', bg: 'rgba(122,15,70,0.06)', border: 'rgba(122,15,70,0.18)' },
              { label: 'This week', value: undoneTasks.filter(t => { const [y,m,d] = t.dueDate.split('-').map(Number); const dt = new Date(y,m-1,d); return dt <= inOneWeek }).length, color: '#1A5A6B', bg: 'rgba(26,90,107,0.06)', border: 'rgba(26,90,107,0.18)' },
              { label: 'Completed', value: doneCount, color: '#2D6025', bg: 'rgba(45,96,37,0.06)', border: 'rgba(45,96,37,0.18)' },
            ].map(s => (
              <div key={s.label} className="glass-card flex flex-col items-center text-center" style={{ padding: '12px 8px', border: `1px solid ${s.border}`, background: s.bg }}>
                <span className="font-outfit" style={{ fontSize: '22px', fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</span>
                <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', marginTop: '3px' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ paddingBottom: '2px' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="font-outfit flex-shrink-0"
                style={{ fontSize: '11px', fontWeight: 500, padding: '7px 16px', borderRadius: 99, cursor: 'pointer', transition: 'all 0.18s ease',
                  border: filter === f ? '1px solid rgba(122,15,70,0.45)' : '1px solid rgba(0,0,0,0.09)',
                  background: filter === f ? 'rgba(122,15,70,0.07)' : 'rgba(0,0,0,0.02)',
                  color: filter === f ? '#7A0F46' : 'rgba(26,20,16,0.5)',
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-2">
            {filter === 'By category' ? (
              Object.keys(taskCategories).map(cat =>
                byCategory[cat]?.length ? (
                  <CategorySection key={cat} category={cat} tasks={byCategory[cat]} onToggle={toggleTask} onSetDue={setDue} onEdit={setEditingTask} onDetail={setDetailTask} />
                ) : null
              )
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedTasks.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2 text-center"
                    style={{ padding: '32px 0' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(45,96,37,0.08)', border: '1px solid rgba(45,96,37,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <Check size={24} color="#2D6025" />
                    </div>
                    <p className="font-outfit" style={{ fontSize: '14px', fontWeight: 500, color: '#2D6025', margin: 0 }}>All caught up!</p>
                    <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>No tasks for this filter</p>
                  </motion.div>
                ) : (
                  sortedTasks.map(task => (
                    <TaskTile key={task.id} task={task} onToggle={toggleTask} onSetDue={setDue} onEdit={setEditingTask} onDetail={setDetailTask} />
                  ))
                )}
              </AnimatePresence>
            )}
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
