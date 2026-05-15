import { useState, useEffect } from 'react'
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import MobileFrame from './components/layout/MobileFrame'
import SplashScreen from './screens/SplashScreen'
import AuthScreen from './screens/AuthScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import EventDayScreen from './screens/EventDayScreen'
import CeremoniesScreen from './screens/CeremoniesScreen'
import HomeScreen from './screens/HomeScreen'
import CrisisScreen from './screens/CrisisScreen'
import VendorScreen from './screens/VendorScreen'
import VendorDetailScreen from './screens/VendorDetailScreen'
import TasksScreen from './screens/TasksScreen'
import FamilyScreen from './screens/FamilyScreen'
import GuestsScreen from './screens/GuestsScreen'
import BudgetScreen from './screens/BudgetScreen'
import WeddingWebsiteScreen from './screens/WeddingWebsiteScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ProfileScreen from './screens/ProfileScreen'
import NotificationPrompt from './components/ui/NotificationPrompt'
import AgentBar from './components/AgentBar'
import { ceremonies, guests as initialGuests } from './data/mockData'
import { getProfileTasks, getProfileVendors, getProfileGuests, runProfileMigrations } from './utils/profileUtils'

// Patch stored profile data before anything reads it
runProfileMigrations()

function AnimatedRoutes({ tasks, setTasks, vendors, setVendors, guests, setGuests, onSignOut, onOpenAgent }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<HomeScreen tasks={tasks} setTasks={setTasks} vendors={vendors} guests={guests} onOpenAgent={onOpenAgent} />} />
        <Route path="/crisis"        element={<CrisisScreen />} />
        <Route path="/vendors"          element={<VendorScreen vendors={vendors} setVendors={setVendors} />} />
        <Route path="/vendors/:vendorId" element={<VendorDetailScreen vendors={vendors} setVendors={setVendors} />} />
        <Route path="/tasks"         element={<TasksScreen tasks={tasks} setTasks={setTasks} />} />
        <Route path="/ceremonies"    element={<CeremoniesScreen tasks={tasks} setTasks={setTasks} vendors={vendors} guests={guests} setGuests={setGuests} onOpenAgent={onOpenAgent} />} />
        <Route path="/family"        element={<FamilyScreen />} />
        <Route path="/guests"        element={<GuestsScreen guests={guests} setGuests={setGuests} onOpenAgent={onOpenAgent} />} />
        <Route path="/website"       element={<WeddingWebsiteScreen onOpenAgent={onOpenAgent} />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/profile"       element={<ProfileScreen onSignOut={onSignOut} />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell({ showNotifPrompt, onNotifAccept, onNotifDismiss, tasks, setTasks, vendors, setVendors, guests, setGuests, onSignOut, agentOpen, setAgentOpen, agentQuery, setAgentQuery, onOpenAgent }) {
  const navigate = useNavigate()
  useEffect(() => { navigate('/', { replace: true }) }, [])
  return (
    <div className="relative flex flex-col h-full">
      <AnimatedRoutes
        tasks={tasks} setTasks={setTasks}
        vendors={vendors} setVendors={setVendors}
        guests={guests} setGuests={setGuests}
        onSignOut={onSignOut}
        onOpenAgent={onOpenAgent}
      />
      <AgentBar
        tasks={tasks} setTasks={setTasks}
        vendors={vendors} setVendors={setVendors}
        guests={guests} setGuests={setGuests}
        forceOpen={agentOpen}
        onForceOpenHandled={() => setAgentOpen(false)}
        forceQuery={agentQuery}
        onForceQueryHandled={() => setAgentQuery(null)}
      />
      <AnimatePresence>
        {showNotifPrompt && (
          <NotificationPrompt
            onAccept={onNotifAccept}
            onDismiss={onNotifDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  // "Stay logged in" — skip splash+auth if flag is set
  const [stage, setStage] = useState(() =>
    localStorage.getItem('sm_stay_logged_in') === '1' ? 'app' : 'splash'
  )
  const [showNotifPrompt, setShowNotifPrompt] = useState(false)
  const [tasks,   setTasks]   = useState(() => getProfileTasks())
  const [vendors, setVendors] = useState(() => getProfileVendors())
  const [guests,  setGuests]  = useState(() => { const pg = getProfileGuests(); return pg.length > 0 ? pg : initialGuests })
  // Controls programmatic open of AgentBar (e.g. from "Customize with Mubarak")
  const [agentOpen, setAgentOpen] = useState(false)
  const [agentQuery, setAgentQuery] = useState(null) // proactive message to auto-send on open

  useEffect(() => {
    if (stage === 'app') {
      // Never show if user checked "Don't show again"
      const neverShow = localStorage.getItem('sm_notif_never') === '1'
      const notifAsked = sessionStorage.getItem('notif_asked') || localStorage.getItem('notif_enabled')
      if (!neverShow && !notifAsked) {
        // Delay 5 minutes (300 000 ms) before showing the notification prompt
        const t = setTimeout(() => setShowNotifPrompt(true), 300000)
        return () => clearTimeout(t)
      }
    }
  }, [stage])

  const handleNotifAccept = () => {
    sessionStorage.setItem('notif_asked', '1')
    localStorage.setItem('notif_enabled', '1')
    localStorage.removeItem('notif_dismissed')
    setShowNotifPrompt(false)
  }

  const handleNotifDismiss = (neverShow = false) => {
    sessionStorage.setItem('notif_asked', '1')
    localStorage.setItem('notif_dismissed', '1')
    if (neverShow) localStorage.setItem('sm_notif_never', '1')
    setShowNotifPrompt(false)
  }

  // Called after successful sign-in
  // skipEventDay: true when called from onboarding — never show event-day splash right after setup
  const handleSignIn = (rememberMe = false, skipEventDay = false) => {
    if (rememberMe) localStorage.setItem('sm_stay_logged_in', '1')
    // Re-seed from profile in case onboarding just completed
    setTasks(getProfileTasks())
    setVendors(getProfileVendors())
    const pg = getProfileGuests(); if (pg.length > 0) setGuests(pg)
    // Show event-day screen only on the actual event day (not right after onboarding)
    const hasLive = ceremonies.some(c => c.status === 'live')
    const dismissed = sessionStorage.getItem('event_day_dismissed')
    if (!skipEventDay && hasLive && !dismissed) {
      setStage('event_day')
    } else {
      setStage('app')
    }
  }

  const handleEventDayClose = () => {
    sessionStorage.setItem('event_day_dismissed', '1')
    setStage('app')
  }

  const handleSignOut = () => {
    localStorage.removeItem('sm_stay_logged_in')
    sessionStorage.removeItem('notif_asked')
    setStage('auth')
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1A1410',
    }}>
      <MobileFrame>
        <LayoutGroup id="screen-transition">
        <AnimatePresence mode="sync">
          {stage === 'splash' && (
            <SplashScreen key="splash" onComplete={() => setStage('auth')} />
          )}
          {stage === 'auth' && (
            <AuthScreen
              key="auth"
              onSignIn={handleSignIn}
              onCreateWedding={() => setStage('onboard')}
            />
          )}
          {stage === 'onboard' && (
            <OnboardingScreen
              key="onboard"
              onComplete={() => handleSignIn(false, true)}
              onOpenAgent={() => { handleSignIn(false, true); setAgentOpen(true) }}
            />
          )}
          {stage === 'event_day' && (
            <MemoryRouter key="event_day_router">
              <EventDayScreen key="event_day" onClose={handleEventDayClose} />
            </MemoryRouter>
          )}
          {stage === 'app' && (
            <MemoryRouter key="app" initialEntries={['/']}>
              <AppShell
                showNotifPrompt={showNotifPrompt}
                onNotifAccept={handleNotifAccept}
                onNotifDismiss={handleNotifDismiss}
                tasks={tasks}     setTasks={setTasks}
                vendors={vendors} setVendors={setVendors}
                guests={guests}   setGuests={setGuests}
                onSignOut={handleSignOut}
                agentOpen={agentOpen}
                setAgentOpen={setAgentOpen}
                agentQuery={agentQuery}
                setAgentQuery={setAgentQuery}
                onOpenAgent={(query) => { setAgentOpen(true); if (query) setAgentQuery(query) }}
              />
            </MemoryRouter>
          )}
        </AnimatePresence>
        </LayoutGroup>
      </MobileFrame>
    </div>
  )
}
