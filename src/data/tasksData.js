// ── Task category definitions with representative images ──────────────────────
export const taskCategories = {
  makeup: {
    label: 'Makeup & Beauty',
    color: '#7A0F46',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80&fit=crop',
  },
  attire: {
    label: 'Attire & Jewellery',
    color: '#5C0B35',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80&fit=crop&crop=focalpoint&fp-x=0.6&fp-y=0.3',
  },
  venue: {
    label: 'Venue & Decor',
    color: '#2D6025',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80&fit=crop',
  },
  photography: {
    label: 'Photography & Film',
    color: '#1A1410',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200&q=80&fit=crop',
  },
  catering: {
    label: 'Catering & Food',
    color: '#8B4513',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80&fit=crop',
  },
  music: {
    label: 'Music & Entertainment',
    color: '#1A3A6B',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80&fit=crop',
  },
  invitations: {
    label: 'Invitations & Gifts',
    color: '#5A3A1A',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=200&q=80&fit=crop&crop=focalpoint&fp-y=0.3',
  },
  mehndi: {
    label: 'Mehndi & Rituals',
    color: '#7A0F46',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=200&q=80&fit=crop',
  },
  vendors: {
    label: 'Vendors & Logistics',
    color: '#3A1A6B',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&q=80&fit=crop',
  },
  honeymoon: {
    label: 'Honeymoon & Travel',
    color: '#1A5A6B',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.6',
  },
  legal: {
    label: 'Legal & Documents',
    color: '#3A3A3A',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80&fit=crop&crop=focalpoint&fp-y=0.7',
  },
}

// ── Initial task list ─────────────────────────────────────────────────────────
export const initialTasks = [
  {
    id: 't1',
    title: 'Confirm Pandit Sureshji timing',
    category: 'venue',
    priority: 'high',
    dueDate: '2026-12-10',
    done: false,
    description: 'Confirm 8:30pm hard stop and Pheras window with Pandit Sureshji.',
    location: null,
    assignees: [],
  },
  {
    id: 't2',
    title: 'Book backup mehndi artist',
    category: 'mehndi',
    priority: 'high',
    dueDate: '2026-12-10',
    done: false,
    description: 'Rekha Mehndi Art unresponsive for 48h — find and confirm a backup.',
    location: null,
    assignees: [],
  },
  {
    id: 't3',
    title: 'Trial makeup session',
    category: 'makeup',
    priority: 'high',
    dueDate: '2026-12-11',
    done: false,
    description: 'Test bridal look — foundation shade, eye makeup, lip colour.',
    location: 'Glamour Studio, Bandra West, Mumbai',
    assignees: ['bride'],
  },
  {
    id: 't4',
    title: 'Final bridal lehenga fitting',
    category: 'attire',
    priority: 'high',
    dueDate: '2026-12-12',
    done: false,
    description: 'Third fitting with hem and blouse alterations.',
    location: 'Sabyasachi Flagship, Kala Ghoda, Mumbai',
    assignees: ['bride', 'bride_mom'],
  },
  {
    id: 't5',
    title: 'Share shot list with Rajan Photography',
    category: 'photography',
    priority: 'medium',
    dueDate: '2026-12-12',
    done: false,
    description: 'Key moments, must-have portraits, family group combinations.',
    location: null,
    assignees: [],
  },
  {
    id: 't6',
    title: 'Finalize Sangeet playlist',
    category: 'music',
    priority: 'medium',
    dueDate: '2026-12-13',
    done: false,
    description: 'Send confirmed tracklist to Rhythm DJ Services.',
    location: null,
    assignees: ['groom'],
  },
  {
    id: 't7',
    title: 'Final catering menu confirmation',
    category: 'catering',
    priority: 'medium',
    dueDate: '2026-12-13',
    done: false,
    description: 'Vegetarian count, nut allergy requirements, live station list.',
    location: 'Aromas Catering Office, Andheri East',
    assignees: ['groom_dad'],
  },
  {
    id: 't17',
    title: 'Finalize wedding decorator',
    category: 'venue',
    priority: 'high',
    dueDate: '2026-09-17',
    done: false,
    description: 'Shortlist and confirm the wedding decorator for all ceremonies. Review portfolio, decor style alignment, and get final quote before booking.',
    location: null,
    assignees: [],
  },
  {
    id: 't8',
    title: 'Confirm Baraat route with Taj Coromandel',
    category: 'venue',
    priority: 'medium',
    dueDate: '2026-12-14',
    done: false,
    description: 'Entry route, parking for Baraat vehicles, security clearance.',
    location: 'Taj Coromandel, Nungambakkam, Chennai',
    assignees: ['groom', 'bestman'],
  },
  {
    id: 't9',
    title: 'Collect heirloom jewellery from family',
    category: 'attire',
    priority: 'medium',
    dueDate: '2026-12-14',
    done: false,
    description: 'Gold sets from family safe for reception and Pheras.',
    location: "Bride's family home, Juhu",
    assignees: ['bride_mom'],
  },
  {
    id: 't10',
    title: 'Prepare welcome kits for outstation guests',
    category: 'invitations',
    priority: 'low',
    dueDate: '2026-12-15',
    done: false,
    description: 'Snacks, itinerary card, Chennai tips, emergency contacts.',
    location: null,
    assignees: ['moh'],
  },
  {
    id: 't11',
    title: 'Book honeymoon airport transfers',
    category: 'honeymoon',
    priority: 'low',
    dueDate: '2026-12-18',
    done: false,
    description: 'Pickup from Chennai airport to Maldives resort after Dec 18.',
    location: null,
    assignees: ['groom'],
  },
  // ── Completed tasks (history) ─────────────────────────────────────────────
  {
    id: 't12',
    title: 'Book Aromas Catering',
    category: 'catering',
    priority: 'high',
    dueDate: '2026-11-15',
    done: true,
    description: 'Full wedding catering package confirmed and deposit paid.',
  },
  {
    id: 't13',
    title: 'Send wedding invitations',
    category: 'invitations',
    priority: 'high',
    dueDate: '2026-11-01',
    done: true,
    description: '317 invitations sent by post and WhatsApp.',
  },
  {
    id: 't14',
    title: 'Book Rajan Photography',
    category: 'photography',
    priority: 'high',
    dueDate: '2026-10-20',
    done: true,
    description: 'Full coverage photography + videography. Contract signed.',
  },
  {
    id: 't15',
    title: 'Book Rhythm DJ Services',
    category: 'music',
    priority: 'high',
    dueDate: '2026-10-25',
    done: true,
    description: 'DJ confirmed for Sangeet. Equipment list received.',
  },
  {
    id: 't16',
    title: 'Venue walkthrough — Taj Coromandel',
    category: 'venue',
    priority: 'high',
    dueDate: '2026-11-10',
    done: true,
    description: 'Layout confirmed for all ceremonies across 3 halls.',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getTopTasks(tasks, n = 5) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return tasks
    .filter(t => !t.done)
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority])
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
    .slice(0, n)
}

export function formatDue(dateStr) {
  // Parse as local date to avoid UTC-midnight timezone shift
  const [y, mo, day] = dateStr.split('-').map(Number)
  const d = new Date(y, mo - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = Math.round((d - today) / 86400000)
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff <= 7) return `Due in ${diff}d`
  return `Due ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
}
