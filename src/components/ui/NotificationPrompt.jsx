import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'

export default function NotificationPrompt({ onAccept, onDismiss }) {
  const handleAccept = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission()
    }
    onAccept()
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
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
          fontSize: '26px', color: '#1A1410', fontWeight: 300,
          margin: '0 0 10px', letterSpacing: '-0.02em',
        }}>
          Stay ahead of every moment
        </h2>
        <p className="font-outfit text-center" style={{
          fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.52)',
          margin: '0 0 28px', lineHeight: 1.65,
        }}>
          Get real-time alerts for vendor updates, ceremony changes, and anything Shaadi Mubarak detects — even when the app is closed.
        </p>

        <button
          onClick={handleAccept}
          className="w-full font-outfit"
          style={{
            background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)',
            color: '#FFFFFF', fontSize: '14px', fontWeight: 500,
            padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(122,15,70,0.28)', marginBottom: '12px',
          }}
        >
          Enable notifications
        </button>
        <button
          onClick={onDismiss}
          className="w-full font-outfit"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(26,20,16,0.38)', fontSize: '13px', fontWeight: 300,
            padding: '8px', cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}
