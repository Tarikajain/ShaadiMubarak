import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { crisis } from '../data/mockData'

const dotColors = { root: '#7A0F46', impact: '#7A0F46', constraint: '#A07020', critical: '#A07020' }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } }
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25,0.1,0.25,1] } } }

export default function CrisisScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [resolved, setResolved] = useState(false)

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-6 px-5 pb-6" variants={container} initial="hidden" animate="show">
          {/* Header row */}
          <motion.div variants={item} className="flex items-center" style={{ position: 'relative', minHeight: '34px' }}>
            <button onClick={() => navigate('/')} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowLeft size={15} color="rgba(26,20,16,0.6)" />
            </button>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <p className="font-work-sans" style={{ fontSize: '15px', fontWeight: 500, color: '#1A1410', margin: 0, whiteSpace: 'nowrap' }}>Risk detected</p>
              <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', margin: '1px 0 0' }}>{crisis.detectedAt}</p>
            </div>
          </motion.div>

          {/* Cascade chain */}
          <motion.div className="flex flex-col items-center" variants={container} initial="hidden" animate="show">
            {crisis.cascade.map((step, i) => (
              <motion.div key={i} className="flex flex-col items-center w-full" variants={item}>
                <div className="glass-card flex items-center gap-3 w-full" style={{ padding: '14px 18px' }}>
                  <span className="rounded-full flex-shrink-0" style={{ width: '9px', height: '9px', background: dotColors[step.status], boxShadow: `0 0 6px ${dotColors[step.status]}55` }} />
                  <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: '#1A1410' }}>{step.label}</span>
                  {step.status === 'root' && (
                    <span className="ml-auto font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#B03A10', letterSpacing: '0.1em', background: 'rgba(122,15,70,0.08)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(122,15,70,0.18)' }}>
                      ROOT CAUSE
                    </span>
                  )}
                </div>
                {i < crisis.cascade.length - 1 && (
                  <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.13 * (i + 1) + 0.25, duration: 0.35 }} className="flex flex-col items-center" style={{ margin: '3px 0', transformOrigin: 'top' }}>
                    <div style={{ width: '1px', height: '10px', background: 'linear-gradient(180deg, rgba(196,80,30,0.35), rgba(196,80,30,0.12))' }} />
                    <span style={{ color: 'rgba(196,80,30,0.5)', fontSize: '13px', lineHeight: 1 }}>↓</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Time pressure */}
          <motion.div variants={item} className="text-center">
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.58)' }}>{crisis.timeUntil}</span>
          </motion.div>

          <motion.div variants={item} className="gold-divider" />

          {/* Options */}
          <motion.div variants={item} className="flex flex-col gap-3">
            {crisis.options.map(opt => {
              const isSelected = selected === opt.id
              return (
                <button key={opt.id} onClick={() => !resolved && setSelected(opt.id)} className="text-left w-full glass-card" style={{
                  padding: '16px 18px', cursor: resolved ? 'default' : 'pointer',
                  border: isSelected ? '1px solid rgba(200,151,58,0.6)' : opt.recommended ? '1px solid rgba(200,151,58,0.28)' : '1px solid rgba(0,0,0,0.06)',
                  background: isSelected ? 'rgba(200,151,58,0.05)' : '#FFFBF5',
                  boxShadow: isSelected ? '0 0 0 3px rgba(200,151,58,0.1), 0 4px 20px rgba(0,0,0,0.06)' : undefined,
                  transition: 'all 0.22s ease',
                }}>
                  {opt.recommended && (
                    <span className="font-work-sans inline-block mb-2" style={{ fontSize: '9px', fontWeight: 600, color: '#A07020', letterSpacing: '0.12em', background: 'rgba(200,151,58,0.1)', padding: '2px 9px', borderRadius: '99px', border: '1px solid rgba(200,151,58,0.25)' }}>
                      ✦ AI RECOMMENDED
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: 0, flex: 1 }}>{opt.label}</p>
                    {isSelected && (
                      <span className="rounded-full flex-shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px', background: '#7A0F46' }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.64)', margin: '7px 0 0', lineHeight: 1.5 }}>{opt.detail}</p>
                  {opt.timeImpact && <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: '#A07020', margin: '6px 0 0' }}>{opt.timeImpact}</p>}
                </button>
              )
            })}
          </motion.div>

          {/* Confirm CTA */}
          <AnimatePresence>
            {selected && !resolved && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <button onClick={() => setResolved(true)} className="w-full font-work-sans" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(196,80,30,0.3)' }}>
                  Shaadi Mubarak will handle it →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resolved */}
          <AnimatePresence>
            {resolved && (
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="glass-card text-center" style={{ padding: '24px 20px', border: '1px solid rgba(61,122,52,0.28)' }}>
                <div className="rounded-full mx-auto mb-4 flex items-center justify-center" style={{ width: '44px', height: '44px', background: 'rgba(61,122,52,0.1)', border: '1px solid rgba(61,122,52,0.3)' }}>
                  <Check size={18} color="#2D6025" strokeWidth={2.5} />
                </div>
                <p className="font-work-sans" style={{ fontSize: '15px', fontWeight: 500, color: '#1A1410', margin: '0 0 6px' }}>We're handling it</p>
                <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>All affected vendors will be notified automatically</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!resolved && <motion.p variants={item} className="text-center font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.28)', margin: '0 0 4px' }}>All affected vendors will be notified automatically</motion.p>}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
