import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { preloadSVG, injectIllustrationSVG } from '../utils/svgPreloader'
import LogoMark from '../components/layout/LogoMark'

const MAGENTA = '#7A0F46'
const BRAND_DURATION = 2600
const TOTAL_DURATION = 4800

// Per-illustration wobble params: [xA, xB, rot, duration, delay]
const WOBBLE = [
  [-3,  3, -1.2, 3.1, 0.00], [-2,  4, -0.8, 2.7, 0.35], [-4,  2, -1.5, 3.4, 0.70],
  [-3,  3,  1.0, 2.9, 0.15], [-2,  4, -1.0, 3.6, 0.55], [-4,  2,  1.3, 2.8, 0.90],
  [-3,  3, -0.9, 3.2, 0.25], [-2,  4,  1.1, 3.0, 0.65], [-3,  3, -1.4, 3.5, 0.10],
  [-4,  2,  0.8, 2.7, 0.80], [-2,  4, -1.2, 3.3, 0.45], [-3,  3,  1.4, 2.9, 0.20],
  [-4,  2, -0.8, 3.7, 0.60], [-2,  4,  1.0, 3.1, 0.95], [-3,  3, -1.3, 2.8, 0.30],
  [-4,  2,  0.9, 3.4, 0.75], [-2,  4, -1.1, 3.0, 0.50], [-3,  3,  1.2, 2.6, 0.05],
  [-4,  2, -0.9, 3.3, 0.85], [-2,  4,  1.3, 3.6, 0.40], [-3,  3, -1.0, 2.9, 0.15],
  [-4,  2,  0.8, 3.2, 0.70], [-2,  4, -1.4, 2.7, 0.55], [-3,  3,  1.1, 3.5, 0.20],
  [-4,  2, -0.8, 3.0, 0.90], [-2,  4,  1.4, 2.8, 0.35], [-3,  3, -1.2, 3.4, 0.60],
  [-4,  2,  0.9, 2.6, 0.25], [-2,  4, -1.0, 3.1, 0.80], [-3,  3,  1.3, 3.3, 0.45],
  [-4,  2, -1.1, 2.9, 0.10], [-2,  4,  0.8, 3.6, 0.65], [-3,  3, -1.3, 3.0, 0.30],
  [-4,  2,  1.0, 2.7, 0.95], [-2,  4, -0.9, 3.2, 0.50], [-3,  3,  1.2, 3.5, 0.75],
  [-4,  2, -1.4, 2.8, 0.20], [-2,  4,  0.8, 3.1, 0.85], [-3,  3, -1.1, 2.6, 0.40],
  [-4,  2,  1.3, 3.4, 0.05], [-2,  4, -1.0, 3.0, 0.60], [-3,  3,  0.9, 2.9, 0.35],
  [-4,  2, -1.2, 3.3, 0.70], [-2,  4,  1.1, 2.7, 0.15], [-3,  3, -1.4, 3.6, 0.55],
  [-4,  2,  0.8, 3.2, 0.80], [-2,  4, -0.9, 2.8, 0.25], [-3,  3,  1.3, 3.5, 0.90],
  [-4,  2, -1.1, 3.0, 0.45], [-2,  4,  1.0, 2.6, 0.10], [-3,  3, -1.3, 3.4, 0.65],
  [-4,  2,  0.9, 2.9, 0.30],
]

function buildWobbleCSS() {
  return WOBBLE.map(([xA, xB, rot, dur, del], i) => `
    .sw-${i} {
      animation: sw${i} ${dur}s ${del}s ease-in-out infinite alternate;
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes sw${i} {
      from { transform: translateX(${xA}px) rotate(${rot * -1}deg); }
      to   { transform: translateX(${xB}px) rotate(${rot}deg); }
    }
  `).join('')
}

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const doneTimer = setTimeout(onComplete, TOTAL_DURATION)
    return () => clearTimeout(doneTimer)
  }, [onComplete])

  // Use preloaded SVG — already fetching since module load, inject immediately
  useEffect(() => {
    preloadSVG('/splash-bg.svg').then(html => {
      if (!html) return
      const container = document.getElementById('splash-svg-host')
      if (!container) return
      injectIllustrationSVG(container, html, 'sw', WOBBLE.length)
    })
  }, [])

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, background: MAGENTA, overflow: 'hidden' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
    >
      <style>{buildWobbleCSS()}</style>

      {/* Illustration field — always visible, populates as SVG resolves */}
      <div
        id="splash-svg-host"
        style={{ position: 'absolute', inset: 0, zIndex: 5 }}
      />

      {/* Magenta overlay — keeps brand color strong over the illustration field */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(122,15,70,0.92) 0%, rgba(122,15,70,0.70) 50%, rgba(122,15,70,0.92) 100%)',
      }} />

      {/* Text — always visible, centered, on top of illustrations */}
      <style>{`
        @keyframes cinematicReveal {
          from {
            opacity: 0;
            transform: scale(0.80);
            letter-spacing: 0.02em;
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: scale(1);
            letter-spacing: 0.12em;
            filter: blur(0px);
          }
        }
      `}</style>
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12,
        }}
      >
        {/* Couple silhouette logo above brand title */}
        <div style={{ marginBottom: 8 }}>
          <LogoMark bare={true} light={true} width={64} height={72} />
        </div>

        {/* layoutId wrapper stays clean; inner span carries the cinematic animation */}
        <motion.span layoutId="brand-title" className="font-cormorant"
          style={{ fontSize: '40px', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.12em', textAlign: 'center' }}
        >
          <span style={{ display: 'inline-block', animation: 'cinematicReveal 1.2s 0.1s both cubic-bezier(0.16, 1, 0.3, 1)' }}>
            Shaadi Mubarak
          </span>
        </motion.span>

        <motion.div
          layoutId="brand-divider"
          style={{ height: '1px', background: 'rgba(255,255,255,0.45)' }}
          initial={{ width: 0 }}
          animate={{ width: '48px' }}
          transition={{ delay: 0.85, duration: 0.6, ease: 'easeOut' }}
        />

        <motion.p
          className="font-work-sans"
          style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em', margin: 0 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        >
          YOUR WEDDING, ALWAYS IN VIEW
        </motion.p>
      </div>
    </motion.div>
  )
}
