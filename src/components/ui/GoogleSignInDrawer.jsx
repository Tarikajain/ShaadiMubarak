import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const ACCOUNTS = [
  { email: 'tarika.jain@gmail.com', name: 'Tarika Jain', initials: 'TJ', color: '#4285F4' },
  { email: 'tarika.personal@gmail.com', name: 'Tarika (Personal)', initials: 'T', color: '#34A853' },
]

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function GoogleSignInDrawer({ onSelect, onDismiss }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', zIndex: 50 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      />

      {/* Drawer */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#FFFBF5',
          borderRadius: '24px 24px 0 0',
          zIndex: 51,
          paddingBottom: '28px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '8px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.1)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GoogleLogo />
            <div>
              <p className="font-work-sans" style={{ fontSize: '14px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Sign in with Google</p>
              <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>Choose an account to continue</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={13} color="rgba(26,20,16,0.5)" />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', marginBottom: '8px' }} />

        {/* Account rows */}
        <div style={{ padding: '4px 12px' }}>
          {ACCOUNTS.map((account, i) => (
            <motion.button
              key={account.email}
              onClick={() => onSelect(account)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px', borderRadius: '14px', border: 'none',
                background: 'transparent', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              whileHover={{ background: 'rgba(0,0,0,0.04)' }}
              whileTap={{ background: 'rgba(0,0,0,0.07)', scale: 0.98 }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: account.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span className="font-work-sans" style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                  {account.initials}
                </span>
              </div>
              <div>
                <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 1px' }}>{account.name}</p>
                <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>{account.email}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '8px 0' }} />

        {/* Use another account */}
        <button
          style={{
            width: '100%', padding: '12px 24px', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', color: 'rgba(26,20,16,0.4)', lineHeight: 1 }}>+</span>
          </div>
          <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.6)', margin: 0 }}>Use another account</p>
        </button>
      </motion.div>
    </>
  )
}
