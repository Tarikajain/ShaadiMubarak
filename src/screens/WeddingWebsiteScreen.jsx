import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, Eye, Globe, Check, Users, BarChart2 } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import { weddingWebsite, wedding } from '../data/mockData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }
const spring = { type: 'spring', stiffness: 420, damping: 32 }

const THEMES = [
  { id: 'ivory',  label: 'Ivory',  bg: '#F5F0E8', accent: '#7A0F46' },
  { id: 'blush',  label: 'Blush',  bg: '#FAE8EC', accent: '#C4507A' },
  { id: 'forest', label: 'Forest', bg: '#E8F0E8', accent: '#3A7A50' },
  { id: 'slate',  label: 'Slate',  bg: '#E8ECF5', accent: '#4A6AB0' },
]

function Toggle({ enabled, onChange }) {
  return (
    <button onClick={() => onChange(!enabled)}
      style={{ width: '40px', height: '24px', borderRadius: '99px', background: enabled ? '#7A0F46' : 'rgba(0,0,0,0.12)', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, transition: 'background 0.22s ease', position: 'relative' }}>
      <motion.div
        animate={{ x: enabled ? 16 : 0 }}
        transition={spring}
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFFBF5', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', position: 'absolute', top: '2px', left: '2px' }}
      />
    </button>
  )
}

export default function WeddingWebsiteScreen() {
  const navigate = useNavigate()
  const [published, setPublished] = useState(weddingWebsite.published)
  const [sections, setSections] = useState(weddingWebsite.sections)
  const [theme, setTheme] = useState(weddingWebsite.theme)
  const [copied, setCopied] = useState(false)

  const toggleSection = (id) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeTheme = THEMES.find(t => t.id === theme)

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="flex items-center mt-2" style={{ position: 'relative', minHeight: '34px' }}>
            <button onClick={() => navigate('/journey')}
              style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowLeft size={15} color="rgba(26,20,16,0.6)" />
            </button>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <h1 className="font-cormorant italic" style={{ fontSize: '26px', color: '#1A1410', fontWeight: 300, margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Wedding Website</h1>
            </div>
          </motion.div>

          {/* Live preview card */}
          <motion.div variants={item} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', background: activeTheme.bg }}>
            <div className="flex flex-col items-center py-8 px-5 text-center">
              <div className="rounded-full flex items-center justify-center mb-4" style={{ width: '36px', height: '36px', background: activeTheme.accent + '22', border: `1px solid ${activeTheme.accent}44` }}>
                <Globe size={15} color={activeTheme.accent} />
              </div>
              <p className="font-cormorant italic" style={{ fontSize: '22px', color: '#1A1410', fontWeight: 300, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                {wedding.couple.bride} &amp; {wedding.couple.groom}
              </p>
              <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.5)', margin: 0 }}>{wedding.date} · {wedding.venue}</p>
              <div className="flex gap-3 mt-4">
                <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 500, color: activeTheme.accent, background: activeTheme.accent + '18', border: `1px solid ${activeTheme.accent}33`, padding: '3px 10px', borderRadius: '99px' }}>RSVP Now</span>
                <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', padding: '3px 10px', borderRadius: '99px' }}>Our Story</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${activeTheme.accent}22`, background: 'rgba(255,255,255,0.5)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)' }}>{weddingWebsite.url}</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 font-outfit"
                style={{ fontSize: '10px', fontWeight: 500, color: copied ? '#2D6025' : activeTheme.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <AnimatePresence mode="wait">
                  {copied
                    ? <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1"><Check size={11} />Copied</motion.span>
                    : <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1"><Copy size={11} />Copy link</motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          {/* Publish toggle + stats */}
          <motion.div variants={item} className="glass-card flex items-center gap-4" style={{ padding: '16px 18px', border: published ? '1px solid rgba(45,96,37,0.22)' : '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex flex-col flex-1">
              <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>
                {published ? 'Live' : 'Draft'}
              </span>
              <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.42)', marginTop: '1px' }}>
                {published ? `Updated ${weddingWebsite.lastUpdated}` : 'Not visible to guests yet'}
              </span>
            </div>
            <Toggle enabled={published} onChange={setPublished} />
          </motion.div>

          {/* Stats row */}
          {published && (
            <motion.div variants={item} className="grid grid-cols-2 gap-2">
              {[
                { icon: Eye,      value: weddingWebsite.views,        label: 'page views' },
                { icon: Users,    value: weddingWebsite.rsvpResponses, label: 'RSVP responses' },
              ].map(s => (
                <div key={s.label} className="glass-card flex items-center gap-3" style={{ padding: '14px 14px' }}>
                  <s.icon size={15} color="#A07020" style={{ flexShrink: 0 }} />
                  <div className="flex flex-col">
                    <span className="font-outfit" style={{ fontSize: '18px', fontWeight: 600, color: '#1A1410', lineHeight: 1 }}>{s.value}</span>
                    <span className="font-outfit" style={{ fontSize: '9px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', marginTop: '2px' }}>{s.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Theme picker */}
          <motion.div variants={item} className="flex flex-col gap-3">
            <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Theme</p>
            <div className="flex gap-2">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className="flex flex-col items-center gap-1.5 flex-1"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', background: t.bg, border: theme === t.id ? `2px solid ${t.accent}` : '2px solid rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden', transition: 'border 0.18s ease' }}>
                    <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '4px', borderRadius: '99px', background: t.accent, opacity: 0.7 }} />
                    {theme === t.id && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.3)' }}>
                        <Check size={14} color={t.accent} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <span className="font-outfit" style={{ fontSize: '10px', fontWeight: theme === t.id ? 500 : 300, color: theme === t.id ? '#1A1410' : 'rgba(26,20,16,0.45)' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <motion.div variants={item} className="flex flex-col gap-2">
            <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Sections</p>
            {sections.map((sec, i) => (
              <motion.div key={sec.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.35 }}
                className="glass-card flex items-center gap-3"
                style={{ padding: '13px 16px' }}>
                <span className="font-outfit flex-1" style={{ fontSize: '13px', fontWeight: 400, color: sec.enabled ? '#1A1410' : 'rgba(26,20,16,0.38)' }}>{sec.label}</span>
                <Toggle enabled={sec.enabled} onChange={() => toggleSection(sec.id)} />
              </motion.div>
            ))}
          </motion.div>

          {/* Share CTA */}
          <motion.div variants={item}>
            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 font-outfit"
              style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(122,15,70,0.28)' }}>
              <Globe size={15} />
              Share website with guests
            </button>
          </motion.div>

          <div style={{ height: '80px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
