export default function GlassCard({ variant = 'dark', className = '', style = {}, children, onClick }) {
  const variantClass = {
    dark: 'glass-dark',
    warm: 'glass-warm',
    alert: 'glass-alert',
  }[variant] || 'glass-dark'

  return (
    <div
      className={`${variantClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
