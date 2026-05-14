/**
 * Reads sm_profile from localStorage and derives initial app state
 * (tasks, vendors, wedding info) from it.
 */
import { initialTasks } from '../data/tasksData'
import { vendors as mockVendors } from '../data/mockData'

// Map LLM-generated category strings → app task category keys
const CATEGORY_MAP = {
  venue: 'venue', 'venue & decor': 'venue', decor: 'venue', decoration: 'venue',
  catering: 'catering', food: 'catering', 'food & catering': 'catering',
  photography: 'photography', film: 'photography', 'photography & film': 'photography', video: 'photography',
  music: 'music', dj: 'music', entertainment: 'music', 'music & entertainment': 'music',
  makeup: 'makeup', beauty: 'makeup', 'makeup & beauty': 'makeup',
  attire: 'attire', fashion: 'attire', jewellery: 'attire', 'attire & jewellery': 'attire', lehenga: 'attire', sherwani: 'attire',
  mehndi: 'mehndi', rituals: 'mehndi', 'mehndi & rituals': 'mehndi', haldi: 'mehndi',
  invitations: 'invitations', guests: 'invitations', gifts: 'invitations', 'invitations & gifts': 'invitations',
  legal: 'legal', documents: 'legal', 'legal & documents': 'legal',
  honeymoon: 'honeymoon', travel: 'honeymoon', 'honeymoon & travel': 'honeymoon',
  vendors: 'vendors', logistics: 'vendors', planning: 'vendors', finance: 'vendors', budget: 'vendors',
}

function mapCategory(raw) {
  if (!raw) return 'vendors'
  const key = raw.toLowerCase().trim()
  return CATEGORY_MAP[key] || 'vendors'
}

// Derive a sensible due date relative to the wedding date
function deriveDueDate(weddingDateStr, priority) {
  const base = weddingDateStr ? new Date(weddingDateStr) : new Date(Date.now() + 365 * 86400000)
  const offsetDays = priority === 'high' ? -90 : priority === 'medium' ? -60 : -30
  const d = new Date(base)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

// Canonical title overrides — fixes LLM-generated names to product-approved titles
const TITLE_OVERRIDES = [
  { match: /finalize venue decor/i,       replace: 'Finalize wedding decorator' },
  { match: /^venue decor(ation)?$/i,      replace: 'Finalize wedding decorator' },
  { match: /^book.*decorator$/i,          replace: 'Finalize wedding decorator' },
  { match: /^confirm.*decorator$/i,       replace: 'Finalize wedding decorator' },
]

function normaliseTaskTitle(title) {
  for (const { match, replace } of TITLE_OVERRIDES) {
    if (match.test(title)) return replace
  }
  return title
}

// Run once at app boot — patches stored profile so titles are correct on every read
export function runProfileMigrations() {
  try {
    const raw = localStorage.getItem('sm_profile')
    if (!raw) return
    const profile = JSON.parse(raw)
    if (!Array.isArray(profile.tasks)) return
    let changed = false
    profile.tasks = profile.tasks.map(t => {
      const fixed = normaliseTaskTitle(t.title || '')
      if (fixed !== t.title) { changed = true; return { ...t, title: fixed } }
      return t
    })
    if (changed) localStorage.setItem('sm_profile', JSON.stringify(profile))
  } catch { /* silent */ }
}

export function getProfileTasks() {
  try {
    const raw = localStorage.getItem('sm_profile')
    if (!raw) return initialTasks
    const profile = JSON.parse(raw)
    const llmTasks = profile.tasks
    if (!Array.isArray(llmTasks) || llmTasks.length === 0) return initialTasks

    return llmTasks.map((t, i) => ({
      id: `pt_${i + 1}`,
      title: normaliseTaskTitle(t.title || 'Wedding task'),
      category: mapCategory(t.category),
      priority: ['high', 'medium', 'low'].includes(t.priority) ? t.priority : 'medium',
      dueDate: deriveDueDate(profile.date, t.priority),
      done: false,
      description: t.description || '',
      location: null,
      assignees: [],
    }))
  } catch {
    return initialTasks
  }
}

export function getProfileVendors() {
  try {
    const raw = localStorage.getItem('sm_profile')
    if (!raw) return mockVendors
    const profile = JSON.parse(raw)
    const llmVendors = profile.vendors
    if (!Array.isArray(llmVendors) || llmVendors.length === 0) return mockVendors

    return llmVendors.map((v, i) => ({
      id: i + 1,
      name: `${v.category} (TBD)`,
      category: v.category,
      ceremony: 'TBD',
      status: 'pending',
      lastContact: 'Not contacted',
      risk: 'medium',
      phone: '',
      image: `https://placehold.co/72x72/EDE0D4/7A0F46?text=${encodeURIComponent(
        v.category?.slice(0, 2).toUpperCase() || 'V'
      )}`,
    }))
  } catch {
    return mockVendors
  }
}

// Returns { bride, partner, date, location, theme, vibe } or null
export function getWeddingProfile() {
  try {
    const raw = localStorage.getItem('sm_profile')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Returns a minimal guest list seeded from profile (just the partner), or empty array
export function getProfileGuests() {
  try {
    const raw = localStorage.getItem('sm_profile')
    if (!raw) return []
    const profile = JSON.parse(raw)
    if (!profile.partner) return []
    return [{
      id: 9001,
      name: profile.partner,
      side: 'groom',
      rsvp: 'pending',
      contact: profile.partnerEmail || '',
      tier: 'core',
    }]
  } catch {
    return []
  }
}
