import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FAMILY_MEMBERS, getActiveUser, setActiveUser } from '../../utils/familyUtils'

export default function NavIcons({ light = false }) {
  const navigate = useNavigate()
  const [activeUser, setActiveUserState] = useState(getActiveUser)
  const [showSwitcher, setShowSwitcher] = useState(false)

  // Re-sync when another component calls setActiveUser()
  useEffect(() => {
    const sync = () => setActiveUserState(getActiveUser())
    window.addEventListener('sm_user_change', sync)
    return () => window.removeEventListener('sm_user_change', sync)
  }, [])

  const handleSelect = (member) => {
    setActiveUser(member)
    setActiveUserState(member)
    setShowSwitcher(false)
  }

  const btnStyle = light
    ? { width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : { width: 36, height: 36, borderRadius: '50%', background: 'rgba(122,15,70,0.06)', border: '1px solid rgba(122,15,70,0.28)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }

  const iconColor = light ? 'rgba(255,255,255,0.88)' : '#7A0F46'

  return (
    <>
      <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
        <button onClick={() => navigate('/notifications')} style={btnStyle}>
          <Bell size={17} color={iconColor} strokeWidth={1.8} />
        </button>

        {/* Active-user avatar — tap to switch */}
        <button onClick={() => setShowSwitcher(true)} style={{ ...btnStyle, background: light ? 'rgba(255,255,255,0.22)' : activeUser.bg, border: light ? '1px solid rgba(255,255,255,0.30)' : `1.5px solid ${activeUser.color}44` }} title={`Logged in as ${activeUser.name}`}>
          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 700, color: light ? '#FFF' : activeUser.color, letterSpacing: '0.02em', lineHeight: 1, userSelect: 'none' }}>
            {activeUser.initials}
          </span>
        </button>
      </div>

      {/* ── Family switcher sheet ── */}
      <AnimatePresence>
        {showSwitcher && (
          <>
            <motion.div
              key="fsw-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSwitcher(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.45)', zIndex: 80 }}
            />
            <motion.div
              key="fsw-sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFBF5', borderRadius: '22px 22px 0 0', zIndex: 81, padding: '18px 18px 36px' }}
            >
              {/* Handle */}
              <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.10)', borderRadius: 99, margin: '0 auto 18px' }} />

              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div>
                  <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 500, color: '#1A1410', margin: 0, lineHeight: 1.1 }}>Switch family member</p>
                  <p className="font-work-sans" style={{ fontSize: '12px', color: 'rgba(26,20,16,0.45)', margin: '3px 0 0' }}>Logged in as <strong style={{ color: activeUser.color }}>{activeUser.name}</strong></p>
                </div>
                <button onClick={() => setShowSwitcher(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={15} color="rgba(26,20,16,0.50)" strokeWidth={2} />
                </button>
              </div>

              {/* Member grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {FAMILY_MEMBERS.map(member => {
                  const isActive = member.id === activeUser.id
                  return (
                    <button key={member.id} onClick={() => handleSelect(member)}
                      className="flex items-center gap-3 font-work-sans"
                      style={{ padding: '12px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', border: isActive ? `1.5px solid ${member.color}55` : '1px solid rgba(0,0,0,0.08)', background: isActive ? member.bg : 'rgba(0,0,0,0.02)', transition: 'all 0.15s' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: isActive ? member.color : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#FFF' : 'rgba(26,20,16,0.40)' }}>{member.initials}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: isActive ? member.color : '#1A1410', margin: 0 }}>{member.name}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(26,20,16,0.40)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.role}</p>
                      </div>
                      {isActive && <Check size={14} color={member.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
