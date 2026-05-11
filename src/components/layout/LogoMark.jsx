// Placeholder logo mark — replace with actual SVG logo when ready
export default function LogoMark({ light = false }) {
  const bg     = light ? 'rgba(255,255,255,0.22)' : 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)'
  const border = light ? '1.5px solid rgba(255,255,255,0.32)' : 'none'
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
      background: bg, border,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: light ? 'none' : '0 2px 10px rgba(122,15,70,0.30)',
    }}>
      {/* 4-pointed star — simple jewel motif, swap with real logo SVG later */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5 C8 1.5 8.6 5.4 8.6 7.4 C10.6 7.4 14.5 8 14.5 8 C14.5 8 10.6 8.6 8.6 8.6 C8.6 10.6 8 14.5 8 14.5 C8 14.5 7.4 10.6 7.4 8.6 C5.4 8.6 1.5 8 1.5 8 C1.5 8 5.4 7.4 7.4 7.4 C7.4 5.4 8 1.5 8 1.5 Z"
          fill="rgba(255,255,255,0.92)"
        />
      </svg>
    </div>
  )
}
