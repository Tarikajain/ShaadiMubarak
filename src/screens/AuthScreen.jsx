import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, CheckCircle } from 'lucide-react'
import { ThemeProvider, createTheme, TextField, InputAdornment } from '@mui/material'
import GoogleSignInDrawer from '../components/ui/GoogleSignInDrawer'

// Spring configs
const spring = { type: 'spring', stiffness: 420, damping: 32 }
const springGentle = { type: 'spring', stiffness: 280, damping: 28 }

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: springGentle },
  exit: { opacity: 0, x: -24, transition: { ...springGentle, stiffness: 350 } },
}

// ─── MUI theme — matches BasicsStep exactly ────────────────────────────────────

const formTheme = createTheme({
  typography: { fontFamily: 'Inter, sans-serif' },
  palette:    { primary: { main: '#7A0F46' } },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(26,20,16,0.55)',
          '&.Mui-focused': { color: '#7A0F46' },
        },
        sizeSmall: { fontSize: '13px' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFBF5',
          borderRadius: '14px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease',
          paddingLeft: '10px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(122,15,70,0.40)',
            borderWidth: '1px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(122,15,70,0.08)',
          },
        },
        notchedOutline: { borderColor: 'rgba(0,0,0,0.10)' },
        input: {
          padding: '10px 14px 10px 4px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#1A1410',
          '&::placeholder': { color: 'rgba(26,20,16,0.30)', opacity: 1 },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionStart: { marginRight: '4px' },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 400,
          marginLeft: '4px',
        },
      },
    },
  },
})

// ─── OTP Input ───────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const len = 6
  const digits = value.split('').concat(Array(len).fill('')).slice(0, len)
  const refs = useRef([])

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = digits.map((d, j) => j === i ? '' : d).join('')
        onChange(next)
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
      }
    }
  }

  const handleChange = (i, ch) => {
    const digit = ch.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const next = digits.map((d, j) => j === i ? digit : d).join('')
    onChange(next)
    if (i < len - 1) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, len)
    if (pasted) { onChange(pasted.padEnd(len, '').slice(0, len)); refs.current[Math.min(pasted.length, len - 1)]?.focus() }
    e.preventDefault()
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="font-work-sans"
          style={{
            width: '44px', height: '52px', textAlign: 'center',
            fontSize: '20px', fontWeight: 400, color: '#1A1410',
            background: '#FFFBF5', border: '1px solid',
            borderColor: d ? 'rgba(122,15,70,0.55)' : 'rgba(0,0,0,0.12)',
            borderRadius: '12px', outline: 'none',
            boxShadow: d ? '0 0 0 3px rgba(122,15,70,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            caretColor: 'transparent',
          }}
          animate={{ scale: d ? [1.08, 1] : 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        />
      ))}
    </div>
  )
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CtaButton({ label, onClick, disabled, loading }) {
  return (
    <motion.button
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      layout
      className="w-full font-work-sans"
      animate={{
        background: disabled ? 'rgba(122,15,70,0.18)' : 'linear-gradient(135deg,#7A0F46 0%,#5C0B35 100%)',
        color: disabled ? 'rgba(255,251,245,0.55)' : '#FFFBF5',
        boxShadow: disabled ? 'none' : '0 6px 20px rgba(122,15,70,0.28)',
        opacity: loading ? 0.7 : 1,
      }}
      transition={spring}
      style={{
        fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
        letterSpacing: '0.01em',
        padding: '15px', borderRadius: '14px', border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        pointerEvents: disabled ? 'none' : undefined,
      }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
    >
      {label}
    </motion.button>
  )
}

// ─── Forgot password sub-screens ─────────────────────────────────────────────
function ForgotEmailView({ onBack, onSent }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const send = () => {
    if (!email.trim() || loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onSent(email) }, 1000)
  }

  return (
    <motion.div key="forgot-email" {...slideIn} className="flex flex-col gap-5">
      <div>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', color: 'rgba(26,20,16,0.62)' }}>
          <ArrowLeft size={14} />
          <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400 }}>Back to sign in</span>
        </button>
        <h2 className="font-cormorant italic" style={{ fontSize: '28px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.02em', textAlign: 'center' }}>Reset your password</h2>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0, lineHeight: 1.55 }}>
          We'll send a 6-digit code to your email address.
        </p>
      </div>
      <ThemeProvider theme={formTheme}>
        <TextField
          fullWidth size="small"
          label="Email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          slotProps={{ input: { startAdornment: (
            <InputAdornment position="start">
              <Mail size={15} style={{ color: email ? '#7A0F46' : 'rgba(26,20,16,0.28)' }} />
            </InputAdornment>
          )}}}
        />
      </ThemeProvider>
      <CtaButton label={loading ? 'Sending…' : 'Send reset code →'} onClick={send} disabled={!email.trim()} loading={loading} />
    </motion.div>
  )
}

function ForgotCodeView({ email, onBack, onVerified }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const isValid = code.replace(/\D/g, '').length === 6

  const verify = () => {
    if (!isValid || loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onVerified(code) }, 900)
  }
  const resend = () => { setResent(true); setTimeout(() => setResent(false), 3000) }

  return (
    <motion.div key="forgot-code" {...slideIn} className="flex flex-col gap-5">
      <div>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', color: 'rgba(26,20,16,0.62)' }}>
          <ArrowLeft size={14} />
          <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400 }}>Back</span>
        </button>
        <h2 className="font-cormorant italic" style={{ fontSize: '28px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.02em', textAlign: 'center' }}>Check your email</h2>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0, lineHeight: 1.55 }}>
          Code sent to <strong style={{ fontWeight: 500, color: '#1A1410' }}>{email}</strong>. Enter it below.
        </p>
      </div>
      <OtpInput value={code} onChange={setCode} />
      <CtaButton label={loading ? 'Verifying…' : 'Verify code →'} onClick={verify} disabled={!isValid} loading={loading} />
      <div className="text-center">
        <AnimatePresence mode="wait">
          {resent ? (
            <motion.p key="sent" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: '#2D6025', margin: 0 }}>
              ✓ Code resent
            </motion.p>
          ) : (
            <motion.p key="resend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
              Didn't get it?{' '}
              <button onClick={resend} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#7A0F46', padding: 0 }}>
                Resend code
              </button>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function ForgotResetView({ onBack, onDone }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const match = password && confirm && password === confirm
  const mismatch = confirm && password !== confirm

  const save = () => {
    if (!match || loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onDone() }, 900)
  }

  const eyeButton = (
    <InputAdornment position="end">
      <button onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
        {showPw ? <EyeOff size={15} style={{ color: 'rgba(26,20,16,0.28)' }} /> : <Eye size={15} style={{ color: 'rgba(26,20,16,0.28)' }} />}
      </button>
    </InputAdornment>
  )

  return (
    <motion.div key="forgot-reset" {...slideIn} className="flex flex-col gap-5">
      <div>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', color: 'rgba(26,20,16,0.62)' }}>
          <ArrowLeft size={14} />
          <span className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400 }}>Back</span>
        </button>
        <h2 className="font-cormorant italic" style={{ fontSize: '28px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.02em', textAlign: 'center' }}>New password</h2>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>
          Choose something memorable.
        </p>
      </div>
      <ThemeProvider theme={formTheme}>
        <TextField
          fullWidth size="small"
          label="New password"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          slotProps={{ input: {
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={15} style={{ color: password ? '#7A0F46' : 'rgba(26,20,16,0.28)' }} />
              </InputAdornment>
            ),
            endAdornment: eyeButton,
          }}}
        />
        <TextField
          fullWidth size="small"
          label="Confirm password"
          type={showPw ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          error={!!mismatch}
          helperText={mismatch ? "Passwords don't match" : ''}
          slotProps={{ input: { startAdornment: (
            <InputAdornment position="start">
              <Lock size={15} style={{ color: confirm ? (mismatch ? '#B03A10' : '#7A0F46') : 'rgba(26,20,16,0.28)' }} />
            </InputAdornment>
          )}}}
        />
      </ThemeProvider>
      <CtaButton label={loading ? 'Saving…' : 'Save password →'} onClick={save} disabled={!match} loading={loading} />
    </motion.div>
  )
}

function ForgotDoneView({ onSignIn }) {
  useEffect(() => { const t = setTimeout(onSignIn, 2200); return () => clearTimeout(t) }, [onSignIn])
  return (
    <motion.div key="forgot-done" {...slideIn} className="flex flex-col items-center gap-5 text-center" style={{ paddingTop: '20px' }}>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      >
        <CheckCircle size={52} color="#2D6025" strokeWidth={1.5} />
      </motion.div>
      <div>
        <h2 className="font-cormorant italic" style={{ fontSize: '28px', color: '#1A1410', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.02em', textAlign: 'center' }}>Password updated</h2>
        <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.62)', margin: 0 }}>Taking you back to sign in…</p>
      </div>
    </motion.div>
  )
}

// ─── Main AuthScreen ──────────────────────────────────────────────────────────
export default function AuthScreen({ onSignIn, onCreateWedding }) {
  const [mode, setMode] = useState('signin')
  const [view, setView] = useState('auth') // 'auth' | 'forgot-email' | 'forgot-code' | 'forgot-reset' | 'forgot-done'
  const [forgotEmail, setForgotEmail] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showGoogleDrawer, setShowGoogleDrawer] = useState(false)

  const isValid = mode === 'signin' ? email.trim() && password : name.trim() && email.trim() && password

  const switchMode = (next) => {
    setMode(next); setName(''); setEmail(''); setPassword(''); setShowPassword(false)
  }

  const handleSubmit = () => {
    if (!isValid || loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); mode === 'signup' ? onCreateWedding() : onSignIn(rememberMe) }, 900)
  }

  const handleGoogleSelect = () => {
    setShowGoogleDrawer(false); setLoading(true)
    setTimeout(() => { setLoading(false); mode === 'signup' ? onCreateWedding() : onSignIn(rememberMe) }, 900)
  }

  const eyeAdornment = (
    <InputAdornment position="end">
      <button
        onClick={() => setShowPassword(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
      >
        {showPassword
          ? <EyeOff size={15} style={{ color: 'rgba(26,20,16,0.28)' }} />
          : <Eye size={15} style={{ color: 'rgba(26,20,16,0.28)' }} />
        }
      </button>
    </InputAdornment>
  )

  return (
    <motion.div
      className="relative flex flex-col"
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* White background fades in independently */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#FFFBF5', zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      />

      <div className="flex flex-col h-full px-6 overflow-y-auto no-scrollbar justify-center" style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo — only in main auth view */}
        <AnimatePresence>
          {view === 'auth' && (
            <motion.div
              key="logo"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-3"
              style={{ paddingBottom: '32px' }}
            >
              <motion.span
                layoutId="brand-title"
                className="font-cormorant"
                style={{ fontSize: '36px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.12em', textAlign: 'center' }}
                animate={{ color: '#7A0F46' }}
                transition={{
                  layout: { duration: 0.78, ease: [0.25, 0.46, 0.45, 0.94] },
                  color:  { duration: 0.6,  ease: 'easeOut' },
                }}
              >
                Shaadi Mubarak
              </motion.span>
              <motion.div
                layoutId="brand-divider"
                style={{ height: '1px', width: '40px' }}
                animate={{ background: 'rgba(122,15,70,0.4)' }}
                transition={{
                  layout:     { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] },
                  background: { duration: 0.55, ease: 'easeOut' },
                }}
              />
              <motion.p
                className="font-work-sans"
                style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.58)', letterSpacing: '0.04em', margin: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }}
              >
                Your wedding, always in view
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode toggle — only in main auth view */}
        <AnimatePresence>
          {view === 'auth' && (
            <motion.div
              key="toggle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.65, duration: 0.4, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="flex mb-6"
              style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '3px', position: 'relative' }}
            >
              {['signin', 'signup'].map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="flex-1 font-work-sans"
                  style={{
                    fontSize: '13px', fontWeight: mode === m ? 500 : 300,
                    color: mode === m ? '#1A1410' : 'rgba(26,20,16,0.4)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '8px', borderRadius: '10px',
                    position: 'relative', zIndex: 1,
                    transition: 'color 0.22s ease',
                  }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="tab-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: '10px',
                        background: '#FFFBF5',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      }}
                      transition={spring}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {m === 'signin' ? 'Sign in' : 'Create account'}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form area */}
        <AnimatePresence mode="wait">

          {/* ── Main auth form ── */}
          {view === 'auth' && (
            <motion.div
              key="auth-form"
              {...slideIn}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.7, duration: 0.45, ease: 'easeOut' } }}
              className="flex flex-col gap-4 pb-8"
              layout
            >
              <ThemeProvider theme={formTheme}>

                {/* Full name — signup only */}
                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', transition: springGentle }}
                      exit={{ opacity: 0, height: 0, transition: { ...springGentle, stiffness: 380, damping: 30 } }}
                      style={{ overflow: 'hidden', paddingTop: 8 }}
                    >
                      <TextField
                        fullWidth size="small"
                        label={<>Full name <span style={{ color: '#7A0F46' }}>*</span></>}
                        placeholder="Your full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        slotProps={{ input: { startAdornment: (
                          <InputAdornment position="start">
                            <User size={15} style={{ color: name ? '#7A0F46' : 'rgba(26,20,16,0.28)' }} />
                          </InputAdornment>
                        )}}}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <TextField
                  fullWidth size="small"
                  label={<>Email address <span style={{ color: '#7A0F46' }}>*</span></>}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  slotProps={{ input: { startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={15} style={{ color: email ? '#7A0F46' : 'rgba(26,20,16,0.28)' }} />
                    </InputAdornment>
                  )}}}
                />

                {/* Password */}
                <TextField
                  fullWidth size="small"
                  label={<>Password <span style={{ color: '#7A0F46' }}>*</span></>}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  slotProps={{ input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={15} style={{ color: password ? '#7A0F46' : 'rgba(26,20,16,0.28)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: eyeAdornment,
                  }}}
                />

              </ThemeProvider>

              {/* Stay signed in + Forgot — sign in only */}
              <AnimatePresence>
                {mode === 'signin' && (
                  <motion.div
                    key="signin-extras"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', transition: springGentle }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                    style={{ marginTop: '-4px', overflow: 'hidden' }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setRememberMe(v => !v)}
                        className="flex items-center gap-2 font-work-sans"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: '5px', flexShrink: 0,
                          border: rememberMe ? '1.5px solid #7A0F46' : '1.5px solid rgba(26,20,16,0.22)',
                          background: rememberMe ? '#7A0F46' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.18s ease',
                        }}>
                          {rememberMe && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.55)' }}>Stay signed in</span>
                      </button>

                      <button
                        onClick={() => setView('forgot-email')}
                        className="font-work-sans"
                        style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(26,20,16,0.54)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CtaButton
                label={loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : (mode === 'signup' ? 'Create account →' : 'Sign in →')}
                onClick={handleSubmit}
                disabled={!isValid}
                loading={loading}
              />

              <div className="flex items-center gap-3">
                <div className="flex-1" style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                <span className="font-work-sans" style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(26,20,16,0.3)', letterSpacing: '0.06em' }}>or</span>
                <div className="flex-1" style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />
              </div>

              <motion.button
                onClick={() => setShowGoogleDrawer(true)}
                className="w-full glass-card flex items-center justify-center gap-3 font-work-sans"
                style={{ padding: '13px', borderRadius: '14px', cursor: 'pointer', fontSize: '13px', fontWeight: 400, color: 'rgba(26,20,16,0.65)', border: 'none' }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </motion.button>

              <div className="text-center" style={{ paddingBottom: '8px' }}>
                {mode === 'signin' ? (
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
                    New to Shaadi Mubarak?{' '}
                    <button onClick={() => switchMode('signup')} className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Create account →
                    </button>
                  </p>
                ) : (
                  <p className="font-work-sans" style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(26,20,16,0.4)', margin: 0 }}>
                    Already have an account?{' '}
                    <button onClick={() => switchMode('signin')} className="font-work-sans" style={{ fontSize: '12px', fontWeight: 500, color: '#7A0F46', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Sign in →
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Forgot password sub-flows ── */}
          {view === 'forgot-email' && (
            <ForgotEmailView
              key="forgot-email"
              onBack={() => setView('auth')}
              onSent={(e) => { setForgotEmail(e); setView('forgot-code') }}
            />
          )}
          {view === 'forgot-code' && (
            <ForgotCodeView
              key="forgot-code"
              email={forgotEmail}
              onBack={() => setView('forgot-email')}
              onVerified={() => setView('forgot-reset')}
            />
          )}
          {view === 'forgot-reset' && (
            <ForgotResetView
              key="forgot-reset"
              onBack={() => setView('forgot-code')}
              onDone={() => setView('forgot-done')}
            />
          )}
          {view === 'forgot-done' && (
            <ForgotDoneView
              key="forgot-done"
              onSignIn={() => setView('auth')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Google sign-in bottom drawer */}
      <AnimatePresence>
        {showGoogleDrawer && (
          <GoogleSignInDrawer
            onSelect={handleGoogleSelect}
            onDismiss={() => setShowGoogleDrawer(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
