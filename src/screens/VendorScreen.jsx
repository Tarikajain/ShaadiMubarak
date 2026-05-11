import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Eye, AlertTriangle, Star, ChevronRight } from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import NavIcons from '../components/layout/NavIcons'
import LogoMark from '../components/layout/LogoMark'
import StatusBadge from '../components/ui/StatusBadge'
import { vendors, vendorDirectory } from '../data/mockData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }
const spring = { type: 'spring', stiffness: 420, damping: 32 }

const riskOrder = { high: 0, medium: 1, low: 2 }
const sortedVendors = [...vendors].sort((a, b) => (riskOrder[a.risk] ?? 3) - (riskOrder[b.risk] ?? 3))
const atRiskCount = vendors.filter(v => v.status === 'at_risk' || v.status === 'pending').length

const DISC_CATS = ['All', 'Photographer', 'Caterer', 'Florist', 'Decorator', 'DJ', 'Pandit', 'Mehndi Artist', 'Videographer']

function MyVendors({ onVendorClick }) {
  return (
    <motion.div className="flex flex-col gap-3" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        {atRiskCount > 0 ? (
          <div className="glass-alert flex items-center gap-3" style={{ padding: '13px 16px' }}>
            <AlertTriangle size={14} color="#B03A10" style={{ flexShrink: 0 }} />
            <p className="font-outfit flex-1" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.75)', margin: 0 }}>
              <span style={{ color: '#B03A10', fontWeight: 600 }}>{atRiskCount} vendors</span> need attention before tomorrow
            </p>
            <span className="font-outfit rounded-full" style={{ fontSize: '10px', fontWeight: 600, background: '#7A0F46', color: '#FFFFFF', padding: '2px 8px', flexShrink: 0 }}>{atRiskCount}</span>
          </div>
        ) : (
          <div className="glass-warm flex items-center gap-3" style={{ padding: '13px 16px' }}>
            <span style={{ fontSize: '14px' }}>✓</span>
            <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.7)', margin: 0 }}>All vendors confirmed for today</p>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-3">
        {sortedVendors.map(vendor => (
          <motion.div
            key={vendor.id}
            className="glass-card"
            style={{
              padding: '14px 14px 14px 16px', cursor: 'pointer',
              border: vendor.risk === 'high' ? '1px solid rgba(196,80,30,0.3)' : vendor.risk === 'medium' ? '1px solid rgba(200,151,58,0.25)' : '1px solid rgba(0,0,0,0.06)',
            }}
            onClick={() => onVendorClick(String(vendor.id))}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-stretch gap-3">
              {/* Left: info */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410', margin: '0 0 2px' }}>{vendor.name}</p>
                    <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>{vendor.category}</p>
                  </div>
                  <StatusBadge status={vendor.status} />
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.42)', margin: '0 0 2px' }}>{vendor.ceremony}</p>
                    <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.28)', margin: 0 }}>Last contact: {vendor.lastContact}</p>
                  </div>
                  {vendor.status === 'at_risk' || vendor.status === 'pending' ? (
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className="inline-flex items-center gap-1.5 font-outfit flex-shrink-0"
                      style={{ border: '1px solid rgba(196,80,30,0.35)', color: '#B03A10', background: 'rgba(196,80,30,0.05)', fontSize: '11px', fontWeight: 500, padding: '7px 11px', borderRadius: '10px', cursor: 'pointer', minHeight: '36px' }}>
                      <MessageSquare size={11} /> Follow up
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1 flex-shrink-0" style={{ color: 'rgba(122,15,70,0.5)' }}>
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                {vendor.hardStop && (
                  <div className="mt-2 font-outfit" style={{ background: 'rgba(200,151,58,0.07)', border: '1px solid rgba(200,151,58,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 400, color: '#8A6010' }}>
                    Hard stop: {vendor.hardStop}
                  </div>
                )}
              </div>
              {/* Right: vendor image */}
              {vendor.image && (
                <div style={{ width: 72, flexShrink: 0, borderRadius: '10px', overflow: 'hidden', alignSelf: 'stretch' }}>
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function DiscoverVendors({ onVendorClick }) {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? vendorDirectory : vendorDirectory.filter(v => v.category === cat)

  return (
    <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ paddingBottom: '2px' }}>
        {DISC_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="relative font-outfit flex-shrink-0"
            style={{ fontSize: '11px', fontWeight: 500, padding: '7px 14px', borderRadius: '99px', border: cat === c ? '1px solid rgba(122,15,70,0.4)' : '1px solid rgba(0,0,0,0.09)', background: cat === c ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.02)', color: cat === c ? '#7A0F46' : 'rgba(26,20,16,0.5)', cursor: 'pointer', transition: 'all 0.18s ease', whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Vendor cards */}
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col gap-3">
          {filtered.map((v, i) => (
            <motion.div key={v.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
              className="glass-card"
              style={{ padding: '16px 18px', cursor: 'pointer' }}
              onClick={() => onVendorClick(v.id)}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-outfit" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1410' }}>{v.name}</span>
                    {v.tag && (
                      <span className="font-outfit" style={{ fontSize: '8px', fontWeight: 600, color: '#A07020', background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.25)', padding: '2px 7px', borderRadius: '99px', letterSpacing: '0.06em', flexShrink: 0 }}>{v.tag}</span>
                    )}
                  </div>
                  <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(26,20,16,0.42)' }}>{v.category} · {v.location}</span>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star size={10} color="#7A0F46" fill="#7A0F46" />
                      <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: '#1A1410' }}>{v.rating}</span>
                      <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.35)' }}>({v.reviews})</span>
                    </div>
                    <span className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.4)' }}>{v.priceRange}</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onVendorClick(v.id) }}
                  className="font-outfit flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFBF5', fontSize: '11px', fontWeight: 500, padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 3px 10px rgba(122,15,70,0.25)', minHeight: '44px' }}>
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}

export default function VendorScreen() {
  const [tab, setTab] = useState('mine')
  const navigate = useNavigate()

  const handleVendorClick = (id) => navigate(`/vendors/${id}`)

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />
        <motion.div className="flex flex-col gap-5 px-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <LogoMark />
              <NavIcons />
            </div>
            <h1 className="font-cormorant italic text-center" style={{ fontSize: '36px', color: '#1A1410', fontWeight: 300, lineHeight: 1.05, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Vendors</h1>
            <p className="font-outfit text-center" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              {vendors.length} booked · {vendors.filter(v => v.status === 'confirmed').length} confirmed
            </p>
          </motion.div>

          {/* Tab toggle */}
          <motion.div variants={item} className="relative flex" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '3px' }}>
            {[{ id: 'mine', label: 'My Vendors' }, { id: 'discover', label: 'Discover' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative flex-1 font-outfit"
                style={{ fontSize: '13px', fontWeight: 500, color: tab === t.id ? '#1A1410' : 'rgba(26,20,16,0.42)', padding: '9px 0', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '10px', zIndex: 1 }}>
                {tab === t.id && (
                  <motion.div layoutId="vendor-tab-pill" transition={spring}
                    style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: '#FFFBF5', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', zIndex: -1 }} />
                )}
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {tab === 'mine' ? (
              <motion.div key="mine" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}>
                <MyVendors onVendorClick={handleVendorClick} />
              </motion.div>
            ) : (
              <motion.div key="discover" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>
                <DiscoverVendors onVendorClick={handleVendorClick} />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ height: '80px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
