import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import { budget } from '../data/mockData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function BudgetRing({ pct }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const over = pct > 100
  return (
    <svg width="136" height="136" viewBox="0 0 136 136" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
      <motion.circle cx="68" cy="68" r={r} fill="none"
        stroke={over ? '#7A0F46' : '#7A0F46'} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - Math.min(pct / 100, 1)) }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      />
    </svg>
  )
}

export default function BudgetScreen() {
  const { total, spent, categories, currency } = budget
  const remaining = total - spent
  const pct = Math.round((spent / total) * 100)
  const overBudgetCats = categories.filter(c => c.spent > c.budgeted)
  const dueSoon = categories.filter(c => c.dueAmount > 0 && c.dueDate)

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 500, lineHeight: 1.05, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Budget</h1>
            <p className="font-work-sans text-center" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: '2px 0 0' }}>
              {pct}% of total budget used
            </p>
          </motion.div>

          {/* Hero ring card */}
          <motion.div variants={item} className="glass-card flex flex-col items-center" style={{ padding: '28px 20px 24px' }}>
            <div className="relative flex items-center justify-center" style={{ width: '136px', height: '136px' }}>
              <BudgetRing pct={pct} />
              <div className="flex flex-col items-center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-work-sans" style={{ fontSize: '22px', fontWeight: 600, color: '#1A1410', lineHeight: 1 }}>{fmt(spent)}</span>
                <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', marginTop: '3px' }}>of {fmt(total)}</span>
              </div>
            </div>
            <div className="flex gap-8 mt-5">
              <div className="flex flex-col items-center">
                <span className="font-work-sans" style={{ fontSize: '16px', fontWeight: 600, color: '#2D6025' }}>{fmt(remaining)}</span>
                <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', marginTop: '2px' }}>remaining</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(0,0,0,0.07)' }} />
              <div className="flex flex-col items-center">
                <span className="font-work-sans" style={{ fontSize: '16px', fontWeight: 600, color: '#A07020' }}>{fmt(dueSoon.reduce((a, c) => a + c.dueAmount, 0))}</span>
                <span className="font-work-sans" style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', marginTop: '2px' }}>due soon</span>
              </div>
            </div>
          </motion.div>

          {/* Alert for due soon */}
          {dueSoon.length > 0 && (
            <motion.div variants={item} className="glass-alert flex items-center gap-3" style={{ padding: '13px 16px' }}>
              <AlertCircle size={14} color="#B03A10" style={{ flexShrink: 0 }} />
              <p className="font-work-sans flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.75)', margin: 0 }}>
                <span style={{ color: '#B03A10', fontWeight: 600 }}>{dueSoon.length} payments</span> due before the wedding
              </p>
            </motion.div>
          )}

          {/* Category breakdown */}
          <motion.div variants={item} className="flex flex-col gap-3">
            <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.54)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Breakdown</p>
            {categories.map((cat, i) => {
              const catPct = Math.min((cat.spent / cat.budgeted) * 100, 100)
              const isPaid = cat.dueAmount === 0
              const isOver = cat.spent > cat.budgeted
              return (
                <motion.div key={cat.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="glass-card"
                  style={{ padding: '14px 16px', border: isOver ? '1px solid rgba(122,15,70,0.25)' : isPaid ? '1px solid rgba(45,96,37,0.18)' : '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{cat.name}</span>
                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <CheckCircle2 size={13} color="#2D6025" />
                      ) : cat.dueDate ? (
                        <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: '#A07020' }}>Due {cat.dueDate}</span>
                      ) : null}
                      <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: isOver ? '#B03A10' : '#1A1410' }}>
                        {fmt(cat.spent)}<span style={{ fontWeight: 400, color: 'rgba(26,20,16,0.50)' }}>/{fmt(cat.budgeted)}</span>
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${catPct}%` }}
                      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 + i * 0.06 }}
                      style={{ height: '100%', background: isOver ? 'linear-gradient(90deg,#7A0F46,#E07040)' : isPaid ? 'linear-gradient(90deg,#2D6025,#4A9040)' : 'linear-gradient(90deg,#7A0F46,#E8B85A)', borderRadius: '99px' }}
                    />
                  </div>
                  {cat.dueAmount > 0 && (
                    <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.58)', margin: '6px 0 0' }}>
                      {fmt(cat.dueAmount)} outstanding
                    </p>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          <div style={{ height: '80px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
