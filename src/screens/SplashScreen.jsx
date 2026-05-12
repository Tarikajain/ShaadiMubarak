import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MAGENTA = '#7A0F46'

// Per-icon animation params: [translateY range, rotate range, duration, delay]
// Varied so icons feel independent, not synchronized
const ICON_ANIMS = [
  [-4,  4,  -1.5, 1.5,  3.2, 0.0 ],   // ic-1
  [-3,  5,   1.0,-1.0,  2.8, 0.4 ],   // ic-2
  [-5,  3,  -2.0, 2.0,  3.6, 0.8 ],   // ic-3
  [-3,  4,   1.5,-1.5,  3.0, 0.2 ],   // ic-4
  [-6,  4,  -1.0, 1.0,  4.0, 1.0 ],   // ic-5
  [-4,  6,   2.0,-2.0,  3.4, 0.6 ],   // ic-6
  [-5,  3,  -1.5, 1.5,  2.9, 0.3 ],   // ic-7
  [-3,  5,   1.0,-1.0,  3.7, 0.9 ],   // ic-8
  [-4,  4,  -2.0, 2.0,  3.1, 0.5 ],   // ic-9
  [-6,  3,   1.5,-1.5,  3.5, 0.1 ],   // ic-10
  [-3,  5,  -1.0, 1.0,  2.7, 0.7 ],   // ic-11
  [-5,  4,   2.0,-2.0,  3.8, 0.4 ],   // ic-12
  [-4,  6,  -1.5, 1.5,  3.2, 1.1 ],   // ic-13
  [-3,  4,   1.0,-1.0,  2.9, 0.2 ],   // ic-14
  [-5,  3,  -2.0, 2.0,  3.6, 0.8 ],   // ic-15
  [-4,  5,   1.5,-1.5,  3.3, 0.5 ],   // ic-16
  [-3,  4,  -1.0, 1.0,  4.1, 0.3 ],   // ic-17
  [-5,  3,   2.0,-2.0,  3.0, 0.9 ],   // ic-18
]

// Build the CSS animation block for all 18 icons + SVG sizing
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
  const [svgReady, setSvgReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(onComplete, 4500)
    return () => clearTimeout(t)
  }, [onComplete])

  // Fetch the pre-processed SVG (in /public)
  useEffect(() => {
    fetch('/vendor-icons.svg')
      .then(r => r.text())
      .then(html => {
        const container = document.getElementById('splash-svg-host')
        if (container) {
          container.innerHTML = html
          // Make SVG fill the screen
          const svg = container.querySelector('svg')
          if (svg) {
            svg.setAttribute('width', '100%')
            svg.setAttribute('height', '100%')
            svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
          }
          setSvgReady(true)
        }
      })
      .catch(() => setSvgReady(true))
  }, [])

  return (
    <motion.div
      style={{ position: 'relative', width: '100%', height: '100%', background: MAGENTA, overflow: 'hidden' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* CSS animations injected into <head> */}
      <style>{buildIconCSS()}</style>

      {/* SVG host — icons load here via fetch */}
      <div
        id="splash-svg-host"
        style={{
          position: 'absolute', inset: 0,
          // Scale the SVG content to fill the container
          display: 'flex', alignItems: 'stretch',
        }}
      />

      {/* Centre branding — knot logo + app name */}
      <AnimatePresence>
        {svgReady && (
          <motion.div
            key="branding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 10,
            }}
          >
            {/* Knot mark logo */}
            <motion.svg
              width="108" height="60"
              viewBox="0 0 90 50"
              fill="none"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.34, 1.45, 0.64, 1] }}
            >
              <path d="M 45 25 C 36 13 12 7 14 22 C 16 33 37 33 45 25" />
              <path d="M 45 25 C 54 13 78 7 76 22 C 74 33 53 33 45 25" />
              <path d="M 45 25 C 35 35 13 39 16 28 C 19 17 38 19 45 25" />
              <path d="M 45 25 C 55 35 77 39 74 28 C 71 17 52 19 45 25" />
              <circle cx="45" cy="25" r="4.5" fill="white" stroke="none" />
            </motion.svg>

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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
