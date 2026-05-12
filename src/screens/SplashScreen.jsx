import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from '../components/layout/LogoMark'

const MAGENTA = '#7A0F46'

// Phase durations (ms)
const BRAND_DURATION = 2600   // branding screen hold time
const TOTAL_DURATION = 4800   // when onComplete fires

// Per-icon animation params: [y0, y1, r0, r1, duration, delay]
const ICON_ANIMS = [
  [-4,  4,  -1.5, 1.5,  3.2, 0.0 ],
  [-3,  5,   1.0,-1.0,  2.8, 0.4 ],
  [-5,  3,  -2.0, 2.0,  3.6, 0.8 ],
  [-3,  4,   1.5,-1.5,  3.0, 0.2 ],
  [-6,  4,  -1.0, 1.0,  4.0, 1.0 ],
  [-4,  6,   2.0,-2.0,  3.4, 0.6 ],
  [-5,  3,  -1.5, 1.5,  2.9, 0.3 ],
  [-3,  5,   1.0,-1.0,  3.7, 0.9 ],
  [-4,  4,  -2.0, 2.0,  3.1, 0.5 ],
  [-6,  3,   1.5,-1.5,  3.5, 0.1 ],
  [-3,  5,  -1.0, 1.0,  2.7, 0.7 ],
  [-5,  4,   2.0,-2.0,  3.8, 0.4 ],
  [-4,  6,  -1.5, 1.5,  3.2, 1.1 ],
  [-3,  4,   1.0,-1.0,  2.9, 0.2 ],
  [-5,  3,  -2.0, 2.0,  3.6, 0.8 ],
  [-4,  5,   1.5,-1.5,  3.3, 0.5 ],
  [-3,  4,  -1.0, 1.0,  4.1, 0.3 ],
  [-5,  3,   2.0,-2.0,  3.0, 0.9 ],
]

function buildIconCSS() {
  const sizing = `
    #splash-svg-host svg {
      width: 100%; height: 100%;
      position: absolute; inset: 0;
    }
  `
  return sizing + ICON_ANIMS.map(([y0, y1, r0, r1, dur, del], i) => `
    #ic-${i + 1} {
      animation: float${i + 1} ${dur}s ${del}s ease-in-out infinite alternate;
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes float${i + 1} {
      from { transform: translateY(${y0}px) rotate(${r0}deg); }
      to   { transform: translateY(${y1}px) rotate(${r1}deg); }
    }
  `).join('')
}

export default function SplashScreen({ onComplete }) {
  const [showIcons, setShowIcons] = useState(false)

  useEffect(() => {
    const brandTimer = setTimeout(() => setShowIcons(true), BRAND_DURATION)
    const doneTimer  = setTimeout(onComplete, TOTAL_DURATION)
    return () => { clearTimeout(brandTimer); clearTimeout(doneTimer) }
  }, [onComplete])

  // Fetch SVG into the always-present host div
  useEffect(() => {
    fetch('/vendor-icons.svg')
      .then(r => r.text())
      .then(html => {
        const container = document.getElementById('splash-svg-host')
        if (container) {
          container.innerHTML = html
          const svg = container.querySelector('svg')
          if (svg) {
            svg.setAttribute('width', '100%')
            svg.setAttribute('height', '100%')
            svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      style={{ position: 'relative', width: '100%', height: '100%', background: MAGENTA, overflow: 'hidden' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style>{buildIconCSS()}</style>

      {/* Icon field — always in the DOM so the fetch can populate it; fades in at phase 2 */}
      <motion.div
        id="splash-svg-host"
        animate={{ opacity: showIcons ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', zIndex: 5 }}
      />

      {/* ── Phase 1: plain magenta + logo + name ── */}
      <AnimatePresence>
        {!showIcons && (
          <motion.div
            key="brand"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              position: 'absolute', inset: 0, zIndex: 20,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12,
            }}
          >
            {/* Real logo — white */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.45, 0.64, 1] }}
            >
              <LogoMark light width={60} height={42} />
            </motion.div>

            {/* App name */}
            <motion.span
              className="font-cormorant italic"
              style={{ fontSize: '40px', color: '#FFFFFF', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}
              initial={{ opacity: 0, letterSpacing: '0.06em' }}
              animate={{ opacity: 1, letterSpacing: '-0.01em' }}
              transition={{ delay: 0.55, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Shaadi Mubarak
            </motion.span>

            {/* Divider */}
            <motion.div
              style={{ height: '1px', background: 'rgba(255,255,255,0.45)' }}
              initial={{ width: 0 }}
              animate={{ width: '48px' }}
              transition={{ delay: 1.05, duration: 0.5, ease: 'easeOut' }}
            />

            {/* Tagline */}
            <motion.p
              className="font-outfit"
              style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', letterSpacing: '0.14em', margin: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35, duration: 0.5 }}
            >
              YOUR WEDDING, ALWAYS IN VIEW
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
