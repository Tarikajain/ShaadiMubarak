// ── Mubarak long-term memory ──────────────────────────────────────────────────
// Facts are stored in localStorage so the agent learns from every conversation.
// Each entry: { id, category, fact, createdAt }

const MEMORY_KEY         = 'sm_memory'
const MEMORY_ENABLED_KEY = 'sm_memory_enabled'
const MAX_MEMORIES       = 60

export const MEMORY_CATEGORIES = {
  preference: { label: 'Preference', color: '#7A0F46',              bg: 'rgba(122,15,70,0.08)' },
  decision:   { label: 'Decision',   color: '#2D6025',              bg: 'rgba(45,96,37,0.08)' },
  vendor:     { label: 'Vendor',     color: '#A07020',              bg: 'rgba(200,151,58,0.10)' },
  ceremony:   { label: 'Ceremony',   color: '#1A5C8C',              bg: 'rgba(26,92,140,0.08)' },
  family:     { label: 'Family',     color: '#5C3D8C',              bg: 'rgba(92,61,140,0.08)' },
  budget:     { label: 'Budget',     color: '#2D6025',              bg: 'rgba(45,96,37,0.08)' },
  general:    { label: 'General',    color: 'rgba(26,20,16,0.55)',  bg: 'rgba(0,0,0,0.05)' },
}

// ── Enabled/disabled ──────────────────────────────────────────────
export function isMemoryEnabled() {
  const val = localStorage.getItem(MEMORY_ENABLED_KEY)
  return val === null ? true : val === '1'   // on by default
}

export function setMemoryEnabled(enabled) {
  localStorage.setItem(MEMORY_ENABLED_KEY, enabled ? '1' : '0')
}

// ── CRUD ──────────────────────────────────────────────────────────
export function getMemories() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]') }
  catch { return [] }
}

/** Add a fact if memory is enabled and it doesn't already exist. */
export function addMemory(fact, category = 'general') {
  if (!isMemoryEnabled()) return
  const trimmed = (fact || '').trim()
  if (!trimmed) return
  const memories = getMemories()
  const norm = trimmed.toLowerCase()
  if (memories.some(m => m.fact.toLowerCase() === norm)) return
  memories.unshift({
    id:        Date.now().toString(),
    category:  MEMORY_CATEGORIES[category] ? category : 'general',
    fact:      trimmed,
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memories.slice(0, MAX_MEMORIES)))
}

export function deleteMemory(id) {
  const updated = getMemories().filter(m => m.id !== id)
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
}

export function clearMemories() {
  localStorage.setItem(MEMORY_KEY, '[]')
}

// ── Agent context injection ───────────────────────────────────────
/** Returns a formatted string to inject into the agent system prompt. */
export function getMemoryContext() {
  if (!isMemoryEnabled()) return ''
  const mems = getMemories()
  if (!mems.length) return ''
  return mems.map(m => `• [${m.category}] ${m.fact}`).join('\n')
}
