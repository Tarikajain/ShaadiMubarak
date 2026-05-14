// ── Family member registry ────────────────────────────────────────────────────
export const FAMILY_MEMBERS = [
  { id: 'bride',     name: 'Ananya', role: 'Bride',          initials: 'An', color: '#7A0F46', bg: 'rgba(122,15,70,0.10)' },
  { id: 'groom',     name: 'Rahul',  role: 'Groom',          initials: 'Ra', color: '#1A3A6B', bg: 'rgba(26,58,107,0.10)'  },
  { id: 'bride_mom', name: 'Priya',  role: "Bride's Mom",    initials: 'Pr', color: '#2D6025', bg: 'rgba(45,96,37,0.10)'   },
  { id: 'bride_dad', name: 'Suresh', role: "Bride's Dad",    initials: 'Su', color: '#8B4513', bg: 'rgba(139,69,19,0.10)'  },
  { id: 'groom_mom', name: 'Meena',  role: "Groom's Mom",    initials: 'Me', color: '#2D6025', bg: 'rgba(45,96,37,0.10)'   },
  { id: 'groom_dad', name: 'Vikram', role: "Groom's Dad",    initials: 'Vi', color: '#8B4513', bg: 'rgba(139,69,19,0.10)'  },
  { id: 'moh',       name: 'Divya',  role: 'Maid of Honour', initials: 'Di', color: '#7A0F46', bg: 'rgba(122,15,70,0.10)'  },
  { id: 'bestman',   name: 'Arjun',  role: 'Best Man',       initials: 'Ar', color: '#1A3A6B', bg: 'rgba(26,58,107,0.10)'  },
]

// ── Active user ───────────────────────────────────────────────────────────────
export function getActiveUser() {
  try {
    const raw = localStorage.getItem('sm_active_user')
    return raw ? JSON.parse(raw) : FAMILY_MEMBERS[0]
  } catch { return FAMILY_MEMBERS[0] }
}

export function setActiveUser(member) {
  localStorage.setItem('sm_active_user', JSON.stringify(member))
  // Dispatch event so any listening component can re-render
  window.dispatchEvent(new Event('sm_user_change'))
}

// ── Vendor reactions ──────────────────────────────────────────────────────────
// Shape: { [vendorId]: { [personId]: 'like' | 'dislike' } }

export function getVendorReactions() {
  try {
    const raw = localStorage.getItem('sm_vendor_reactions')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function setVendorReaction(vendorId, personId, reaction) {
  const all = getVendorReactions()
  if (!all[vendorId]) all[vendorId] = {}
  if (reaction === null) {
    delete all[vendorId][personId]
  } else {
    all[vendorId][personId] = reaction
  }
  localStorage.setItem('sm_vendor_reactions', JSON.stringify(all))
  return { ...all }
}

// ── Reaction summary sentence ─────────────────────────────────────────────────
export function getReactionSummary(reactions) {
  const entries = Object.entries(reactions)
  if (entries.length === 0) return null
  const likes    = entries.filter(([, r]) => r === 'like').map(([id]) => FAMILY_MEMBERS.find(m => m.id === id)?.name).filter(Boolean)
  const dislikes = entries.filter(([, r]) => r === 'dislike').map(([id]) => FAMILY_MEMBERS.find(m => m.id === id)?.name).filter(Boolean)
  if (likes.length > 0 && dislikes.length === 0)
    return `${likes.slice(0, 2).join(' & ')}${likes.length > 2 ? ` +${likes.length - 2} more` : ''} ${likes.length === 1 ? 'loves' : 'love'} this vendor.`
  if (dislikes.length > 0 && likes.length === 0)
    return `${dislikes.slice(0, 2).join(' & ')} ${dislikes.length === 1 ? 'has concerns' : 'have concerns'} about this vendor.`
  return `${likes.length} ${likes.length === 1 ? 'family member' : 'family members'} like this · ${dislikes.length} have concerns.`
}
