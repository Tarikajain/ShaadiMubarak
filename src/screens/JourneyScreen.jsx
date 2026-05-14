import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Globe } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { journeyPhases } from '../data/mockData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25,0.1,0.25,1] } } }
const pct = 62

export default function JourneyScreen() {
  const navigate = useNavigate()
  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mt-2 text-center">
            <h1 className="font-cormorant italic" style={{ fontSize: '32px', color: '#1A1410', fontWeight: 500, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', textAlign: 'center' }}>
              Your wedding journey
            </h1>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.58)', margin: '5px 0 0' }}>
              4 months to go · {pct}% planned
            </p>
          </motion.div>

          <motion.div variants={item}>
            <div style={{ height: '3px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.25,0.1,0.25,1], delay: 0.3 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #7A0F46, #E8B85A)', borderRadius: '99px' }} />
            </div>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3">
            {journeyPhases.map(phase => {
              const isDone = phase.status === 'done'
              const isActive = phase.status === 'active'
              const isUpcoming = phase.status === 'upcoming'
              const progress = phase.tasks > 0 ? (phase.completed / phase.tasks) * 100 : 0

              return (
                <div key={phase.id}>
                  <div className="glass-card" style={{
                    padding: '15px 18px', opacity: isUpcoming ? 0.55 : 1,
                    border: isActive ? '1px solid rgba(200,151,58,0.4)' : isDone ? '1px solid rgba(61,122,52,0.22)' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: isActive ? '0 0 0 3px rgba(200,151,58,0.08), 0 4px 20px rgba(0,0,0,0.06)' : undefined,
                  }}>
                    <div className="flex items-center gap-3 mb-1">
                      {isDone ? (
                        <span className="rounded-full flex-shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px', background: 'rgba(61,122,52,0.1)', border: '1px solid rgba(61,122,52,0.3)' }}>
                          <Check size={11} color="#2D6025" strokeWidth={3} />
                        </span>
                      ) : isActive ? (
                        <span className="rounded-full flex-shrink-0 animate-pulse-gold" style={{ width: '10px', height: '10px', background: '#7A0F46' }} />
                      ) : (
                        <span className="rounded-full flex-shrink-0" style={{ width: '10px', height: '10px', border: '1.5px solid rgba(26,20,16,0.18)' }} />
                      )}
                      <span className="font-work-sans flex-1" style={{ fontSize: '13px', fontWeight: isActive ? 500 : 300, color: isDone ? 'rgba(26,20,16,0.3)' : '#1A1410' }}>
                        {phase.name}
                      </span>
                      {isActive && <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 600, color: '#A07020', background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.25)', padding: '2px 9px', borderRadius: '99px', letterSpacing: '0.06em' }}>In progress</span>}
                      {isDone && <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(45,96,37,0.65)' }}>{phase.completed}/{phase.tasks}</span>}
                      {isUpcoming && <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.28)' }}>{phase.tasks} tasks</span>}
                    </div>

                    {isActive && (
                      <div className="mt-3">
                        <div className="flex justify-between mb-1.5">
                          <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)' }}>{phase.completed} of {phase.tasks} complete</span>
                          <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: '#A07020' }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: '3px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.9, ease: [0.25,0.1,0.25,1], delay: 0.5 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #7A0F46, #E8B85A)', borderRadius: '99px' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {isActive && phase.aiNudge && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }}
                      className="glass-alert flex items-start gap-3 mt-2" style={{ padding: '13px 16px' }}>
                      <Zap size={13} color="#B03A10" style={{ flexShrink: 0, marginTop: '1px' }} />
                      <div className="flex flex-col gap-2.5 flex-1">
                        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.72)', margin: 0 }}>{phase.aiNudge}</p>
                        <button className="inline-flex self-start font-work-sans" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '11px', fontWeight: 500, padding: '8px 15px', borderRadius: '10px', border: 'none', cursor: 'pointer', minHeight: '44px', boxShadow: '0 4px 12px rgba(122,15,70,0.25)' }}>
                          Review now →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </motion.div>
          {/* Wedding website entry point */}
          <motion.div variants={item}>
            <button onClick={() => navigate('/website')} className="w-full glass-card flex items-center gap-4" style={{ padding: '16px 18px', border: '1px solid rgba(200,151,58,0.28)', cursor: 'pointer', textAlign: 'left' }}>
              <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', background: 'linear-gradient(145deg, #7A0F46, #A07020)' }}>
                <Globe size={16} color="#FFFFFF" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>Wedding Website</span>
                <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.58)', marginTop: '2px' }}>Build and share your wedding page with guests</span>
              </div>
              <span className="font-work-sans" style={{ fontSize: '14px', color: 'rgba(26,20,16,0.3)' }}>→</span>
            </button>
          </motion.div>

          <div style={{ height: '140px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
