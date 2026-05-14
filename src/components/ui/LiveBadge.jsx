export default function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-work-sans"
      style={{
        background: 'rgba(196,80,30,0.10)',
        border: '0.5px solid rgba(196,80,30,0.4)',
        padding: '4px 10px',
      }}
    >
      <span
        className="rounded-full animate-pulse-risk flex-shrink-0"
        style={{ width: '5px', height: '5px', background: '#7A0F46' }}
      />
      <span style={{ color: '#7A0F46', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em' }}>
        LIVE
      </span>
    </span>
  )
}
