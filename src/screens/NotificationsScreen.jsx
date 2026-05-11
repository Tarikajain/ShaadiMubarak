import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Zap, Bell } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25,0.1,0.25,1] } } }

const notifications = [
  {
    id: 1, group: 'TODAY',
    icon: AlertTriangle, iconColor: '#B03A10', iconBg: 'rgba(122,15,70,0.08)',
    title: 'Rekha Mehndi Art unresponsive',
    body: 'No confirmation in 48h. Baraat timeline may be affected.',
    time: '2m ago', unread: true,
  },
  {
    id: 2, group: 'TODAY',
    icon: Zap, iconColor: '#A07020', iconBg: 'rgba(200,151,58,0.1)',
    title: 'Pandit Sureshji hard stop reminder',
    body: 'Ceremony must end by 8:30 PM. Pheras window is 45 min.',
    time: '1h ago', unread: true,
  },
  {
    id: 3, group: 'TODAY',
    icon: CheckCircle, iconColor: '#2D6025', iconBg: 'rgba(61,122,52,0.08)',
    title: 'Grand Decorators confirmed',
    body: 'Setup crew arrives at 2:00 PM for Sangeet venue.',
    time: '3h ago', unread: false,
  },
  {
    id: 4, group: 'YESTERDAY',
    icon: CheckCircle, iconColor: '#2D6025', iconBg: 'rgba(61,122,52,0.08)',
    title: 'Rajan Photography confirmed',
    body: 'All events confirmed. Shot list shared via email.',
    time: '1d ago', unread: false,
  },
  {
    id: 5, group: 'YESTERDAY',
    icon: Clock, iconColor: 'rgba(26,20,16,0.45)', iconBg: 'rgba(0,0,0,0.05)',
    title: 'Rhythm DJ Services pending',
    body: 'No response to last follow-up. Consider sending another.',
    time: '1d ago', unread: false,
  },
  {
    id: 6, group: 'YESTERDAY',
    icon: CheckCircle, iconColor: '#2D6025', iconBg: 'rgba(61,122,52,0.08)',
    title: 'Aromas Catering confirmed',
    body: 'Menu finalised. 317 guest count locked in.',
    time: '2d ago', unread: false,
  },
]

const groups = ['TODAY', 'YESTERDAY']

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const [items, setItems] = useState(notifications)
  const unreadCount = items.filter(n => n.unread).length
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('notif_enabled') === '1')
  const showBanner = !pushEnabled && localStorage.getItem('notif_dismissed') === '1'

  const handleEnableNotifs = async () => {
    if ('Notification' in window) await Notification.requestPermission()
    localStorage.setItem('notif_enabled', '1')
    localStorage.removeItem('notif_dismissed')
    setPushEnabled(true)
  }

  const markAllRead = () => setItems(ns => ns.map(n => ({ ...n, unread: false })))

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="flex items-center px-5 mt-2 mb-5" style={{ position: 'relative', minHeight: '34px' }}>
            <button onClick={() => navigate('/')} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowLeft size={15} color="rgba(26,20,16,0.6)" />
            </button>
            <div className="flex items-center gap-2" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <h1 className="font-outfit" style={{ fontSize: '18px', fontWeight: 500, color: '#1A1410', margin: 0, whiteSpace: 'nowrap' }}>Notifications</h1>
              {unreadCount > 0 && (
                <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 600, background: '#7A0F46', color: '#FFFFFF', padding: '2px 7px', borderRadius: '99px' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="font-outfit" style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: '#A07020', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Mark all read
              </button>
            )}
          </motion.div>

          {/* Push notifications banner */}
          {showBanner && (
            <motion.div
              variants={item}
              className="mx-5 mb-2"
              style={{ background: 'linear-gradient(135deg, rgba(122,15,70,0.07) 0%, rgba(92,11,53,0.04) 100%)', border: '1px solid rgba(122,15,70,0.18)', borderRadius: '14px', padding: '14px 16px' }}
            >
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(122,15,70,0.1)', border: '1px solid rgba(122,15,70,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={16} color="#7A0F46" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px' }}>Stay ahead of every moment</p>
                  <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.5)', margin: 0 }}>Enable push alerts for vendor updates &amp; crisis warnings</p>
                </div>
                <button
                  onClick={handleEnableNotifs}
                  className="font-outfit flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '11px', fontWeight: 500, padding: '8px 13px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 3px 10px rgba(122,15,70,0.25)', whiteSpace: 'nowrap' }}
                >
                  Enable
                </button>
              </div>
            </motion.div>
          )}

          {groups.map(group => {
            const groupItems = items.filter(n => n.group === group)
            if (!groupItems.length) return null
            return (
              <div key={group}>
                <motion.div variants={item} className="flex items-center justify-between px-5 mb-3">
                  <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(26,20,16,0.35)', letterSpacing: '0.14em' }}>{group}</span>
                </motion.div>

                <div className="flex flex-col gap-px px-5 mb-5">
                  {groupItems.map((notif, i) => {
                    const Icon = notif.icon
                    return (
                      <motion.div
                        key={notif.id}
                        variants={item}
                        onClick={() => setItems(ns => ns.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                        className="glass-card flex items-start gap-3 cursor-pointer"
                        style={{
                          padding: '14px 16px',
                          borderRadius: i === 0 ? '14px 14px 4px 4px' : i === groupItems.length - 1 ? '4px 4px 14px 14px' : '4px',
                          borderLeft: notif.unread ? '3px solid #7A0F46' : '3px solid transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: notif.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={15} color={notif.iconColor} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p className="font-outfit" style={{ fontSize: '13px', fontWeight: notif.unread ? 500 : 400, color: '#1A1410', margin: 0, lineHeight: 1.3 }}>{notif.title}</p>
                            <span className="font-outfit flex-shrink-0" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.35)' }}>{notif.time}</span>
                          </div>
                          <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.52)', margin: 0, lineHeight: 1.5 }}>{notif.body}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
