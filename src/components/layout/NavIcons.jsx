import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { currentUser } from '../../data/mockData'

const initials = currentUser.name
  .split(' ')
  .filter(Boolean)
  .map(w => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

export default function NavIcons({ light = false }) {
  const navigate = useNavigate()

  // Light (hero overlay): frosted white circles
  // Default: magenta secondary button style
  const btnStyle = light
    ? {
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(6px)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }
    : {
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(122,15,70,0.06)',
        border: '1px solid rgba(122,15,70,0.28)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }

  const iconColor = light ? 'rgba(255,255,255,0.88)' : '#7A0F46'

  return (
    <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
      {/* Bell */}
      <button onClick={() => navigate('/notifications')} style={btnStyle}>
        <Bell size={17} color={iconColor} strokeWidth={1.8} />
      </button>

      {/* Initials avatar */}
      <button onClick={() => navigate('/profile')} style={btnStyle}>
        <span
          className="font-outfit"
          style={{
            fontSize: '11px', fontWeight: 600,
            color: iconColor,
            letterSpacing: '0.02em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {initials}
        </span>
      </button>
    </div>
  )
}
