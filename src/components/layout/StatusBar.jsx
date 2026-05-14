export default function StatusBar({ light = false }) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const textColor = light ? 'rgba(255,255,255,0.82)' : 'rgba(24,19,10,0.5)'
  const iconColor = light ? 'rgba(255,255,255,0.72)' : 'rgba(24,19,10,0.4)'

  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1">
      <span className="font-work-sans text-[12px] font-medium" style={{ color: textColor }}>
        {time}
      </span>
      <div className="flex items-center gap-1.5" style={{ color: iconColor }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeOpacity="0.6"/>
          <rect x="1.5" y="1.5" width="9" height="7" rx="0.5" fill="currentColor" fillOpacity="0.7"/>
          <path d="M14.5 3.5V6.5C15.1667 6.16667 15.1667 3.83333 14.5 3.5Z" fill="currentColor" fillOpacity="0.5"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" fillOpacity="0.5">
          <path d="M8 2.5C10.5 2.5 12.7 3.5 14.2 5.2L15.5 3.8C13.6 1.8 11 0.5 8 0.5C5 0.5 2.4 1.8 0.5 3.8L1.8 5.2C3.3 3.5 5.5 2.5 8 2.5Z"/>
          <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.6 5.9C12.1 4.5 10.1 3.5 8 3.5C5.9 3.5 3.9 4.5 2.4 5.9L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z"/>
          <circle cx="8" cy="10" r="1.5"/>
        </svg>
      </div>
    </div>
  )
}
