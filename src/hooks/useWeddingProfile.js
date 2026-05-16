import { useState, useEffect } from 'react'
import { wedding } from '../data/mockData'
import { getWeddingProfile } from '../utils/profileUtils'

/**
 * Returns live wedding profile data that updates everywhere in the app
 * whenever Mubarak (or any other source) writes to sm_wedding_updated.
 * Falls back to mockData defaults when no profile is set.
 */
function buildProfile() {
  const stored = getWeddingProfile()
  return {
    bride:  stored?.name     || stored?.bride  || wedding.couple.bride,
    groom:  stored?.partner  || wedding.couple.groom,
    date:   stored?.date     || wedding.date,
    venue:  stored?.location || stored?.city   || wedding.venue,
    city:   stored?.city     || 'Udaipur',
    theme:  stored?.theme    || null,
    budget: stored?.budget   || null,
  }
}

export function useWeddingProfile() {
  const [profile, setProfile] = useState(buildProfile)

  useEffect(() => {
    const refresh = () => setProfile(buildProfile())
    window.addEventListener('sm_wedding_updated', refresh)
    return () => window.removeEventListener('sm_wedding_updated', refresh)
  }, [])

  return profile
}
