export default function CeremonyDot({ status, isLast = false }) {
  const dotStyles = {
    done: {
      bg: '#3D7A34',
      border: 'none',
      pulse: '',
    },
    live: {
      bg: '#7A0F46',
      border: 'none',
      pulse: 'animate-pulse-gold',
    },
    at_risk: {
      bg: '#7A0F46',
      border: 'none',
      pulse: 'animate-pulse-risk',
    },
    upcoming: {
      bg: 'transparent',
      border: '1.5px solid rgba(242,235,216,0.15)',
      pulse: '',
    },
  }

  const style = dotStyles[status] || dotStyles.upcoming

  return (
    <div className="flex flex-col items-center" style={{ width: '10px' }}>
      <div
        className={`rounded-full flex-shrink-0 ${style.pulse}`}
        style={{
          width: '10px',
          height: '10px',
          background: style.bg,
          border: style.border,
        }}
      />
      {!isLast && (
        <div
          style={{
            width: '1px',
            flex: 1,
            minHeight: '20px',
            background: 'rgba(242,235,216,0.08)',
            marginTop: '4px',
          }}
        />
      )}
    </div>
  )
}
