import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, User, Mail, Plus, X, Heart, Phone, Sparkles, Upload, Link2, Check } from 'lucide-react'

const STEPS = ['Wedding', 'Partner', 'Family', 'Vision', 'Ready']

const spring = { type: 'spring', stiffness: 420, damping: 32 }
const springGentle = { type: 'spring', stiffness: 280, damping: 28 }

const slideVariants = {
  enter: dir => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0, transition: springGentle },
  exit:  dir => ({ opacity: 0, x: dir > 0 ? -48 : 48, transition: { ...springGentle, stiffness: 350 } }),
}

function CircularProgress({ current, total }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const progress = (current + 1) / total
  return (
    <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
      <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2.5" />
        <motion.circle
          cx="26" cy="26" r={r}
          fill="none" stroke="#7A0F46" strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ * (1 - progress) }}
          transition={spring}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-outfit" style={{ fontSize: '11px', fontWeight: 500, color: '#1A1410' }}>
          {current + 1}<span style={{ color: 'rgba(26,20,16,0.35)', fontWeight: 300 }}>/{total}</span>
        </span>
      </div>
    </div>
  )
}

function InputRow({ icon: Icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className="glass-input flex items-center gap-3" style={{ padding: '14px 16px' }}>
      <Icon size={15} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

// ISO "YYYY-MM-DD" ↔ display "MM/DD/YY"
const toISO = (mmddyy) => {
  if (!mmddyy) return ''
  const [mm, dd, yy] = mmddyy.split('/')
  if (!mm || !dd || !yy) return ''
  return `20${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}
const toDisplay = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y.slice(2)}`
}

function DateInputRow({ value, onChange }) {
  const ref = useRef(null)
  const open = () => {
    if (!ref.current) return
    if (ref.current.showPicker) ref.current.showPicker()
    else ref.current.click()
  }
  return (
    <div
      className="glass-input flex items-center gap-3"
      style={{ padding: '14px 16px', cursor: 'pointer' }}
      onClick={open}
    >
      <Calendar size={15} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0, pointerEvents: 'none' }} />
      <span className="font-outfit" style={{
        flex: 1, fontSize: '14px', fontWeight: 300,
        color: value ? '#1A1410' : 'rgba(26,20,16,0.3)',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        {value || 'Wedding date (MM/DD/YY)'}
      </span>
      {/* Hidden but reachable input — showPicker() opens the OS picker */}
      <input
        ref={ref}
        type="date"
        value={toISO(value)}
        onChange={e => { e.stopPropagation(); onChange(toDisplay(e.target.value)) }}
        tabIndex={-1}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, border: 'none' }}
      />
    </div>
  )
}

// ── Step 1 ──
function WeddingStep({ data, setData, onNext }) {
  const isValid = data.bride.trim() && data.groom.trim() && data.date.trim() && data.venue.trim()
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-cormorant italic" style={{ fontSize: '30px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Tell us about your wedding
        </h2>
        <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
          This is your command centre. We'll watch everything so you don't have to.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <InputRow icon={Heart} placeholder="Bride's name" value={data.bride} onChange={v => setData(d => ({ ...d, bride: v }))} />
        <InputRow icon={Heart} placeholder="Groom's name" value={data.groom} onChange={v => setData(d => ({ ...d, groom: v }))} />
        <DateInputRow value={data.date} onChange={v => setData(d => ({ ...d, date: v }))} />
        <InputRow icon={MapPin} placeholder="Venue" value={data.venue} onChange={v => setData(d => ({ ...d, venue: v }))} />
      </div>
      <button
        onClick={isValid ? onNext : undefined}
        disabled={!isValid}
        className="w-full font-outfit"
        style={{
          background: isValid ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(122,15,70,0.18)',
          color: isValid ? '#FFFFFF' : 'rgba(196,80,30,0.45)',
          fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none',
          cursor: isValid ? 'pointer' : 'not-allowed',
          boxShadow: isValid ? '0 6px 24px rgba(122,15,70,0.28)' : 'none',
          transition: 'all 0.2s ease', pointerEvents: !isValid ? 'none' : undefined,
        }}
      >
        Continue →
      </button>
    </div>
  )
}

// ── Step 2 ──
function PartnerStep({ data, setData, onNext, onSkip }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-cormorant italic" style={{ fontSize: '30px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Invite your partner
        </h2>
        <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
          They'll see the full picture in real time — ceremonies, vendors, everything.
        </p>
      </div>
      <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(200,151,58,0.22)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.22)', flexShrink: 0 }}>
            <Heart size={14} color="#7A0F46" />
          </div>
          <div>
            <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>Partner access</p>
            <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', margin: 0 }}>Full edit access to the workspace</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="glass-input flex items-center gap-3" style={{ padding: '13px 16px' }}>
            <User size={14} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
            <input type="text" placeholder="Partner's name" value={data.partnerName} onChange={e => setData(d => ({ ...d, partnerName: e.target.value }))} />
          </div>
          <div className="glass-input flex items-center gap-3" style={{ padding: '13px 16px' }}>
            <Mail size={14} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
            <input type="email" placeholder="Partner's email" value={data.partnerEmail} onChange={e => setData(d => ({ ...d, partnerEmail: e.target.value }))} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onNext} className="w-full font-outfit" style={{ background: data.partnerEmail ? 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)' : 'rgba(196,80,30,0.2)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: data.partnerEmail ? '0 6px 24px rgba(122,15,70,0.28)' : 'none', transition: 'all 0.22s ease' }}>
          Send invite →
        </button>
        <button onClick={onSkip} className="w-full font-outfit" style={{ background: 'none', border: 'none', color: 'rgba(26,20,16,0.32)', fontSize: '13px', fontWeight: 300, padding: '10px', cursor: 'pointer' }}>
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ── Step 3 ──
const ROLES = ['Mother', 'Father', 'Sister', 'Brother', 'Aunt/Uncle', 'Friend', 'Other']

function FamilyStep({ members, setMembers, onNext, onSkip }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [contactType, setContactType] = useState('email') // 'email' | 'phone'
  const [role, setRole] = useState('Mother')

  const canAdd = name.trim() && contact.trim()

  const addMember = () => {
    if (!canAdd) return
    setMembers(m => [...m, { id: Date.now(), name, [contactType]: contact, role }])
    setName('')
    setContact('')
  }

  const switchType = (t) => { setContactType(t); setContact('') }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-cormorant italic" style={{ fontSize: '30px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Invite family
        </h2>
        <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
          Give family members a live view — no logins needed, just a link.
        </p>
      </div>
      <div className="glass-card flex flex-col gap-3" style={{ padding: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
        {/* Name */}
        <div className="glass-input flex items-center gap-3" style={{ padding: '12px 14px' }}>
          <User size={14} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </div>

        {/* Email / Phone toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '3px' }}>
          {[['email', 'Email'], ['phone', 'Phone']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => switchType(t)}
              className="font-outfit"
              style={{
                flex: 1, fontSize: '12px', fontWeight: contactType === t ? 500 : 300,
                color: contactType === t ? '#1A1410' : 'rgba(26,20,16,0.4)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '6px', borderRadius: '8px', position: 'relative',
                transition: 'color 0.2s ease',
              }}
            >
              {contactType === t && (
                <motion.div
                  layoutId="contact-pill"
                  style={{ position: 'absolute', inset: 0, borderRadius: '8px', background: '#FFFBF5', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Contact input — animates between types */}
        <AnimatePresence mode="wait">
          <motion.div
            key={contactType}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-input flex items-center gap-3"
            style={{ padding: '12px 14px' }}
          >
            {contactType === 'email'
              ? <Mail size={14} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
              : <Phone size={14} style={{ color: 'rgba(26,20,16,0.28)', flexShrink: 0 }} />
            }
            <input
              type={contactType === 'email' ? 'email' : 'tel'}
              placeholder={contactType === 'email' ? 'Email address' : 'Phone number'}
              value={contact}
              onChange={e => setContact(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMember()}
            />
          </motion.div>
        </AnimatePresence>

        {/* Role chips */}
        <div className="flex gap-1.5 flex-wrap">
          {ROLES.map(r => (
            <button key={r} onClick={() => setRole(r)} className="font-outfit" style={{ fontSize: '10px', fontWeight: 400, padding: '5px 11px', borderRadius: '99px', cursor: 'pointer', background: role === r ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.04)', color: role === r ? '#7A0F46' : 'rgba(26,20,16,0.38)', border: role === r ? '1px solid rgba(122,15,70,0.30)' : '1px solid rgba(0,0,0,0.08)', transition: 'all 0.15s ease' }}>
              {r}
            </button>
          ))}
        </div>

        <button onClick={addMember} disabled={!canAdd} className="inline-flex items-center justify-center gap-2 font-outfit" style={{ background: canAdd ? 'rgba(122,15,70,0.08)' : 'rgba(0,0,0,0.04)', border: canAdd ? '1px solid rgba(122,15,70,0.28)' : '1px solid rgba(0,0,0,0.08)', color: canAdd ? '#7A0F46' : 'rgba(26,20,16,0.28)', fontSize: '12px', fontWeight: 500, padding: '10px', borderRadius: '10px', cursor: canAdd ? 'pointer' : 'default', transition: 'all 0.15s ease', pointerEvents: !canAdd ? 'none' : undefined }}>
          <Plus size={13} /> Add member
        </button>
      </div>
      {members.length > 0 && (
        <div className="flex flex-col gap-2">
          {members.map(m => (
            <div key={m.id} className="glass-card flex items-center gap-3" style={{ padding: '11px 14px', border: '1px solid rgba(61,122,52,0.22)' }}>
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '28px', height: '28px', background: 'rgba(61,122,52,0.08)' }}>
                <User size={12} color="#2D6025" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#1A1410', margin: 0 }}>{m.name}</p>
                <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 300, color: 'rgba(26,20,16,0.38)', margin: 0 }}>{m.role} · {m.email || m.phone}</p>
              </div>
              <button onClick={() => setMembers(ms => ms.filter(x => x.id !== m.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={13} style={{ color: 'rgba(26,20,16,0.28)' }} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <button onClick={onNext} className="w-full font-outfit" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(122,15,70,0.28)' }}>
          {members.length > 0 ? `Send ${members.length} invite${members.length > 1 ? 's' : ''} →` : 'Continue →'}
        </button>
        {members.length === 0 && (
          <button onClick={onSkip} className="w-full font-outfit" style={{ background: 'none', border: 'none', color: 'rgba(26,20,16,0.32)', fontSize: '13px', fontWeight: 300, padding: '10px', cursor: 'pointer' }}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}

// ── Step 4: Vision ──
const VIBES = ['Traditional & grand', 'Intimate & personal', 'Modern fusion', 'Garden / outdoor', 'Destination', 'Royal / palace']

function VisionStep({ data, setData, onNext, onSkip }) {
  const fileRef = useRef(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const [uploadedImage, setUploadedImage] = useState(null)

  const hasInput = data.description.trim() || data.pinterest.trim() || uploadedImage

  const handleContinue = () => {
    if (!hasInput) { onSkip(); return }
    setAnalyzing(true)
    setAnalyzingStep(0)
    const steps = [0, 1, 2, 3]
    steps.forEach((_, i) => setTimeout(() => setAnalyzingStep(i), i * 560))
    setTimeout(() => { setAnalyzing(false); onNext() }, steps.length * 560 + 300)
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploadedImage(URL.createObjectURL(file))
  }

  const analyzingSteps = [
    'Reading your wedding description…',
    'Scanning moodboard for style cues…',
    'Mapping tasks to your wedding type…',
    'Curating your personalised task list…',
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-cormorant italic" style={{ fontSize: '30px', color: '#1A1410', fontWeight: 300, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Your wedding vision
        </h2>
        <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
          Help our AI curate a personalised task list for your celebration.
        </p>
      </div>

      {/* Description */}
      <div className="glass-card" style={{ padding: '14px 16px' }}>
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Describe your wedding</p>
        <textarea
          placeholder="e.g. Traditional Tamil Brahmin wedding at a heritage palace, minimalist white florals, vegetarian feast, 400 guests, 3-day celebration…"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          rows={3}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: '13px', fontWeight: 300, color: '#1A1410', fontFamily: 'Outfit, sans-serif', lineHeight: 1.6 }}
        />
        {/* Vibe chips */}
        <div className="flex gap-1.5 flex-wrap" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {VIBES.map(v => (
            <button key={v} onClick={() => setData(d => ({ ...d, description: d.description ? `${d.description}, ${v.toLowerCase()}` : v }))}
              className="font-outfit"
              style={{ fontSize: '10px', fontWeight: 400, padding: '4px 10px', borderRadius: '99px', cursor: 'pointer', background: 'rgba(122,15,70,0.06)', color: '#7A0F46', border: '1px solid rgba(122,15,70,0.2)', transition: 'all 0.15s ease' }}>
              + {v}
            </button>
          ))}
        </div>
      </div>

      {/* Pinterest */}
      <div>
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px 2px' }}>Pinterest moodboard</p>
        <div className="glass-input flex items-center gap-2" style={{ padding: '12px 14px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#E60023" style={{ flexShrink: 0 }}>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          <input
            type="url"
            placeholder="https://pinterest.com/your-board/…"
            value={data.pinterest}
            onChange={e => setData(d => ({ ...d, pinterest: e.target.value }))}
            style={{ fontSize: '13px', fontWeight: 300, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1A1410', fontFamily: 'Outfit, sans-serif' }}
          />
          {data.pinterest && <Check size={13} color="#2D6025" style={{ flexShrink: 0 }} />}
        </div>
      </div>

      {/* Image upload */}
      <div>
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(26,20,16,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px 2px' }}>Or upload a moodboard image</p>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
        {uploadedImage ? (
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 100 }}>
            <img src={uploadedImage} alt="moodboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setUploadedImage(null)}
              style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: 'rgba(26,20,16,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={12} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 font-outfit"
            style={{ padding: '13px', borderRadius: '12px', border: '1.5px dashed rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.02)', fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.45)', cursor: 'pointer' }}>
            <Upload size={14} />Upload image (JPG, PNG)
          </button>
        )}
      </div>

      {/* CTA */}
      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card flex flex-col gap-3" style={{ padding: '18px 20px', border: '1px solid rgba(122,15,70,0.18)', background: 'rgba(122,15,70,0.03)' }}>
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={16} color="#7A0F46" />
              </motion.div>
              <span className="font-outfit" style={{ fontSize: '12px', fontWeight: 500, color: '#7A0F46' }}>
                {analyzingSteps[analyzingStep]}
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(122,15,70,0.1)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${((analyzingStep + 1) / analyzingSteps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #7A0F46, #5C0B35)', borderRadius: 99 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="ctas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
            <button onClick={handleContinue}
              className="w-full font-outfit"
              style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, padding: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(122,15,70,0.28)' }}>
              {hasInput ? 'Curate my task list →' : 'Skip for now'}
            </button>
            {hasInput && (
              <button onClick={onSkip}
                className="w-full font-outfit"
                style={{ background: 'none', border: 'none', color: 'rgba(26,20,16,0.32)', fontSize: '13px', fontWeight: 300, padding: '10px', cursor: 'pointer' }}>
                Skip for now
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Step 5 ──
function ReadyStep({ wedding, hasVision, onEnter }) {
  const features = hasVision
    ? ['Task list curated from your vision', 'Vendor tracking active', 'AI crisis detection on', 'Real-time timeline ready']
    : ['Vendor tracking active', 'AI crisis detection on', 'Real-time timeline ready']

  return (
    <motion.div className="flex flex-col items-center gap-6 text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, ease: [0.25,0.1,0.25,1] }}>
      <div style={{ marginTop: '20px', marginBottom: '8px' }} />
      <div>
        <p className="font-outfit" style={{ fontSize: '10px', fontWeight: 600, color: '#7A0F46', letterSpacing: '0.16em', margin: '0 0 10px' }}>YOUR WEDDING IS READY</p>
        <h2 className="font-cormorant italic" style={{ fontSize: '34px', color: '#1A1410', fontWeight: 300, margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {wedding.bride && wedding.groom ? `${wedding.bride} & ${wedding.groom}` : 'Your wedding'}
        </h2>
        <p className="font-outfit" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,20,16,0.45)', margin: 0 }}>
          {wedding.venue || 'Venue TBD'} · {wedding.date || 'Date TBD'}
        </p>
      </div>
      <div className="glass-card w-full" style={{ padding: '16px 18px', textAlign: 'left' }}>
        {features.map((feat, i) => (
          <div key={i} className="flex items-center gap-3" style={{ marginBottom: i < features.length - 1 ? '10px' : 0 }}>
            <span className="rounded-full flex-shrink-0" style={{ width: '6px', height: '6px', background: i === 0 && hasVision ? '#7A0F46' : '#3D7A34' }} />
            <span className="font-outfit" style={{ fontSize: '12px', fontWeight: i === 0 && hasVision ? 400 : 300, color: i === 0 && hasVision ? '#7A0F46' : 'rgba(26,20,16,0.65)' }}>{feat}</span>
          </div>
        ))}
      </div>
      <button onClick={onEnter} className="w-full font-outfit" style={{ background: 'linear-gradient(135deg, #7A0F46 0%, #5C0B35 100%)', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(196,80,30,0.32)', letterSpacing: '0.01em' }}>
        Enter Shaadi Mubarak →
      </button>
    </motion.div>
  )
}

// ── Main ──
export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [weddingData, setWeddingData] = useState({ bride: '', groom: '', date: '', venue: '' })
  const [inviteData, setInviteData] = useState({ partnerName: '', partnerEmail: '' })
  const [familyMembers, setFamilyMembers] = useState([])
  const [visionData, setVisionData] = useState({ description: '', pinterest: '' })

  const TOTAL = STEPS.length // 5
  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL - 1)) }
  const goSkip = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL - 1)) }

  return (
    <div className="relative flex flex-col h-full" style={{ background: '#FFFBF5' }}>
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Top bar */}
        <div className="flex items-center px-5 pt-5 pb-2 flex-shrink-0" style={{ position: 'relative' }}>
          <span className="font-cormorant italic" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#7A0F46', fontWeight: 300, whiteSpace: 'nowrap' }}>
            Shaadi Mubarak
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <CircularProgress current={step} total={TOTAL} />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 px-5 pb-6 pt-4 overflow-y-auto no-scrollbar flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
              {step === 0 && <WeddingStep data={weddingData} setData={setWeddingData} onNext={goNext} />}
              {step === 1 && <PartnerStep data={inviteData} setData={setInviteData} onNext={goNext} onSkip={goSkip} />}
              {step === 2 && <FamilyStep members={familyMembers} setMembers={setFamilyMembers} onNext={goNext} onSkip={goSkip} />}
              {step === 3 && <VisionStep data={visionData} setData={setVisionData} onNext={goNext} onSkip={goSkip} />}
              {step === 4 && <ReadyStep wedding={weddingData} hasVision={!!(visionData.description.trim() || visionData.pinterest.trim())} onEnter={onComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
