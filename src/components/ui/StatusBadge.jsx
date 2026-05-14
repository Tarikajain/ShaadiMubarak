import { Check, Zap, AlertTriangle, Clock } from 'lucide-react'

const configs = {
  confirmed: { bg: 'rgba(61,122,52,0.12)',  border: 'rgba(61,122,52,0.35)',  color: '#2D6025', label: 'Confirmed', Icon: Check },
  live:      { bg: 'rgba(200,151,58,0.14)', border: 'rgba(200,151,58,0.45)', color: '#A07020', label: 'Live',      Icon: Zap,           pulse: true, pulseClass: 'animate-pulse-gold' },
  at_risk:   { bg: 'rgba(196,80,30,0.11)',  border: 'rgba(196,80,30,0.42)',  color: '#B03A10', label: 'At Risk',   Icon: AlertTriangle },
  pending:   { bg: 'rgba(24,19,10,0.06)',   border: 'rgba(24,19,10,0.15)',   color: 'rgba(24,19,10,0.45)', label: 'Pending', Icon: Clock },
  done:      { bg: 'rgba(61,122,52,0.08)',  border: 'rgba(61,122,52,0.22)',  color: 'rgba(45,96,37,0.65)', label: 'Done',    Icon: Check },
}

export default function StatusBadge({ status }) {
  const cfg = configs[status] || configs.pending
  const { bg, border, color, label, Icon, pulseClass } = cfg

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-work-sans ${pulseClass || ''}`}
      style={{ background: bg, border: `0.5px solid ${border}`, color, padding: '3px 8px', fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
    >
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  )
}
