import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Store, Users, Sparkles, CheckSquare } from 'lucide-react'

const tabs = [
  { label: 'Today',      icon: Home,        path: '/' },
  { label: 'Ceremonies', icon: Sparkles,    path: '/ceremonies' },
  { label: 'Tasks',      icon: CheckSquare, path: '/tasks' },
  { label: 'Guests',     icon: Users,       path: '/guests' },
  { label: 'Vendors',    icon: Store,       path: '/vendors' },
]

const spring = { type: 'spring', stiffness: 480, damping: 28 }

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center justify-around px-1"
      style={{
        background: '#FFFBF5',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        height: '64px',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path
        return (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 min-w-[44px] py-1 relative"
            style={{ minHeight: '44px', background: 'none', border: 'none', cursor: 'pointer' }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            transition={spring}
          >
            <motion.div
              animate={{ scale: active ? 1.08 : 1 }}
              transition={spring}
            >
              <Icon
                size={19}
                style={{ color: active ? '#7A0F46' : 'rgba(26,20,16,0.3)' }}
                strokeWidth={active ? 2 : 1.5}
              />
            </motion.div>
            <span
              className="font-work-sans"
              style={{
                fontSize: '9px',
                fontWeight: active ? 600 : 400,
                color: active ? '#7A0F46' : 'rgba(26,20,16,0.3)',
                transition: 'color 0.18s ease',
              }}
            >
              {label}
            </span>
            {active && (
              <span
                key={path + '-dot'}
                className="absolute tab-dot-anim"
                style={{
                  width: '18px', height: '2.5px',
                  background: '#7A0F46',
                  bottom: '2px',
                  left: '50%',
                  borderRadius: '99px',
                  transformOrigin: 'center',
                }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
