import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'

export default function NotificationPrompt({ onAccept, onDismiss }) {
  const [neverShow, setNeverShow] = useState(false)

  const handleAccept = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission()
    }
    onAccept()
  }

  const handleDismiss = () => {
    onDismiss(neverShow)
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
    >
      <motion.div
        className="w-full"
        style={{ background: '#FFFBF5', borderRadius: '24px 24px 0 0', padding: '28px 24px 36px' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-6">
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99 }} />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'rgba(122,15,70,0.08)',
            border: '1px solid rgba(122,15,70,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={24} color="#7A0F46" />
          </div>
        </div>

        <h2 className="font-cormorant italic text-center" style={{
          fontSize: '26px', color: '#1A1410', fontWeight: 500,
          margin: '0 0 10px', letterSpacing: '-0.02em',
        }}>
          Stay ahead of every moment
        </h2>
        <p className="font-work-sans text-center" style={{
          fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.52)',
          margin: '0 0 24px', lineHeight: 1.65,
        }}>
          Get real-time alerts for vendor updates, ceremony changes, and anything Shaadi Mubarak detects — even when the app is closed.
        </p>

        <button
          onClick={handleAccept}
          className="w-full font-work-sans"
          style={{
            background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)',
            color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
            fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
            padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(122,15,70,0.28)', marginBottom: '12px',
          }}
        >
          Enable notifications
        </button>

        {/* Don't show again checkbox */}
        <label
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer', marginBottom: '10px', padding: '4px 0',
          }}
        >
          <div
            onClick={() => setNeverShow(v => !v)}
            style={{
              width: 16, height: 16, borderRadius: '4px', flexShrink: 0,
              border: neverShow ? '2px solid #7A0F46' : '1.5px solid rgba(26,20,16,0.22)',
              background: neverShow ? '#7A0F46' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            {neverShow && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2 2L7.5 2" stroke="#FFFBF5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span
            className="font-work-sans"
            onClick={() => setNeverShow(v => !v)}
            style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)' }}
          >
            Don't show this again
          </span>
        </label>

        <button
          onClick={handleDismiss}
          className="w-full font-work-sans"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(26,20,16,0.54)', fontSize: '13px', fontWeight: 400,
            padding: '8px', cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}
