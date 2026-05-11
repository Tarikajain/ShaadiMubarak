import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeddingAnimation from '../components/WeddingAnimation'

const MAGENTA = '#7A0F46'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('logo') // 'logo' | 'images'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('images'), 2800)
    const t2 = setTimeout(onComplete, 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <motion.div
      style={{ position: 'relative', width: '100%', height: '100%', background: MAGENTA, overflow: 'hidden' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image columns — fade in during 'images' phase */}
      <AnimatePresence>
        {phase === 'images' && (
          <motion.div
            key="images"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <WeddingAnimation onComplete={() => {}} duration={99999} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magenta overlay — solid during logo phase, near-invisible during images phase */}
      <motion.div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        animate={{
          background: phase === 'logo'
            ? MAGENTA
            : `linear-gradient(180deg, ${MAGENTA}33 0%, ${MAGENTA}11 40%, ${MAGENTA}33 100%)`
        }}
        transition={{ duration: 0.9 }}
      />

      {/* Logo — visible only in logo phase, above overlay */}
      <AnimatePresence>
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '10px', pointerEvents: 'none',
            }}
          >
            <motion.span
              className="font-cormorant italic"
              style={{
                fontSize: '44px',
                color: '#FFFFFF',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
              initial={{ opacity: 0, letterSpacing: '0.08em' }}
              animate={{ opacity: 1, letterSpacing: '-0.01em' }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            >
              Shaadi Mubarak
            </motion.span>

            <motion.div
              style={{ width: 0, height: '1px', background: 'rgba(255,255,255,0.5)' }}
              animate={{ width: '52px' }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            />

            <motion.p
              className="font-outfit"
              style={{
                fontSize: '11px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.14em',
                margin: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              YOUR WEDDING, ALWAYS IN VIEW
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
