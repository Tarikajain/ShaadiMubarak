import { useEffect } from 'react'
import { motion } from 'framer-motion'

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
      {/* CSS animations injected into <head> */}
      <style>{buildIconCSS()}</style>

      {/* SVG host — icons fill the screen */}
      <div
        id="splash-svg-host"
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch' }}
      />
    </motion.div>
  )
}
