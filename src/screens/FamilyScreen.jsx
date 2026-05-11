import { motion } from 'framer-motion'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { familyStats, wedding } from '../data/mockData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25,0.1,0.25,1] } } }

const statCards = [
  { label: 'vendors confirmed', value: `${familyStats.vendorsConfirmed} of ${familyStats.vendorsTotal}`, highlight: false },
  { label: 'Live now',          value: familyStats.currentCeremony,   highlight: true },
  { label: 'guests attending',  value: familyStats.guestsAttending,    highlight: false },
]

export default function FamilyScreen() {
  const isOnTrack = familyStats.overallStatus === 'on_track'
  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-7 px-5 pt-5 pb-8" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex flex-col gap-2 mt-3 text-center">
            <h1 className="font-cormorant italic" style={{ fontSize: '40px', color: '#1A1410', fontWeight: 300, lineHeight: 1.05, margin: 0, letterSpacing: '-0.02em' }}>
              {wedding.couple.bride}'s Wedding
            </h1>
            <p className="font-outfit" style={{ fontSize: '16px', fontWeight: 300, color: isOnTrack ? 'rgba(26,20,16,0.52)' : '#B03A10', margin: 0 }}>
              {familyStats.message}
            </p>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-3 gap-2">
            {statCards.map((card, i) => (
              <div key={i} className="glass-card flex flex-col items-center text-center" style={{
                padding: '16px 10px',
                border: card.highlight ? '1px solid rgba(200,151,58,0.4)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: card.highlight ? '0 0 0 3px rgba(200,151,58,0.08), 0 4px 20px rgba(0,0,0,0.06)' : undefined,
              }}>
                <span className="font-outfit" style={{ fontSize: card.highlight ? '14px' : '18px', fontWeight: 600, color: card.highlight ? '#A07020' : '#1A1410', marginBottom: '4px' }}>
                  {card.value}
                </span>
                <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', lineHeight: 1.4 }}>{card.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Live ceremony centrepiece */}
          <motion.div variants={item} className="flex flex-col items-center gap-5 py-8">
            <div className="relative flex items-center justify-center">
              {[0, 0.5, 1].map(delay => (
                <motion.div key={delay} className="absolute rounded-full" style={{ width: '80px', height: '80px', border: '1px solid rgba(200,151,58,0.25)' }}
                  animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeOut' }} />
              ))}
              <div className="rounded-full relative z-10" style={{ width: '48px', height: '48px', background: 'radial-gradient(circle at 35% 35%, #E8B85A, #7A0F46)', boxShadow: '0 0 32px rgba(200,151,58,0.45)' }} />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-outfit" style={{ fontSize: '18px', fontWeight: 300, color: '#1A1410', margin: 0 }}>{familyStats.currentCeremony} ceremony</p>
              <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#A07020', margin: 0, letterSpacing: '0.04em' }}>{familyStats.currentCeremonyStatus}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card text-center" style={{ padding: '18px' }}>
            <p className="font-cormorant italic" style={{ fontSize: '18px', fontWeight: 300, color: 'rgba(26,20,16,0.65)', margin: '0 0 4px' }}>{wedding.venue}</p>
            <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.32)', margin: 0 }}>{wedding.date}</p>
          </motion.div>

          <motion.p variants={item} className="text-center font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.2)', letterSpacing: '0.1em', marginTop: '8px' }}>
            Shaadi Mubarak is watching
          </motion.p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
