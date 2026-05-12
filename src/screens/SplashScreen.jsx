import { useEffect } from 'react'
import { motion } from 'framer-motion'

const MAGENTA = '#7A0F46'
const IC = 'rgba(255,255,255,0.76)'   // icon stroke colour

/* ── Inline SVG icons (white line-art) ────────────────────────────────────── */

const Kalash = ({ size = 40 }) => (
  <svg width={size * 0.72} height={size} viewBox="0 0 29 40" fill="none"
    stroke={IC} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 5 38 C 1 29 1 17 4 11 Q 8 6 14.5 6 Q 21 6 25 11 C 28 17 28 29 24 38 Z" />
    <path d="M 9 6 L 9 3 L 20 3 L 20 6" />
    <path d="M 14.5 3 C 12 -2 9 -1 11 2" />
    <path d="M 14.5 3 C 17 -2 20 -1 18 2" />
    <path d="M 14.5 3 C 12 0 17 0 14.5 3" />
    <path d="M 4 21 Q 14.5 25 25 21" />
    <path d="M 5 28 Q 14.5 32 24 28" />
    <path d="M 6 38 L 23 38" />
  </svg>
)

const Trumpet = ({ size = 50 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 80 40" fill="none"
    stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="14" width="40" height="12" rx="2" />
    <path d="M 46 14 C 58 10 72 11 76 20 C 72 29 58 30 46 26" />
    <rect x="14" y="10" width="5" height="4" rx="1.5" />
    <rect x="23" y="10" width="5" height="4" rx="1.5" />
    <rect x="32" y="10" width="5" height="4" rx="1.5" />
    <path d="M 6 16 L 2 16 L 2 24 L 6 24" />
    <ellipse cx="1.5" cy="20" rx="1.5" ry="3" />
  </svg>
)

const Rings = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 42" fill="none"
    stroke={IC} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="15" cy="28" r="10" />
    <circle cx="25" cy="28" r="10" />
    <path d="M 20 10 L 16 15 L 20 20 L 24 15 Z" />
    <path d="M 16 15 L 24 15" />
    <line x1="20" y1="6" x2="20" y2="8" />
    <line x1="16.5" y1="7" x2="18" y2="9.5" />
    <line x1="23.5" y1="7" x2="22" y2="9.5" />
  </svg>
)

const MehndiHand = ({ size = 50, flip = false }) => (
  <svg width={size * 0.82} height={size} viewBox="0 0 41 50" fill="none"
    stroke={IC} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={flip ? { transform: 'scaleX(-1)' } : {}}>
    <path d="M 8 50 L 8 22 Q 8 15 13 13 Q 16 12 17 16 L 17 11 Q 17 7 21 7 Q 25 7 25 11 L 25 9 Q 25 5 28 5 Q 32 5 32 9 L 32 14 Q 34 12 36 16 L 36 32 Q 36 43 27 47 L 27 50" />
    <path d="M 8 28 Q 4 21 6 17 Q 8 14 11 18 L 11 28" />
    <path d="M 10 35 Q 19 39 31 36" />
    <path d="M 10 39 Q 19 43 31 40" />
    <circle cx="21" cy="29" r="3.5" />
    <circle cx="21" cy="29" r="1.2" fill={IC} stroke="none" />
    <circle cx="15" cy="27" r="1" fill={IC} stroke="none" />
    <circle cx="27" cy="28" r="1" fill={IC} stroke="none" />
  </svg>
)

const Fire = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
    stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="36" x2="37" y2="36" />
    <line x1="1" y1="39" x2="39" y2="39" />
    <path d="M 8 30 L 8 26 L 32 26 L 32 30" />
    <path d="M 20 7 C 14 11 11 18 15 23 C 17 26 14 29 20 30 C 26 29 23 26 25 23 C 29 18 26 11 20 7" />
    <path d="M 13 16 C 10 20 11 25 15 28" />
    <path d="M 27 16 C 30 20 29 25 25 28" />
  </svg>
)

const Baraat = ({ size = 64 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 72 65" fill="none"
    stroke={IC} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 36 16 C 22 10 9 14 7 22 C 22 17 50 17 65 22 C 62 14 50 10 36 16 Z" />
    <line x1="36" y1="16" x2="36" y2="30" />
    <path d="M 36 30 L 36 34 Q 40 36 36 38" />
    <circle cx="16" cy="32" r="4" />
    <line x1="16" y1="36" x2="16" y2="50" />
    <path d="M 16 50 L 10 58 M 16 50 L 22 58" />
    <path d="M 16 40 L 8 38 M 16 40 L 24 34" />
    <circle cx="36" cy="32" r="4" />
    <line x1="36" y1="36" x2="36" y2="50" />
    <path d="M 36 50 L 30 58 M 36 50 L 42 58" />
    <path d="M 36 40 L 28 44 M 36 40 L 44 36" />
    <circle cx="56" cy="32" r="4" />
    <line x1="56" y1="36" x2="56" y2="50" />
    <path d="M 56 50 L 50 58 M 56 50 L 62 58" />
    <path d="M 56 40 L 48 36 M 56 40 L 64 38" />
  </svg>
)

const Tabla = ({ size = 44 }) => (
  <svg width={size * 1.25} height={size * 0.72} viewBox="0 0 60 42" fill="none"
    stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="15" cy="36" rx="12" ry="4.5" />
    <line x1="3" y1="12" x2="3" y2="36" />
    <line x1="27" y1="12" x2="27" y2="36" />
    <path d="M 3 12 Q 10 6 15 6 Q 20 6 27 12" />
    <ellipse cx="15" cy="12" rx="12" ry="4.5" />
    <ellipse cx="15" cy="12" rx="7" ry="2.8" />
    <ellipse cx="46" cy="37" rx="10" ry="4" />
    <line x1="36" y1="16" x2="36" y2="37" />
    <line x1="56" y1="16" x2="56" y2="37" />
    <path d="M 36 16 Q 42 10 46 10 Q 50 10 56 16" />
    <ellipse cx="46" cy="16" rx="10" ry="4" />
    <ellipse cx="46" cy="16" rx="6" ry="2.5" />
  </svg>
)

const ClaspedHands = ({ size = 50 }) => (
  <svg width={size * 1.4} height={size * 0.65} viewBox="0 0 70 46" fill="none"
    stroke={IC} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 2 44 L 2 28 Q 2 22 7 20 L 20 17 Q 24 16 26 20 L 31 24" />
    <path d="M 9 18 L 8 11 Q 8 8 11 8 Q 14 8 14 11 L 14 16" />
    <path d="M 14 16 L 13 10 Q 13 7 16 7 Q 19 7 19 10 L 19 15" />
    <path d="M 19 15 L 19 10 Q 19 7 22 7 Q 25 7 25 10 L 25 16" />
    <path d="M 3 32 Q 15 36 28 32" />
    <path d="M 3 36 Q 15 40 28 36" />
    <path d="M 68 44 L 68 28 Q 68 22 63 20 L 50 17 Q 46 16 44 20 L 39 24" />
    <path d="M 61 18 L 62 11 Q 62 8 59 8 Q 56 8 56 11 L 56 16" />
    <path d="M 56 16 L 57 10 Q 57 7 54 7 Q 51 7 51 10 L 51 15" />
    <path d="M 51 15 L 51 10 Q 51 7 48 7 Q 45 7 45 10 L 45 16" />
    <path d="M 42 32 Q 54 36 67 32" />
    <path d="M 42 36 Q 54 40 67 36" />
    <path d="M 31 24 Q 35 21 39 24" />
  </svg>
)

/* ── Logo mark — the knot ─────────────────────────────────────────────────── */
const KnotMark = ({ size = 60 }) => (
  <svg width={size * 1.85} height={size} viewBox="0 0 93 50" fill="none"
    stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Upper-left lobe */}
    <path d="M 46.5 25 C 38 12 12 8 14 22 C 16 33 38 34 46.5 25" />
    {/* Upper-right lobe */}
    <path d="M 46.5 25 C 55 12 81 8 79 22 C 77 33 55 34 46.5 25" />
    {/* Lower-left lobe */}
    <path d="M 46.5 25 C 36 35 14 40 16 30 C 18 19 38 18 46.5 25" />
    {/* Lower-right lobe */}
    <path d="M 46.5 25 C 57 35 79 40 77 30 C 75 19 55 18 46.5 25" />
    {/* Center bead */}
    <circle cx="46.5" cy="25" r="4.5" fill="white" stroke="none" />
  </svg>
)

/* ── Icon placement config ───────────────────────────────────────────────── */
//  fy = float amplitude (px), fd = float duration (s), rot = max rotation (deg)
const ICONS = [
  // Top row
  { Comp: Trumpet,      size: 30, pos: { top: '3%',  left: '2%'  }, fy: 5, fd: 3.0, d: 0.10, rot:  7 },
  { Comp: Kalash,       size: 34, pos: { top: '0%',  left: '25%' }, fy: 6, fd: 2.8, d: 0.18           },
  { Comp: Kalash,       size: 34, pos: { top: '0%',  left: '57%' }, fy: 6, fd: 3.5, d: 0.12           },
  { Comp: Trumpet,      size: 30, pos: { top: '3%',  left: '80%' }, fy: 5, fd: 3.2, d: 0.06, rot: -7  },
  // Left edge
  { Comp: Baraat,       size: 58, pos: { top: '22%', left: '-3%' }, fy: 5, fd: 4.2, d: 0.22           },
  { Comp: Fire,         size: 36, pos: { top: '62%', left: '1%'  }, fy: 5, fd: 2.5, d: 0.28, rot: -4  },
  // Right edge
  { Comp: MehndiHand,   size: 48, pos: { top: '17%', left: '73%' }, fy: 6, fd: 3.8, d: 0.20           },
  { Comp: Baraat,       size: 52, pos: { top: '44%', left: '68%' }, fy: 4, fd: 4.0, d: 0.26           },
  // Below-center row
  { Comp: Trumpet,      size: 32, pos: { top: '64%', left: '18%' }, fy: 4, fd: 2.9, d: 0.08, rot: -5  },
  { Comp: Kalash,       size: 36, pos: { top: '62%', left: '58%' }, fy: 5, fd: 3.3, d: 0.16           },
  // Bottom row
  { Comp: MehndiHand,   size: 52, pos: { top: '73%', left: '-1%' }, fy: 4, fd: 3.0, d: 0.24, flip: true },
  { Comp: ClaspedHands, size: 42, pos: { top: '75%', left: '23%' }, fy: 4, fd: 3.4, d: 0.14           },
  { Comp: Rings,        size: 36, pos: { top: '73%', left: '65%' }, fy: 5, fd: 3.2, d: 0.20           },
  { Comp: Fire,         size: 34, pos: { top: '81%', left: '77%' }, fy: 3, fd: 2.6, d: 0.08, rot:  4  },
  { Comp: Tabla,        size: 42, pos: { top: '88%', left: '33%' }, fy: 3, fd: 3.0, d: 0.18           },
]

/* ── Floating icon wrapper ───────────────────────────────────────────────── */
function FloatingIcon({ Comp, size, pos, fy = 4, fd = 3, d = 0, rot, flip }) {
  return (
    <motion.div
      style={{ position: 'absolute', ...pos }}
      initial={{ opacity: 0, scale: 0.65 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: d, duration: 0.55, ease: 'easeOut' }}
    >
      <motion.div
        animate={{
          y: [-fy, fy],
          ...(rot ? { rotate: [-rot, rot] } : {}),
        }}
        transition={{
          duration: fd,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: d * 0.4,
        }}
      >
        <Comp size={size} flip={flip} />
      </motion.div>
    </motion.div>
  )
}

/* ── Splash Screen ───────────────────────────────────────────────────────── */
export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 4500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      style={{ position: 'relative', width: '100%', height: '100%', background: MAGENTA, overflow: 'hidden' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scattered wedding icons */}
      {ICONS.map((props, i) => <FloatingIcon key={i} {...props} />)}

      {/* Centre branding — knot logo + app name */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10,
      }}>
        {/* Knot mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.34, 1.45, 0.64, 1] }}
        >
          <KnotMark size={58} />
        </motion.div>

        {/* App name */}
        <motion.span
          className="font-cormorant italic"
          style={{ fontSize: '44px', color: '#FFFFFF', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, letterSpacing: '0.08em' }}
          animate={{ opacity: 1, letterSpacing: '-0.01em' }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          ShaadiMubarak
        </motion.span>

        {/* Divider */}
        <motion.div
          style={{ height: '1px', background: 'rgba(255,255,255,0.5)' }}
          initial={{ width: 0 }}
          animate={{ width: '52px' }}
          transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
        />

        {/* Tagline */}
        <motion.p
          className="font-outfit"
          style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.14em', margin: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          YOUR WEDDING, ALWAYS IN VIEW
        </motion.p>
      </div>
    </motion.div>
  )
}
