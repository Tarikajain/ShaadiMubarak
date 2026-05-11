import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MobileFrame from './components/layout/MobileFrame'
import SplashScreen from './screens/SplashScreen'
import AuthScreen from './screens/AuthScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import EventDayScreen from './screens/EventDayScreen'
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
import { initialTasks } from './data/tasksData'
import { ceremonies } from './data/mockData'

function AnimatedRoutes({ tasks, setTasks, onSignOut }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<HomeScreen tasks={tasks} setTasks={setTasks} />} />
        <Route path="/crisis"        element={<CrisisScreen />} />
        <Route path="/vendors"          element={<VendorScreen />} />
        <Route path="/vendors/:vendorId" element={<VendorDetailScreen />} />
        <Route path="/tasks"         element={<TasksScreen tasks={tasks} setTasks={setTasks} />} />
        <Route path="/family"        element={<FamilyScreen />} />
        <Route path="/guests"        element={<GuestsScreen />} />
        <Route path="/budget"        element={<BudgetScreen />} />
        <Route path="/website"       element={<WeddingWebsiteScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/profile"       element={<ProfileScreen onSignOut={onSignOut} />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell({ showNotifPrompt, onNotifAccept, onNotifDismiss, tasks, setTasks, onSignOut }) {
  const navigate = useNavigate()
  useEffect(() => { navigate('/', { replace: true }) }, [])
  return (
    <div className="relative flex flex-col h-full">
      <AnimatedRoutes tasks={tasks} setTasks={setTasks} onSignOut={onSignOut} />
      <AgentBar />
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
  const [tasks, setTasks] = useState(initialTasks)

  useEffect(() => {
    if (stage === 'app') {
      const notifAsked = sessionStorage.getItem('notif_asked') || localStorage.getItem('notif_enabled')
      if (!notifAsked) {
        const t = setTimeout(() => setShowNotifPrompt(true), 1200)
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

  const handleNotifDismiss = () => {
    sessionStorage.setItem('notif_asked', '1')
    localStorage.setItem('notif_dismissed', '1')
    setShowNotifPrompt(false)
  }

  // Called after successful sign-in
  const handleSignIn = (rememberMe = false) => {
    if (rememberMe) localStorage.setItem('sm_stay_logged_in', '1')
    // Show event-day screen if there's a live ceremony and we haven't dismissed it this session
    const hasLive = ceremonies.some(c => c.status === 'live')
    const dismissed = sessionStorage.getItem('event_day_dismissed')
    if (hasLive && !dismissed) {
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
        <AnimatePresence mode="wait">
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
            <OnboardingScreen key="onboard" onComplete={() => handleSignIn(false)} />
          )}
          {stage === 'event_day' && (
            <BrowserRouter key="event_day_router">
              <EventDayScreen key="event_day" onClose={handleEventDayClose} />
            </BrowserRouter>
          )}
          {stage === 'app' && (
            <BrowserRouter key="app">
              <AppShell
                showNotifPrompt={showNotifPrompt}
                onNotifAccept={handleNotifAccept}
                onNotifDismiss={handleNotifDismiss}
                tasks={tasks}
                setTasks={setTasks}
                onSignOut={handleSignOut}
              />
            </BrowserRouter>
          )}
        </AnimatePresence>
      </MobileFrame>
    </div>
  )
}
