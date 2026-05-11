export default function MobileFrame({ children }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '375px',
        height: '812px',
        maxHeight: '100vh',
        background: '#FFFBF5',
        borderRadius: '40px',
        boxShadow: '0 48px 140px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  )
}
