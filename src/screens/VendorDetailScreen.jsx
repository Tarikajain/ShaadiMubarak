import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Phone, MessageCircle, Mail, Star, Check, ThumbsUp, ThumbsDown,
  Camera, Video, UtensilsCrossed, Flower2, Palette, Music, BookOpen, Sparkles, Music2, Globe, Heart,
} from 'lucide-react'
import StatusBar from '../components/layout/StatusBar'
import BottomNav from '../components/layout/BottomNav'
import StatusBadge from '../components/ui/StatusBadge'
import { vendorDirectory, vendorDetails } from '../data/mockData'
import { getActiveUser, getVendorReactions, setVendorReaction, getReactionSummary, FAMILY_MEMBERS } from '../utils/familyUtils'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }

const CATEGORY_ICONS = {
  'Photographer':  Camera,
  'Videographer':  Video,
  'Caterer':       UtensilsCrossed,
  'Florist':       Flower2,
  'Mehndi Artist': Palette,
  'DJ':            Music,
  'Pandit':        BookOpen,
  'Decorator':     Sparkles,
  'Baraat Band':   Music2,
}

// ── Favorites (localStorage) ─────────────────────────────────────────────────
function getFavs() {
  try { return new Set(JSON.parse(localStorage.getItem('sm_vendor_fav') || '[]')) } catch { return new Set() }
}
function setFav(id, val) {
  const s = getFavs(); val ? s.add(id) : s.delete(id)
  localStorage.setItem('sm_vendor_fav', JSON.stringify([...s]))
}

function fmt(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function SectionLabel({ children }) {
  return (
    <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.50)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

function PackageCard({ pkg, isBooked }) {
  return (
    <div style={{
      padding: '16px 18px',
      borderRadius: '16px',
      border: pkg.selected ? '1.5px solid rgba(122,15,70,0.30)' : '1px solid rgba(0,0,0,0.07)',
      background: pkg.selected ? 'rgba(122,15,70,0.05)' : '#FFFBF5',
      position: 'relative',
    }}>
      {pkg.selected && (
        <div style={{
          position: 'absolute', top: 12, right: 14,
          background: '#7A0F46', color: '#FFFBF5',
          fontSize: '9px', fontWeight: 600, padding: '3px 9px',
          borderRadius: '99px', letterSpacing: '0.08em',
        }} className="font-work-sans">
          {isBooked ? 'BOOKED' : 'RECOMMENDED'}
        </div>
      )}
      <div className="flex items-baseline justify-between gap-2 mb-3" style={{ paddingRight: pkg.selected ? '70px' : 0 }}>
        <p className="font-work-sans" style={{ fontSize: '14px', fontWeight: 600, color: pkg.selected ? '#7A0F46' : '#1A1410', margin: 0 }}>
          {pkg.name}
        </p>
        <p className="font-cormorant italic" style={{ fontSize: '20px', fontWeight: 400, color: pkg.selected ? '#7A0F46' : '#1A1410', margin: 0, flexShrink: 0 }}>
          {pkg.label}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {pkg.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{
              width: 15, height: 15, borderRadius: '50%',
              background: pkg.selected ? 'rgba(122,15,70,0.12)' : 'rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Check size={8} color={pkg.selected ? '#7A0F46' : 'rgba(26,20,16,0.54)'} strokeWidth={2.5} />
            </div>
            <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: pkg.selected ? 'rgba(122,15,70,0.75)' : 'rgba(26,20,16,0.55)', margin: 0 }}>
              {f}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div className="glass-card" style={{ padding: '14px 16px' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(122,15,70,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 600, color: '#7A0F46' }}>
            {review.name[0]}
          </span>
        </div>
        <div>
          <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{review.name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} color={i < review.rating ? '#7A0F46' : 'rgba(26,20,16,0.15)'} fill={i < review.rating ? '#7A0F46' : 'none'} />
            ))}
          </div>
        </div>
      </div>
      <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0, lineHeight: 1.55 }}>
        "{review.text}"
      </p>
    </div>
  )
}

export default function VendorDetailScreen({ vendors = [], setVendors }) {
  const { vendorId } = useParams()
  const navigate = useNavigate()

  const [activeUser, setActiveUserState] = useState(getActiveUser)
  const [reactions, setReactions] = useState(() => getVendorReactions()[vendorId] || {})
  const [isFav, setIsFav] = useState(() => getFavs().has(vendorId))

  // Re-sync active user when family member switches
  useEffect(() => {
    const sync = () => setActiveUserState(getActiveUser())
    window.addEventListener('sm_user_change', sync)
    return () => window.removeEventListener('sm_user_change', sync)
  }, [])

  const myReaction = reactions[activeUser.id] || null

  const handleReaction = (reaction) => {
    const newVal = myReaction === reaction ? null : reaction
    const updated = setVendorReaction(vendorId, activeUser.id, newVal)
    setReactions(updated[vendorId] || {})
  }

  const isBooked = /^\d+$/.test(vendorId)
  const vendorBase = isBooked
    ? vendors.find(v => String(v.id) === vendorId)
    : vendorDirectory.find(v => v.id === vendorId)
  const detail = vendorDetails[isBooked ? parseInt(vendorId) : vendorId]

  if (!vendorBase || !detail) {
    return (
      <div className="flex flex-col h-full" style={{ background: '#FFFBF5' }}>
        <StatusBar />
        <div className="flex flex-col items-center justify-center flex-1 gap-4 px-5">
          <p className="font-work-sans" style={{ color: 'rgba(26,20,16,0.4)' }}>Vendor not found</p>
          <button onClick={() => navigate('/vendors')} className="font-work-sans" style={{ color: '#7A0F46', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Back to Vendors
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const CategoryIcon = CATEGORY_ICONS[vendorBase.category] || Sparkles
  const gc = detail.galleryColors
  const heroGrad = `linear-gradient(145deg, ${gc[0]} 0%, ${gc[1]} 100%)`

  const paidPct = detail.totalAmount ? Math.round((detail.amountPaid / detail.totalAmount) * 100) : 0
  const balance = detail.totalAmount ? detail.totalAmount - detail.amountPaid : null

  const handleCall = () => window.open(`tel:${detail.contact.phone}`, '_self')
  const handleWhatsApp = () => {
    const num = detail.contact.phone.replace(/\D/g, '')
    const normalized = num.startsWith('91') ? num : `91${num}`
    window.open(`https://wa.me/${normalized}`, '_blank')
  }
  const handleEmail = () => window.open(`mailto:${detail.contact.email}`, '_self')
  const handleWebsite = () => window.open(`https://${detail.contact.website}`, '_blank')

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        <StatusBar />

        {/* ── Hero ── */}
        <div style={{ position: 'relative', height: '220px', background: heroGrad, flexShrink: 0 }}>
          {/* Back pill */}
          <button
            onClick={() => navigate('/vendors')}
            style={{
              position: 'absolute', top: 12, left: 16, zIndex: 10,
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(26,20,16,0.50)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '99px', padding: '6px 12px 6px 8px',
              cursor: 'pointer',
            }}>
            <ChevronLeft size={14} color="#FFFBF5" strokeWidth={2} />
            <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#FFFBF5' }}>Vendors</span>
          </button>

          {/* Top-right: status/rating + heart */}
          <div className="flex items-center gap-2" style={{ position: 'absolute', top: 14, right: 16, zIndex: 10 }}>
            {isBooked ? (
              <StatusBadge status={vendorBase.status} />
            ) : (
              <div className="flex items-center gap-1" style={{
                background: 'rgba(26,20,16,0.50)', backdropFilter: 'blur(8px)',
                padding: '5px 10px', borderRadius: '99px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <Star size={10} color="#F5D98A" fill="#F5D98A" />
                <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: '#FFFBF5' }}>{vendorBase.rating}</span>
                <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>({vendorBase.reviews})</span>
              </div>
            )}
            {/* Heart / favorite button */}
            <motion.button
              onClick={() => { const next = !isFav; setIsFav(next); setFav(vendorId, next) }}
              whileTap={{ scale: 0.82 }}
              style={{
                width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isFav ? 'rgba(196,80,30,0.82)' : 'rgba(26,20,16,0.50)',
                backdropFilter: 'blur(8px)',
                border: isFav ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
              <motion.div
                key={String(isFav)}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
                <Heart
                  size={15}
                  color={isFav ? '#FFFBF5' : 'rgba(255,255,255,0.88)'}
                  fill={isFav ? '#FFFBF5' : 'none'}
                  strokeWidth={2}
                />
              </motion.div>
            </motion.button>
          </div>

          {/* Category watermark icon */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -58%)', opacity: 0.15, pointerEvents: 'none' }}>
            <CategoryIcon size={88} color="#FFFBF5" strokeWidth={0.8} />
          </div>

          {/* Name / category overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '36px 20px 18px',
            background: 'linear-gradient(0deg, rgba(26,20,16,0.78) 0%, transparent 100%)',
          }}>
            <p className="font-work-sans" style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', margin: '0 0 5px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {vendorBase.category}{vendorBase.location ? ` · ${vendorBase.location}` : ''}
            </p>
            <h1 className="font-cormorant italic" style={{ fontSize: '30px', fontWeight: 500, color: '#FFFBF5', margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {vendorBase.name}
            </h1>
          </div>
        </div>

        {/* ── Gallery strip ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3" style={{ flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {gc.map((color, i) => (
            <div key={i} style={{
              width: '96px', height: '64px', borderRadius: '10px', flexShrink: 0,
              background: `linear-gradient(135deg, ${color} 0%, ${gc[(i + 1) % gc.length]} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9,
            }}>
              <CategoryIcon size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.5} />
            </div>
          ))}
          <div style={{
            width: '96px', height: '64px', borderRadius: '10px', flexShrink: 0,
            border: '1.5px dashed rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p className="font-work-sans" style={{ fontSize: '10px', color: 'rgba(26,20,16,0.50)', margin: 0, textAlign: 'center', lineHeight: 1.3 }}>View<br/>portfolio</p>
          </div>
        </div>

        {/* ── Body ── */}
        <motion.div className="flex flex-col gap-5 px-5 pt-5 pb-4" variants={container} initial="hidden" animate="show">

          {/* About */}
          <motion.div variants={item}>
            <SectionLabel>About</SectionLabel>
            <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.68)', margin: 0, lineHeight: 1.65 }}>
              {detail.bio}
            </p>
          </motion.div>

          {/* Family Opinions */}
          <motion.div variants={item}>
            <SectionLabel>Family Opinions</SectionLabel>
            <div className="glass-card" style={{ padding: '16px 18px' }}>
              {/* Vote row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(26,20,16,0.40)', margin: '0 0 2px' }}>Voting as</p>
                  <p className="font-work-sans" style={{ fontSize: '13px', fontWeight: 600, color: activeUser.color, margin: 0 }}>{activeUser.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReaction('like')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '8px 14px', borderRadius: '99px', cursor: 'pointer',
                      background: myReaction === 'like' ? 'rgba(45,96,37,0.10)' : 'rgba(0,0,0,0.03)',
                      border: myReaction === 'like' ? '1.5px solid rgba(45,96,37,0.30)' : '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.15s',
                    }}>
                    <ThumbsUp
                      size={14}
                      color={myReaction === 'like' ? '#2D6025' : 'rgba(26,20,16,0.38)'}
                      fill={myReaction === 'like' ? 'rgba(45,96,37,0.25)' : 'none'}
                      strokeWidth={2}
                    />
                    <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: myReaction === 'like' ? '#2D6025' : 'rgba(26,20,16,0.40)' }}>Love it</span>
                  </button>
                  <button
                    onClick={() => handleReaction('dislike')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '8px 14px', borderRadius: '99px', cursor: 'pointer',
                      background: myReaction === 'dislike' ? 'rgba(196,80,30,0.07)' : 'rgba(0,0,0,0.03)',
                      border: myReaction === 'dislike' ? '1.5px solid rgba(196,80,30,0.25)' : '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.15s',
                    }}>
                    <ThumbsDown
                      size={14}
                      color={myReaction === 'dislike' ? '#B03A10' : 'rgba(26,20,16,0.38)'}
                      fill={myReaction === 'dislike' ? 'rgba(176,58,16,0.18)' : 'none'}
                      strokeWidth={2}
                    />
                    <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: myReaction === 'dislike' ? '#B03A10' : 'rgba(26,20,16,0.40)' }}>Concerns</span>
                  </button>
                </div>
              </div>

              {/* Family reactions — only show when someone has voted */}
              {Object.keys(reactions).length > 0 && (
                <>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '14px 0 12px' }} />

                  {/* Member avatars with reaction */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {FAMILY_MEMBERS.filter(m => reactions[m.id]).map(member => {
                      const r = reactions[member.id]
                      return (
                        <div key={member.id} className="flex items-center gap-1.5" style={{
                          padding: '4px 10px 4px 5px', borderRadius: '99px',
                          background: r === 'like' ? 'rgba(45,96,37,0.07)' : 'rgba(196,80,30,0.06)',
                          border: r === 'like' ? '1px solid rgba(45,96,37,0.20)' : '1px solid rgba(196,80,30,0.18)',
                        }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: member.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <span className="font-work-sans" style={{ fontSize: '8px', fontWeight: 700, color: '#FFF', letterSpacing: '0.02em' }}>{member.initials}</span>
                          </div>
                          {r === 'like'
                            ? <ThumbsUp size={11} color="#2D6025" fill="rgba(45,96,37,0.25)" strokeWidth={2} />
                            : <ThumbsDown size={11} color="#B03A10" fill="rgba(176,58,16,0.18)" strokeWidth={2} />
                          }
                          <span className="font-work-sans" style={{ fontSize: '11px', fontWeight: 500, color: r === 'like' ? '#2D6025' : '#B03A10' }}>
                            {member.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* AI summary sentence */}
                  {getReactionSummary(reactions) && (
                    <p className="font-cormorant italic" style={{ fontSize: '14px', color: 'rgba(26,20,16,0.62)', margin: 0, lineHeight: 1.55 }}>
                      "{getReactionSummary(reactions)}"
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Contact actions */}
          <motion.div variants={item}>
            <SectionLabel>Contact</SectionLabel>
            <div className="flex gap-2.5">
              {detail.contact.phone && (
                <button onClick={handleCall} className="flex-1 flex flex-col items-center gap-1.5 font-work-sans" style={{
                  padding: '13px 8px', borderRadius: '14px',
                  background: 'rgba(122,15,70,0.07)', border: '1px solid rgba(122,15,70,0.18)', cursor: 'pointer',
                }}>
                  <Phone size={18} color="#7A0F46" strokeWidth={1.5} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#7A0F46' }}>Call</span>
                </button>
              )}
              {detail.contact.phone && (
                <button onClick={handleWhatsApp} className="flex-1 flex flex-col items-center gap-1.5 font-work-sans" style={{
                  padding: '13px 8px', borderRadius: '14px',
                  background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.28)', cursor: 'pointer',
                }}>
                  <MessageCircle size={18} color="#25D366" strokeWidth={1.5} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#1A7A3A' }}>WhatsApp</span>
                </button>
              )}
              {detail.contact.email && (
                <button onClick={handleEmail} className="flex-1 flex flex-col items-center gap-1.5 font-work-sans" style={{
                  padding: '13px 8px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
                }}>
                  <Mail size={18} color="rgba(26,20,16,0.5)" strokeWidth={1.5} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.55)' }}>Email</span>
                </button>
              )}
              {detail.contact.website && (
                <button onClick={handleWebsite} className="flex-1 flex flex-col items-center gap-1.5 font-work-sans" style={{
                  padding: '13px 8px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
                }}>
                  <Globe size={18} color="rgba(26,20,16,0.5)" strokeWidth={1.5} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(26,20,16,0.55)' }}>Website</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Contract / payment — booked vendors only */}
          {isBooked && detail.totalAmount && (
            <motion.div variants={item}>
              <SectionLabel>Contract</SectionLabel>
              <div className="glass-card" style={{ padding: '16px 18px' }}>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: '0 0 3px' }}>Package booked</p>
                    <p className="font-work-sans" style={{ fontSize: '15px', fontWeight: 600, color: '#1A1410', margin: 0 }}>{detail.bookedPackage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: '0 0 2px' }}>Total value</p>
                    <p className="font-cormorant italic" style={{ fontSize: '22px', fontWeight: 400, color: '#1A1410', margin: 0 }}>{fmt(detail.totalAmount)}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(0,0,0,0.07)', marginBottom: '10px' }}>
                  <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #7A0F46, #5C0B35)', width: `${paidPct}%`, transition: 'width 0.5s ease' }} />
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6025' }} />
                    <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', margin: 0 }}>
                      Paid: <span style={{ color: '#2D6025', fontWeight: 600 }}>{fmt(detail.amountPaid)}</span>
                    </p>
                  </div>
                  <p className="font-work-sans" style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.5)', margin: 0 }}>
                    Balance: <span style={{ color: '#B03A10', fontWeight: 600 }}>{fmt(balance)}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Packages & Pricing */}
          <motion.div variants={item}>
            <SectionLabel>Packages &amp; Pricing</SectionLabel>
            <div className="flex flex-col gap-3">
              {detail.packages.map((pkg, i) => (
                <PackageCard key={i} pkg={pkg} isBooked={isBooked} />
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          {detail.reviews?.length > 0 && (
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-2.5">
                <SectionLabel>Reviews</SectionLabel>
                {!isBooked && vendorBase.rating && (
                  <div className="flex items-center gap-1 mb-2.5">
                    <Star size={11} color="#7A0F46" fill="#7A0F46" />
                    <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 600, color: '#1A1410' }}>{vendorBase.rating}</span>
                    <span className="font-work-sans" style={{ fontSize: '11px', color: 'rgba(26,20,16,0.4)' }}> · {vendorBase.reviews} reviews</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {detail.reviews.map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA for discovery vendors */}
          {!isBooked && (
            <motion.div variants={item}>
              <button
                className="w-full font-work-sans"
                style={{
                  background: 'linear-gradient(135deg, #C4501E, #A03A12)',
                  color: '#FFFBF5', fontSize: '14px', fontWeight: 600,
                  fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em',
                  padding: '15px', borderRadius: '14px', border: 'none',
                  cursor: 'pointer', boxShadow: '0 6px 20px rgba(196,80,30,0.28)',
                }}>
                Request a quote
              </button>
            </motion.div>
          )}

          <div style={{ height: '80px' }} />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  )
}
