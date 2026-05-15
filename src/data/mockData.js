export const wedding = {
  couple: { bride: 'Ananya', groom: 'Rahul' },
  date: 'December 17, 2026',
  venue: 'Taj Coromandel, Chennai',
  daysAway: 4,
  type: 'South Indian + North Indian fusion',
  guestCount: 500,
}

// Current logged-in user — role: 'bride' | 'groom' | 'family'
export const currentUser = {
  name: 'Ananya',
  role: 'bride',
}

export const ceremonies = [
  { id: 1, name: 'Haldi Ceremony',    time: '10:00 AM', status: 'upcoming', vendors: ['florist', 'photographer'] },
  { id: 2, name: 'Mehndi',            time: '12:30 PM', status: 'upcoming', vendors: ['mehndi_artist', 'photographer'] },
  { id: 3, name: 'Sangeet',           time: '7:00 PM',  status: 'upcoming', vendors: ['dj', 'caterer', 'decorator'] },
  { id: 4, name: 'Baraat Procession', time: '4:00 PM',  status: 'upcoming', vendors: ['band', 'decorator'] },
  { id: 5, name: 'Pheras & Vows',     time: '7:00 PM',  status: 'upcoming', vendors: ['pandit', 'photographer', 'caterer'] },
  { id: 6, name: 'Reception',         time: '9:00 PM',  status: 'upcoming', vendors: ['dj', 'caterer', 'photographer', 'decorator'] },
]

export const vendors = [
  { id: 1, name: 'Rajan Photography',  category: 'Photographer', ceremony: 'All events',         status: 'confirmed', lastContact: '2h ago',  risk: 'low',    phone: '+91 98400 12345', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=144&q=80' },
  { id: 4, name: 'Pandit Sureshji',    category: 'Pandit',       ceremony: 'Pheras · 7–8:30pm', status: 'pending',   lastContact: '3d ago',  risk: 'medium', phone: '+91 94400 77890', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=144&q=80' },
]

export const crisis = {
  id: 'crisis_001',
  detectedAt: '2 minutes ago',
  title: 'Mehndi artist unresponsive — baraat timeline at risk',
  summary: "Rekha Mehndi Art hasn't confirmed in 48h. If she's a no-show, the baraat at 4:00pm shifts — and Pandit Sureshji has a hard stop at 8:30pm. Pheras are at risk.",
  cascade: [
    { label: 'Mehndi artist · 48h silence',  status: 'root' },
    { label: 'Baraat shifts +40 min',         status: 'impact' },
    { label: 'Pandit hard stop 8:30pm',       status: 'constraint' },
    { label: 'Pheras window: 45 min',         status: 'critical' },
  ],
  timeUntil: '3h 20min before baraat',
  options: [
    {
      id: 'a',
      recommended: true,
      label: 'Send urgent message + contact 2 backups simultaneously',
      detail: 'Shaadi Mubarak drafts an urgent WhatsApp to Rekha + reaches out to Priya Mehndi and Sunita Arts from your area',
      timeImpact: 'Resolves in ~2 hours if backup responds',
    },
    {
      id: 'b',
      recommended: false,
      label: 'Compress baraat by 20 min, recalculate schedule',
      detail: 'Adjust baraat to 4:20pm start, notify band and decorator. Gives pheras full window.',
      timeImpact: 'Immediate — no vendor dependency',
    },
    {
      id: 'c',
      recommended: false,
      label: "I'll handle this manually",
      detail: 'Dismiss this alert. Shaadi Mubarak will remind you again in 30 minutes.',
      timeImpact: null,
    },
  ],
}

export const journeyPhases = [
  { id: 1, name: 'Getting Started',        status: 'done',    tasks: 8,  completed: 8,  daysFromNow: -120 },
  { id: 2, name: 'Venue & Core Vendors',   status: 'done',    tasks: 14, completed: 14, daysFromNow: -90 },
  { id: 3, name: 'Final Vendor Lock-In',   status: 'active',  tasks: 18, completed: 11, daysFromNow: 0,   aiNudge: 'Sangeet decorator not confirmed — 3 weeks behind typical timeline' },
  { id: 4, name: 'Final Countdown',        status: 'upcoming', tasks: 22, completed: 0, daysFromNow: 14 },
  { id: 5, name: 'Wedding Week',           status: 'upcoming', tasks: 30, completed: 0, daysFromNow: 117 },
  { id: 6, name: 'After the Wedding',      status: 'upcoming', tasks: 12, completed: 0, daysFromNow: 121 },
]

export const familyStats = {
  vendorsConfirmed: 12,
  vendorsTotal: 14,
  currentCeremony: 'Mehndi',
  currentCeremonyStatus: 'In progress',
  guestsAttending: 500,
  overallStatus: 'on_track',
  message: 'Everything is on track',
}

// ── Guest list generator (500 guests) ────────────────────────────────────────
const _FM = ['Priya','Deepa','Sunita','Kavya','Pooja','Anita','Lakshmi','Meena','Divya','Neha','Swati','Asha','Ritu','Sona','Nidhi','Seema','Rekha','Usha','Geeta','Shobha','Radha','Saroj','Poonam','Preeti','Mona','Jyoti','Varsha','Mamta','Rani','Smita','Lata','Vineeta','Nisha','Pallavi','Manju','Hemlata','Bharti','Geetanjali','Anjali','Aarti']
const _MM = ['Rajesh','Vikram','Arjun','Rohit','Aditya','Sanjay','Kiran','Rahul','Suresh','Naresh','Amit','Manoj','Ravi','Mohan','Vivek','Sandeep','Pankaj','Dinesh','Girish','Harish','Nilesh','Ramesh','Pradeep','Ashok','Vinod','Mukesh','Deepak','Naveen','Rajan','Tarun','Varun','Ankur','Arun','Nikhil','Sachin','Siddharth','Gaurav','Hardik','Jay','Kush']
const _SN = ['Sharma','Mehta','Patel','Iyer','Reddy','Joshi','Nair','Kumar','Singh','Kapoor','Rao','Pillai','Desai','Malhotra','Krishnan','Agarwal','Gupta','Verma','Tiwari','Pandey','Mishra','Chaudhary','Srivastava','Shah','Chopra','Bose','Das','Sengupta','Mukherjee','Banerjee','Iyengar','Naidu','Choudhury','Menon','Varma','Shukla','Tripathi','Bhatt','Doshi','Lal']

function _phone(seed) {
  const pfx = ['98','99','97','96','95','93','91','90','88','87','86','85','84','76','75','74','73','70']
  const p = pfx[seed % pfx.length]
  const a = String((seed * 73 + 1000) % 1000).padStart(3,'0')
  const b = String((seed * 137 + 10000) % 100000).padStart(5,'0')
  return `+91 ${p}${a} ${b}`
}
function _email(name, seed) {
  const domains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com']
  return `${name.toLowerCase().replace(' ','.').replace(' ','')}.${seed % 99}@${domains[seed % domains.length]}`
}

function _makeGuest(id, tier) {
  const isFemale = id % 2 === 0
  const fn = isFemale ? _FM[id % _FM.length] : _MM[id % _MM.length]
  const sn = _SN[(id * 3 + (isFemale ? 7 : 13)) % _SN.length]
  const name = `${fn} ${sn}`
  const side = (id % 3 === 0) ? 'groom' : 'bride'
  // Contact: ~55% phone, ~25% email, ~20% none
  const ct = id % 20
  const contact = ct < 11 ? _phone(id) : ct < 16 ? _email(name, id) : ''
  // RSVP: core guests skew confirmed, everyone has more pending
  const rv = id % 10
  const rsvp = tier === 'core'
    ? (rv < 7 ? 'confirmed' : rv < 9 ? 'pending' : 'declined')
    : (rv < 5 ? 'confirmed' : rv < 8 ? 'pending' : 'declined')
  return { id, name, contact, side, rsvp, tier }
}

// Core: 68 hand-picked guests (close family + best friends)
const _coreData = [
  // Bride's immediate family
  { id:1,  name:'Priya Sharma',      contact:'+91 98765 43210', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:2,  name:'Neha Sharma',       contact:'+91 97654 32109', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:3,  name:'Arjun Sharma',      contact:'+91 96543 21098', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:4,  name:'Sunita Sharma',     contact:'+91 95432 10987', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:5,  name:'Deepak Sharma',     contact:'+91 94321 09876', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:6,  name:'Kavita Agarwal',    contact:'+91 93210 98765', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:7,  name:'Sanjay Agarwal',    contact:'+91 92109 87654', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:8,  name:'Nidhi Agarwal',     contact:'nidhi.ag@gmail.com', side:'bride', rsvp:'pending', tier:'core' },
  { id:9,  name:'Rohan Agarwal',     contact:'+91 91098 76543', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:10, name:'Meera Iyer',        contact:'+91 90987 65432', side:'bride', rsvp:'confirmed', tier:'core' },
  // Groom's immediate family
  { id:11, name:'Vikram Mehta',      contact:'+91 89876 54321', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:12, name:'Pooja Mehta',       contact:'+91 88765 43210', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:13, name:'Rahul Mehta Sr',    contact:'+91 87654 32109', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:14, name:'Anita Mehta',       contact:'anita.mehta@gmail.com', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:15, name:'Karan Mehta',       contact:'+91 86543 21098', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:16, name:'Shreya Mehta',      contact:'+91 85432 10987', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:17, name:'Suresh Kapoor',     contact:'+91 84321 09876', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:18, name:'Reena Kapoor',      contact:'+91 83210 98765', side:'groom', rsvp:'pending',   tier:'core' },
  { id:19, name:'Akash Kapoor',      contact:'+91 82109 87654', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:20, name:'Divya Kapoor',      contact:'divya.kapoor@yahoo.com', side:'groom', rsvp:'confirmed', tier:'core' },
  // Bride's best friends
  { id:21, name:'Ankita Reddy',      contact:'+91 98123 45678', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:22, name:'Riya Pillai',       contact:'+91 97234 56789', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:23, name:'Tanya Nair',        contact:'+91 96345 67890', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:24, name:'Simran Malhotra',   contact:'simran.m@gmail.com', side:'bride', rsvp:'pending',   tier:'core' },
  { id:25, name:'Aisha Khan',        contact:'+91 95456 78901', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:26, name:'Puja Desai',        contact:'+91 94567 89012', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:27, name:'Natasha Verma',     contact:'+91 93678 90123', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:28, name:'Aditi Krishnan',    contact:'', side:'bride', rsvp:'pending', tier:'core' },
  { id:29, name:'Sneha Rao',         contact:'+91 92789 01234', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:30, name:'Pallavi Joshi',     contact:'+91 91890 12345', side:'bride', rsvp:'confirmed', tier:'core' },
  // Groom's best friends
  { id:31, name:'Aryan Singhania',   contact:'+91 98012 34567', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:32, name:'Dev Gupta',         contact:'+91 97901 23456', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:33, name:'Nikhil Sharma',     contact:'nikhil.s@gmail.com', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:34, name:'Rohan Patel',       contact:'+91 96790 12345', side:'groom', rsvp:'pending',   tier:'core' },
  { id:35, name:'Kabir Ahuja',       contact:'+91 95679 01234', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:36, name:'Samir Bose',        contact:'+91 94568 90123', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:37, name:'Kunal Das',         contact:'+91 93457 89012', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:38, name:'Mihir Shah',        contact:'mihir.shah@outlook.com', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:39, name:'Rishi Chopra',      contact:'+91 92346 78901', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:40, name:'Aakash Tiwari',     contact:'+91 91235 67890', side:'groom', rsvp:'pending',   tier:'core' },
  // Close aunts, uncles, cousins
  { id:41, name:'Sunita Rao',        contact:'+91 99012 34567', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:42, name:'Mohan Rao',         contact:'+91 98901 23456', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:43, name:'Lakshmi Iyer',      contact:'+91 97890 12345', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:44, name:'Venkat Iyer',       contact:'+91 96789 01234', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:45, name:'Preethi Nair',      contact:'preethi.n@gmail.com', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:46, name:'Ashok Pillai',      contact:'+91 94567 12345', side:'bride', rsvp:'pending',   tier:'core' },
  { id:47, name:'Meena Pillai',      contact:'+91 93456 01234', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:48, name:'Harish Krishnan',   contact:'+91 92345 90123', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:49, name:'Geetha Krishnan',   contact:'', side:'bride', rsvp:'pending', tier:'core' },
  { id:50, name:'Ramesh Sharma',     contact:'+91 91234 89012', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:51, name:'Rajiv Mehta',       contact:'+91 99123 45678', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:52, name:'Seema Mehta',       contact:'+91 98012 56789', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:53, name:'Anil Kapoor',       contact:'+91 97901 67890', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:54, name:'Suneetha Kapoor',   contact:'suneetha.k@yahoo.com', side:'groom', rsvp:'pending',   tier:'core' },
  { id:55, name:'Deepa Varma',       contact:'+91 95679 89012', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:56, name:'Krishnaswamy V',    contact:'+91 94568 78901', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:57, name:'Padmini Naidu',     contact:'+91 93457 67890', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:58, name:'Venkatraman S',     contact:'+91 92346 56789', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:59, name:'Kaveri Menon',      contact:'', side:'groom', rsvp:'pending', tier:'core' },
  { id:60, name:'Srinivasan M',      contact:'+91 99234 56789', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:61, name:'Radha Sharma',      contact:'+91 98345 67890', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:62, name:'Gopal Sharma',      contact:'+91 97456 78901', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:63, name:'Kamla Joshi',       contact:'+91 96567 89012', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:64, name:'Prakash Joshi',     contact:'prakash.j@gmail.com', side:'bride', rsvp:'declined',  tier:'core' },
  { id:65, name:'Sonal Agarwal',     contact:'+91 94789 01234', side:'bride', rsvp:'confirmed', tier:'core' },
  { id:66, name:'Vishal Gupta',      contact:'+91 93890 12345', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:67, name:'Nisha Gupta',       contact:'+91 92901 23456', side:'groom', rsvp:'confirmed', tier:'core' },
  { id:68, name:'Tanvi Malhotra',    contact:'+91 91012 34567', side:'bride', rsvp:'confirmed', tier:'core' },
]

// Generate remaining 432 guests for "everyone" tier
const _everyone = Array.from({ length: 432 }, (_, i) => _makeGuest(1000 + i, 'everyone'))

export const guests = [..._coreData, ..._everyone]

export const budget = {
  total: 5000000,
  currency: '₹',
  spent: 3180000,
  categories: [
    { id: 1, name: 'Venue & Decor',        budgeted: 2000000, spent: 1850000, dueAmount: 150000,  dueDate: 'Nov 30' },
    { id: 2, name: 'Catering',             budgeted: 1200000, spent: 600000,  dueAmount: 600000,  dueDate: 'Dec 10' },
    { id: 3, name: 'Photography & Video',  budgeted: 350000,  spent: 175000,  dueAmount: 175000,  dueDate: 'Dec 15' },
    { id: 4, name: 'Music & Entertainment',budgeted: 250000,  spent: 125000,  dueAmount: 125000,  dueDate: 'Dec 12' },
    { id: 5, name: 'Florals',              budgeted: 180000,  spent: 180000,  dueAmount: 0,       dueDate: null },
    { id: 6, name: 'Pandit & Rituals',     budgeted: 80000,   spent: 50000,   dueAmount: 30000,   dueDate: 'Dec 17' },
    { id: 7, name: 'Outfits & Styling',    budgeted: 320000,  spent: 200000,  dueAmount: 120000,  dueDate: 'Dec 1' },
    { id: 8, name: 'Miscellaneous',        budgeted: 120000,  spent: 0,       dueAmount: 120000,  dueDate: null },
  ],
}

export const weddingWebsite = {
  published: true,
  slug: 'ananya-rahul-2026',
  url: 'vowstudio.co/ananya-rahul-2026',
  views: 284,
  rsvpResponses: 127,
  lastUpdated: '2 days ago',
  sections: [
    { id: 'hero',     label: 'Hero & Couple Names', enabled: true },
    { id: 'story',    label: 'Our Story',            enabled: true },
    { id: 'schedule', label: 'Event Schedule',       enabled: true },
    { id: 'travel',   label: 'Travel & Stay',         enabled: true },
    { id: 'rsvp',     label: 'RSVP Form',            enabled: true },
    { id: 'gallery',  label: 'Photo Gallery',         enabled: false },
    { id: 'registry', label: 'Gift Registry',         enabled: false },
  ],
  theme: 'ivory',
}

export const moodboardItems = [
  { id: 1,  category: 'Florals',   label: 'Marigold & rose archway',      gradient: 'linear-gradient(145deg, #F5C842 0%, #E8733A 100%)', aiSuggested: true },
  { id: 2,  category: 'Florals',   label: 'Jasmine garland strings',       gradient: 'linear-gradient(145deg, #FEFCE8 0%, #D4B870 100%)', aiSuggested: false },
  { id: 3,  category: 'Florals',   label: 'Lotus floating bowls',          gradient: 'linear-gradient(145deg, #FADADD 0%, #E87090 100%)', aiSuggested: false },
  { id: 4,  category: 'Venue',     label: 'Palace courtyard at dusk',      gradient: 'linear-gradient(145deg, #2C1A0E 0%, #6B3A20 100%)', aiSuggested: true },
  { id: 5,  category: 'Venue',     label: 'Pillared mandap in ivory',      gradient: 'linear-gradient(145deg, #F2EDE0 0%, #C4A870 100%)', aiSuggested: false },
  { id: 6,  category: 'Venue',     label: 'Rooftop with city skyline',     gradient: 'linear-gradient(145deg, #7BA7BC 0%, #2A4A6B 100%)', aiSuggested: false },
  { id: 7,  category: 'Outfits',   label: 'Red Kanjeevaram silk',          gradient: 'linear-gradient(145deg, #C41830 0%, #7A0A18 100%)', aiSuggested: false },
  { id: 8,  category: 'Outfits',   label: 'Ivory sherwani + pashmina',     gradient: 'linear-gradient(145deg, #F5F0E8 0%, #C4B090 100%)', aiSuggested: true },
  { id: 9,  category: 'Outfits',   label: 'Deep teal lehenga',             gradient: 'linear-gradient(145deg, #1A6060 0%, #0A3A3A 100%)', aiSuggested: false },
  { id: 10, category: 'Decor',     label: 'Gold diya centrepieces',        gradient: 'linear-gradient(145deg, #C8973A 0%, #7A5010 100%)', aiSuggested: false },
  { id: 11, category: 'Decor',     label: 'Geometric brass lanterns',      gradient: 'linear-gradient(145deg, #B08040 0%, #5A3010 100%)', aiSuggested: true },
  { id: 12, category: 'Decor',     label: 'Draped silk canopy',            gradient: 'linear-gradient(145deg, #E8D0B0 0%, #C8A060 100%)', aiSuggested: false },
  { id: 13, category: 'Lighting',  label: 'Warm Edison bulb canopy',       gradient: 'linear-gradient(145deg, #F5C060 0%, #C07010 100%)', aiSuggested: false },
  { id: 14, category: 'Lighting',  label: 'Blue & gold fairy lights',      gradient: 'linear-gradient(145deg, #4A6AB0 0%, #C8973A 100%)', aiSuggested: true },
  { id: 15, category: 'Lighting',  label: 'Candlelit aisle with diyas',    gradient: 'linear-gradient(145deg, #F0A040 0%, #A05010 100%)', aiSuggested: false },
]

export const vendorDirectory = [
  { id: 'd1', name: 'Kapoor & Co Photography', category: 'Photographer',  location: 'Chennai', rating: 4.9, reviews: 142, priceRange: '₹2–4L', tag: 'Top rated' },
  { id: 'd2', name: 'Sunflower Films',          category: 'Videographer',  location: 'Chennai', rating: 4.7, reviews: 89,  priceRange: '₹1.5–3L', tag: null },
  { id: 'd3', name: 'Spice Route Catering',     category: 'Caterer',       location: 'Chennai', rating: 4.8, reviews: 210, priceRange: '₹800–1200/plate', tag: 'Popular' },
  { id: 'd4', name: 'Petal & Bloom Studio',     category: 'Florist',       location: 'Chennai', rating: 4.6, reviews: 74,  priceRange: '₹80K–2L', tag: null },
  { id: 'd5', name: 'Vibrant Beats DJ',         category: 'DJ',            location: 'Chennai', rating: 4.5, reviews: 58,  priceRange: '₹50–90K', tag: null },
  { id: 'd6', name: 'Pandit Ramachandran',      category: 'Pandit',        location: 'Chennai', rating: 5.0, reviews: 31,  priceRange: '₹15–30K', tag: 'Highly rated' },
  { id: 'd7', name: 'Golden Thread Decorators', category: 'Decorator',     location: 'Chennai', rating: 4.8, reviews: 126, priceRange: '₹3–8L', tag: 'Popular' },
  { id: 'd8', name: 'Artistry Mehndi',          category: 'Mehndi Artist', location: 'Chennai', rating: 4.9, reviews: 97,  priceRange: '₹8–20K', tag: 'Top rated' },
  // ── AI-suggested decorators ──────────────────────────────────────────────────
  { id: 'sd1', name: 'The Decor Studio',    category: 'Decorator', location: 'Mumbai',  rating: 4.9, reviews: 412, priceRange: '₹5–12L',  tag: 'Top rated' },
  { id: 'sd2', name: 'Blooms & Beyond',     category: 'Decorator', location: 'Delhi',   rating: 4.7, reviews: 203, priceRange: '₹1.5–4L', tag: null },
  { id: 'sd3', name: 'Kalank Events',       category: 'Decorator', location: 'Jaipur',  rating: 4.8, reviews: 318, priceRange: '₹3–7L',   tag: 'Popular' },
  { id: 'sd4', name: 'Minimal Shaadi Co.', category: 'Decorator', location: 'Bengaluru', rating: 4.6, reviews: 147, priceRange: '₹80K–2L', tag: null },
  { id: 'sd5', name: 'Regal Weddings',      category: 'Decorator', location: 'Udaipur', rating: 5.0, reviews: 89,  priceRange: '₹10–25L', tag: 'Top rated' },
  // ── Makeup / Beauty ──────────────────────────────────────────────────────────
  { id: 'mu1', name: 'Glam by Priya',        category: 'Makeup Artist', location: 'Chennai',   rating: 4.9, reviews: 167, priceRange: '₹25–50K',  tag: 'Top rated',     aiSuggested: true },
  { id: 'mu2', name: 'Bridal Bliss Studio',  category: 'Makeup Artist', location: 'Chennai',   rating: 4.8, reviews: 112, priceRange: '₹20–40K',  tag: 'Popular',       aiSuggested: false },
  { id: 'mu3', name: 'The Bridal Atelier',   category: 'Makeup Artist', location: 'Bengaluru', rating: 4.7, reviews: 88,  priceRange: '₹30–60K',  tag: null,            aiSuggested: true },
  // ── Choreographer ────────────────────────────────────────────────────────────
  { id: 'ch1', name: 'Nrityanjali Dance Co.', category: 'Choreographer', location: 'Chennai', rating: 4.8, reviews: 54, priceRange: '₹40–80K', tag: 'Popular',  aiSuggested: true },
  { id: 'ch2', name: 'Step & Celebrate',      category: 'Choreographer', location: 'Chennai', rating: 4.6, reviews: 39, priceRange: '₹25–50K', tag: null,        aiSuggested: false },
  // ── Invitation / Stationery ──────────────────────────────────────────────────
  { id: 'in1', name: 'Paper & Petals Studio', category: 'Invitation Designer', location: 'Chennai',  rating: 4.9, reviews: 201, priceRange: '₹15–40K', tag: 'Top rated', aiSuggested: true },
  { id: 'in2', name: 'Shagun Prints',          category: 'Invitation Designer', location: 'Delhi',    rating: 4.7, reviews: 134, priceRange: '₹8–25K',  tag: 'Popular',   aiSuggested: false },
  { id: 'in3', name: 'Ivory & Gold Designs',   category: 'Invitation Designer', location: 'Chennai',  rating: 4.8, reviews: 78,  priceRange: '₹20–50K', tag: null,        aiSuggested: true },
]

// ── Rich vendor details (packages, contact, bio, reviews) ────────────────────
export const vendorDetails = {
  // ── Booked vendors ──────────────────────────────────────────────────────────
  1: {
    bio: 'Rajan Photography has captured over 300 South Indian weddings across Chennai and Hyderabad. Known for intimate candid moments and cinematic portrait sessions that tell the full story of a day.',
    contact: { phone: '+91 98400 12345', email: 'rajan@rajanphotography.in', website: 'rajanphotography.in' },
    galleryColors: ['#C4956A', '#8B6A4F', '#D4A882', '#7A5C3A', '#E8D0B0'],
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&q=80',
    ],
    bookedPackage: 'Gold',
    totalAmount: 280000,
    amountPaid: 140000,
    packages: [
      { name: 'Silver', label: '₹1,80,000', features: ['8-hour coverage', '500 edited photos', '1 photographer', 'Online gallery', 'Print-ready files'] },
      { name: 'Gold',   label: '₹2,80,000', selected: true, features: ['12-hour coverage', '1,000+ edited photos', '2 photographers', 'Online gallery', 'Pre-wedding shoot', 'Same-day highlights reel'] },
      { name: 'Platinum', label: '₹4,20,000', features: ['Full day + events', '2,000 edited photos', '3 photographers + assistant', 'Online gallery', 'Pre-wedding shoot', 'Cinematic film (10 min)', 'Premium photo album (40 pages)'] },
    ],
    reviews: [
      { name: 'Priya & Aditya', rating: 5, text: 'Rajan captured every emotion perfectly. The candids are priceless — we still tear up looking at the pheras photos.' },
      { name: 'Meena Krishnan', rating: 5, text: 'Absolutely professional. Arrived early, blended in seamlessly, and delivered in under 2 weeks. Highly recommend the Gold package.' },
    ],
  },
  2: {
    bio: 'Rekha specialises in bridal mehndi with over 8 years of experience. Her intricate Arabic-Indian fusion designs are a showpiece at Chennai weddings.',
    contact: { phone: '+91 96770 55320', email: 'rekha.mehndi@gmail.com', website: null },
    galleryColors: ['#5C8C72', '#3D6B54', '#8CB59A', '#2A4D3C', '#A8D4B8'],
    bookedPackage: 'Premium',
    totalAmount: 22000,
    amountPaid: 11000,
    packages: [
      { name: 'Basic',    label: '₹8,000',  features: ['Bride only', '2 design options', 'Both hands full', '~2 hours'] },
      { name: 'Standard', label: '₹15,000', features: ['Bride full arms', '4 bridesmaids (hands)', 'Design consultation', '~4 hours'] },
      { name: 'Premium',  label: '₹22,000', selected: true, features: ['Bride full arms + feet', '8 guests (hands)', 'Custom design concept', 'Touch-up kit', '~6 hours'] },
    ],
    reviews: [
      { name: 'Anjali Sharma', rating: 5, text: "Rekha's designs are stunning. My bridal mehndi was everything I dreamed of — the hidden groom name took him 3 days to find!" },
      { name: 'Neha Kapoor', rating: 4, text: 'Beautiful work and great designs. Arrived 20 minutes late but made up for it with extra detailing on the fingers.' },
    ],
  },
  3: {
    bio: 'Aromas Catering brings 25 years of South and North Indian wedding cuisine expertise. We handle everything from intimate 50-person ceremonies to 1,000+ guest receptions.',
    contact: { phone: '+91 99401 78220', email: 'bookings@aromascatering.in', website: 'aromascatering.in' },
    galleryColors: ['#C4501E', '#A03A12', '#E8905A', '#8B3010', '#F0C4A0'],
    bookedPackage: 'Premium',
    totalAmount: 500000,
    amountPaid: 250000,
    packages: [
      { name: 'Standard', label: '₹800 / plate',   features: ['5 starters', '8 main dishes', 'Rice + breads', 'Dessert station', 'Service staff'] },
      { name: 'Premium',  label: '₹1,000 / plate', selected: true, features: ['8 starters', '12 main dishes', 'Live dosa + chaat counters', 'Ice cream station', 'Dedicated service staff', 'Table floral centerpieces'] },
      { name: 'Royal',    label: '₹1,200 / plate', features: ['Full thali service', '15 main dishes', '3 live counters', 'Premium dessert spread', 'Silver plated service', 'Dedicated event manager'] },
    ],
    reviews: [
      { name: 'Kiran Reddy', rating: 5, text: 'Food was exceptional — guests are still talking about the biryani and the live dosa counter was a massive hit. Worth every rupee.' },
      { name: 'Sunita Mehta', rating: 5, text: 'Seamless service for our 800-person reception. The team was well-coordinated and food quality stayed consistent throughout.' },
    ],
  },
  4: {
    bio: 'Pandit Suresh Iyengar brings 30 years of Vedic ritual expertise. Fluent in Tamil, Sanskrit, and Hindi — ideal for fusion South-North Indian weddings.',
    contact: { phone: '+91 94440 23310', email: null, website: null },
    galleryColors: ['#C8973A', '#A07020', '#E8C870', '#7A5510', '#F0E0A0'],
    bookedPackage: 'Pheras & Saptapadi',
    totalAmount: 15000,
    amountPaid: 7500,
    packages: [
      { name: 'Haldi + Mehndi Puja',  label: '₹8,000',  features: ['Haldi ceremony rituals', 'Mehndi blessings', '~2 hours', 'Materials provided'] },
      { name: 'Pheras & Saptapadi',   label: '₹15,000', selected: true, features: ['Full pheras ceremony', 'Saptapadi vows', 'Mangalsutra ritual', '~3 hours', 'Bi-lingual explanation'] },
      { name: 'Full Ceremony',        label: '₹25,000', features: ['All pre-wedding rituals', 'Full pheras + saptapadi', 'Vidai ceremony', 'Grihapravesh', '~6 hours', 'Detailed family guide'] },
    ],
    reviews: [
      { name: 'Vikram & Deepa', rating: 5, text: 'Pandit Sureshji made our fusion wedding so beautiful. He explained every ritual in both languages. Guests were deeply moved.' },
      { name: 'Arjun Nair', rating: 5, text: 'Very punctual, deeply knowledgeable, and made the ceremony incredibly meaningful. He has an 8:30pm hard stop — plan accordingly.' },
    ],
  },
  5: {
    bio: 'Bloom Florals specialises in luxury wedding floral design. From mandap installations to table centrepieces, every arrangement is crafted to transport your guests.',
    contact: { phone: '+91 95440 67890', email: 'hello@bloomflorals.in', website: 'bloomflorals.in' },
    galleryColors: ['#C4608A', '#8B3060', '#E8A0C0', '#5C1040', '#F0D0E0'],
    bookedPackage: 'Signature',
    totalAmount: 140000,
    amountPaid: 70000,
    packages: [
      { name: 'Essential',  label: '₹80,000',   features: ['Mandap floral arch', 'Entrance garlands', '10 table centrepieces', 'Bride + groom flower garlands'] },
      { name: 'Signature',  label: '₹1,40,000', selected: true, features: ['Full mandap installation', 'Entrance floral arch + pathway', '20 table centrepieces', 'Flower wall backdrop', 'Car decoration', 'Bridal bouquet'] },
      { name: 'Grand',      label: '₹2,20,000', features: ['Full venue transformation', 'Ceiling floral installation', '30+ centrepieces', 'Phoolon ki chaadar', 'Floral jewellery for bride', 'Poolside decoration'] },
    ],
    reviews: [
      { name: 'Priya Kapoor', rating: 5, text: 'Our mandap looked like something out of a fairytale. Bloom Florals exceeded every expectation — the flower wall backdrop was breathtaking.' },
      { name: 'Sneha Rao', rating: 4, text: 'Beautiful work overall. Minor hiccup with one centrepiece but they fixed it before guests arrived. Professional and responsive.' },
    ],
  },
  6: {
    bio: 'Rhythm DJ Services brings Mumbai energy to Chennai celebrations. 15 years of wedding entertainment with a setlist curated for every generation on the dance floor.',
    contact: { phone: '+91 98840 44120', email: 'bookings@rhythmdj.in', website: 'rhythmdj.in' },
    galleryColors: ['#3D4A8C', '#252E6B', '#7080C8', '#1A2050', '#A0B0E8'],
    bookedPackage: 'Combo',
    totalAmount: 65000,
    amountPaid: 32500,
    packages: [
      { name: 'Sangeet Only', label: '₹35,000', features: ['4-hour set', '2 speakers + subwoofer', 'Basic lighting rig', 'Curated Bollywood playlist', 'MC services'] },
      { name: 'Combo',        label: '₹65,000', selected: true, features: ['Sangeet + Reception (8 hours)', 'Full PA system', 'LED wall backdrop', 'Fog machine', 'Custom intro reel', 'Live song requests'] },
      { name: 'Premium',      label: '₹95,000', features: ['All 3 events (12 hours)', 'Full concert lighting rig', 'Laser show', 'LED wall + floor', 'Live dhol collaboration', 'Photo booth integration'] },
    ],
    reviews: [
      { name: 'Rohit Singh', rating: 5, text: 'DJ Rhythm kept the dance floor packed from 9pm to 1am. The LED wall made every photo look incredible. Worth every rupee.' },
      { name: 'Kavya Menon', rating: 4, text: "Great playlist and energy. The Combo package is excellent value — fog machine during the couple's first dance was magical." },
    ],
  },
  7: {
    bio: 'Grand Decorators transforms wedding venues into dream settings. Our team of 30 craftsmen works across Chennai with premium draping, lighting, and bespoke props.',
    contact: { phone: '+91 93810 99230', email: 'events@granddeco.in', website: 'granddeco.in' },
    galleryColors: ['#7A0F46', '#5C0B35', '#C060A0', '#3A0828', '#E0A0C8'],
    bookedPackage: 'Classic',
    totalAmount: 550000,
    amountPaid: 275000,
    packages: [
      { name: 'Essential', label: '₹3,50,000', features: ['Mandap + stage setup', 'Entrance arch', 'Basic draping', 'Fairy light canopy', '50-person seating setup'] },
      { name: 'Classic',   label: '₹5,50,000', selected: true, features: ['Full venue transformation', 'Premium draping', 'LED uplighting', 'Photo booths (2)', 'Table + chairs (200 pax)', 'Lounge furniture'] },
      { name: 'Luxe',      label: '₹8,00,000', features: ['Premium draping & fabric walls', 'Chandelier installation', 'Custom monogram projection', 'Floral + decor integration', 'Furniture upgrade (300 pax)', 'Dedicated design manager'] },
    ],
    reviews: [
      { name: 'Anita Sharma', rating: 5, text: 'Grand Decorators transformed our venue beyond imagination. The Classic package gave us a luxury look at a very reasonable price.' },
      { name: 'Mohan Pillai', rating: 5, text: 'Incredibly professional team. Setup was complete 4 hours before the event, everything perfectly placed. So many compliments on the decor.' },
    ],
  },
  8: {
    bio: 'Royal Baraat Band has led processions across 500+ weddings with high-energy performances featuring traditional instruments and modern Bollywood hits.',
    contact: { phone: '+91 91760 33450', email: 'royalbaraatband@gmail.com', website: null },
    galleryColors: ['#B03A10', '#8B2010', '#E06040', '#5C1008', '#F0A080'],
    bookedPackage: 'Premium',
    totalAmount: 75000,
    amountPaid: 37500,
    packages: [
      { name: 'Standard', label: '₹45,000', features: ['10-piece band', 'Dhol + brass section', '2-hour procession', 'Decorative palanquin', 'Classic Bollywood & folk setlist'] },
      { name: 'Premium',  label: '₹75,000', selected: true, features: ['15-piece band', 'Dhol + brass + percussion', '3-hour procession', 'Horse arrangement', 'LED palki + band cart', 'Custom song requests'] },
      { name: 'Royal',    label: '₹1,20,000', features: ['20-piece band', 'Full instrument ensemble', '4-hour procession', '2 horses + elephant (on request)', 'Fire performers', 'Full pyrotechnics display'] },
    ],
    reviews: [
      { name: 'Aditya Kumar', rating: 5, text: 'The baraat energy was unreal. 15 musicians, the horse entrance, LED cart — everyone on the street stopped to watch. Unforgettable.' },
      { name: 'Ramesh Gupta', rating: 5, text: 'Royal Baraat elevated our procession to a true celebration. The customised songs for the groom were a lovely personal touch.' },
    ],
  },
  // ── Discovery vendors ────────────────────────────────────────────────────────
  d1: {
    bio: "Kapoor & Co are multi-award winning photographers with an editorial eye. Their work has been featured in Vogue India Weddings and WeddingWire's Top 10.",
    contact: { phone: '+91 98210 77540', email: 'studio@kapoorco.in', website: 'kapoorco.in' },
    galleryColors: ['#8B6A4F', '#C4956A', '#5C3820', '#E8C0A0', '#D4A882'],
    packages: [
      { name: 'Essential',  label: '₹2,00,000', features: ['10-hour coverage', '700 edited photos', '2 photographers', 'Online gallery'] },
      { name: 'Signature',  label: '₹3,00,000', features: ['Full day coverage', '1,500 edited photos', '3 photographers', 'Pre-wedding shoot', 'Photo album'] },
      { name: 'Editorial',  label: '₹4,00,000', features: ['2-day coverage', '3,000 edited photos', '4 photographers + BTS', 'Destination shoot option', 'Premium album + box set'] },
    ],
    reviews: [
      { name: 'Divya & Varun', rating: 5, text: 'Kapoor & Co are simply the best in Chennai. Every photo tells a story — editorial yet deeply personal.' },
      { name: 'Asha Menon', rating: 5, text: 'Their pre-wedding shoot package alone is worth every rupee. The wedding coverage left us speechless.' },
    ],
  },
  d2: {
    bio: 'Sunflower Films specialises in cinematic wedding films that feel like feature movies. Every film is colour-graded and scored with licensed music for a premium result.',
    contact: { phone: '+91 97400 88160', email: 'hello@sunflowerfilms.in', website: 'sunflowerfilms.in' },
    galleryColors: ['#3D6080', '#253C5C', '#6090B0', '#1A2840', '#90C0E0'],
    packages: [
      { name: 'Cinematic', label: '₹1,50,000', features: ['8-hour coverage', '5-min highlight film', '1 videographer', 'Colour graded + scored'] },
      { name: 'Premium',   label: '₹2,20,000', features: ['Full day coverage', '10-min highlight film', '2 videographers', 'Full ceremony film', 'Drone footage'] },
      { name: 'Feature',   label: '₹3,00,000', features: ['2-day coverage', '20-min wedding film', '3 videographers', 'Full ceremony + pre-wedding', 'Drone + stabiliser rig', 'Dolby audio'] },
    ],
    reviews: [
      { name: 'Pooja Iyer', rating: 5, text: "Our wedding film by Sunflower is honestly better than most films I've watched. We rewatch it every anniversary." },
      { name: 'Kiran Nair', rating: 4, text: 'Exceptional cinematography and editing. Delivery took 6 weeks but the result was absolutely worth the wait.' },
    ],
  },
  d3: {
    bio: 'Spice Route brings authentic Chettinad, Andhra, and North Indian cuisine to weddings. Our culinary team has cooked for royal families and Bollywood weddings.',
    contact: { phone: '+91 99400 54320', email: 'bookings@spiceroute.in', website: 'spiceroute.in' },
    galleryColors: ['#C4501E', '#8B3010', '#E89060', '#5C1808', '#F0B888'],
    packages: [
      { name: 'Feast',       label: '₹900 / plate',   features: ['6 starters', '10 main dishes', 'Live biryani counter', 'Dessert station', 'Service staff (1:20 ratio)'] },
      { name: 'Grand Feast', label: '₹1,100 / plate', features: ['9 starters', '14 main dishes', '2 live counters', 'Ice cream & mithai bar', 'Silver service option'] },
      { name: 'Royal Banquet', label: '₹1,400 / plate', features: ['Full thali service', '18 dishes', '4 live stations', 'Dedicated chef stations', 'Personalised menu cards', 'Event manager'] },
    ],
    reviews: [
      { name: 'Suresh Rajan', rating: 5, text: "The Chettinad spread was authentic and incredible. Guests from Tamil Nadu said it was the best they'd had at a wedding." },
      { name: 'Meena Krishnan', rating: 5, text: 'Live biryani counter was a showstopper. Spice Route is in a different league.' },
    ],
  },
  d4: {
    bio: 'Petal & Bloom Studio crafts bespoke floral installations that blend traditional marigold aesthetics with contemporary design. Based in Nungambakkam, Chennai.',
    contact: { phone: '+91 96770 22150', email: 'studio@petalbloom.in', website: 'petalbloom.in' },
    galleryColors: ['#D4688A', '#A03060', '#F0A0C0', '#6A1840', '#E8C8D8'],
    packages: [
      { name: 'Bloom',    label: '₹80,000',   features: ['Mandap arch', 'Entrance garlands', '10 centrepieces', 'Bride garland'] },
      { name: 'Flourish', label: '₹1,30,000', features: ['Full mandap', 'Entrance pathway', '20 centrepieces', 'Flower wall', 'Car decor'] },
      { name: 'Opulent',  label: '₹2,00,000', features: ['Full venue floral', 'Ceiling installation', 'Phoolon ki chaadar', 'Bridal bouquet', 'Floral jewellery'] },
    ],
    reviews: [
      { name: 'Radha Singh', rating: 5, text: 'Petal & Bloom created the most breathtaking mandap. The floral chaadar was a dream come true.' },
      { name: 'Geeta Sharma', rating: 4, text: 'Lovely work, very creative designs. The team was flexible with last-minute changes too.' },
    ],
  },
  d5: {
    bio: 'Vibrant Beats DJ delivers high-energy wedding sets that blend Punjabi bhangra, Bollywood chart-toppers, and Tamil hits. Every set is custom-built for your guests.',
    contact: { phone: '+91 95560 71240', email: 'dj@vibrantbeats.in', website: 'vibrantbeats.in' },
    galleryColors: ['#5040A0', '#302878', '#8070D0', '#1C1450', '#B0A8E8'],
    packages: [
      { name: 'Beats',    label: '₹40,000', features: ['4-hour set', 'Standard PA system', 'Basic lighting', 'Bollywood playlist'] },
      { name: 'Vibe',     label: '₹65,000', features: ['6-hour set', 'Pro PA system', 'RGB lighting', 'Fog machine', 'MC services'] },
      { name: 'Festival', label: '₹90,000', features: ['Full event (10 hours)', 'Concert-grade PA', 'Full lighting rig', 'Laser show', 'Live percussion'] },
    ],
    reviews: [
      { name: 'Jay Patel', rating: 5, text: 'Vibrant Beats had everyone dancing from 9pm to midnight without a break. The playlist was perfectly mixed.' },
      { name: 'Nidhi Desai', rating: 4, text: 'Great energy and very professional. The bhangra-to-Bollywood transitions were flawless.' },
    ],
  },
  d6: {
    bio: 'Pandit Ramachandran is a highly sought Vedic scholar based in Mylapore. He has performed ceremonies for over 1,200 weddings with the highest regard for tradition.',
    contact: { phone: '+91 94450 11230', email: null, website: null },
    galleryColors: ['#B89040', '#8A6010', '#E0C060', '#5C3808', '#F0E0A8'],
    packages: [
      { name: 'Puja Rituals',       label: '₹10,000', features: ['Nandi Shraddha', 'Vara Puja', 'Kasi Yatra', '~3 hours'] },
      { name: 'Full Ceremony',      label: '₹18,000', features: ['All pre-wedding rituals', 'Full pheras + saptapadi', 'Mangalsutra + sindhoor', '~5 hours'] },
      { name: 'Complete Package',   label: '₹28,000', features: ['2-day ceremony coverage', 'All rituals end-to-end', 'Grihapravesh + Satyanarayan Puja', 'Detailed bilingual guide'] },
    ],
    reviews: [
      { name: 'Lata Iyer', rating: 5, text: "Pandit Ramachandran's 5.0 rating says everything. He performed our ceremony with such devotion and clarity." },
      { name: 'Vivek Iyengar', rating: 5, text: 'The bilingual explanations made every ritual meaningful for our mixed family. A rare and special pandit.' },
    ],
  },
  d7: {
    bio: 'Golden Thread Decorators transforms venues with an artistic vision. Specialists in grand floral + fabric installations with a contemporary Indian design aesthetic.',
    contact: { phone: '+91 90000 88120', email: 'design@goldenthread.in', website: 'goldenthread.in' },
    galleryColors: ['#8A6A40', '#6B4A20', '#C4A870', '#3A2810', '#E0C8A0'],
    packages: [
      { name: 'Classic',   label: '₹3,50,000', features: ['Stage + mandap setup', 'Fabric draping', 'LED lighting', '100-person seating'] },
      { name: 'Grand',     label: '₹5,80,000', features: ['Full venue', 'Premium draping', 'Chandelier + uplighting', 'Photo booth (2)', '200-person setup'] },
      { name: 'Imperial',  label: '₹8,50,000', features: ['Premium draping + fabric walls', 'Custom lighting design', 'Monogram projection', 'Lounge furniture', '350-person setup', 'Design manager on-site'] },
    ],
    reviews: [
      { name: 'Seema Chopra', rating: 5, text: 'Golden Thread turned our venue into a palace. The Grand package is exceptional value — stunning result for the price.' },
      { name: 'Poonam Malhotra', rating: 5, text: 'Incredibly detailed work. The fabric walls and chandelier installation were magazine-worthy. Highly recommended.' },
    ],
  },
  d8: {
    bio: 'Artistry Mehndi is a 3-artist studio creating signature bridal mehndi in Arabic, Rajasthani, and Indo-Western styles. Fully organic henna, custom designs for every bride.',
    contact: { phone: '+91 96000 43210', email: 'artistry.mehndi@gmail.com', website: null },
    galleryColors: ['#4A7A50', '#2E5C34', '#80C090', '#1A3C20', '#A8D8B0'],
    packages: [
      { name: 'Bridal Essentials',  label: '₹10,000', features: ['Bride full hands', '3 design styles to choose', 'Organic henna', '~2 hours'] },
      { name: 'Bridal Glow',        label: '₹18,000', features: ['Bride full arms + feet', '4 guests (hands)', 'Design consultation', 'Touch-up kit included', '~5 hours'] },
      { name: 'Full Bridal Suite',  label: '₹28,000', features: ['Bride full arms + feet + legs', '8 guests (full hands)', '3 artists on-site', 'Custom portrait design', 'Aftercare kit', '~7 hours'] },
    ],
    reviews: [
      { name: 'Pallavi Desai', rating: 5, text: 'Artistry Mehndi is exceptional. My custom portrait took 3 hours alone and was absolutely breathtaking.' },
      { name: 'Jyoti Varma', rating: 5, text: "Three artists working simultaneously meant everyone was done in time. The organic henna colour was the deepest I've ever seen." },
    ],
  },
  // ── AI-suggested decorators ────────────────────────────────────────────────
  sd1: {
    bio: 'The Decor Studio is Mumbai\'s most sought-after luxury decorator, known for lush floral mandap installations and bespoke tablescapes. Their work has graced 600+ five-star weddings.',
    contact: { phone: '+91 98400 44200', email: 'hello@thedecor.studio', website: 'thedecor.studio' },
    galleryColors: ['#4A7840', '#2E5C28', '#80C870', '#1C3C14', '#B8E0A8'],
    packages: [
      { name: 'Bloom',     label: '₹5,00,000',  features: ['Mandap floral arch', 'Entrance arrangements', '15 table centrepieces', 'Stage draping', 'Fairy light canopy'] },
      { name: 'Grand',     label: '₹8,00,000',  selected: true, features: ['Full venue floral transformation', 'Luxury mandap installation', 'Entrance + pathway florals', '25 centrepieces', 'Flower wall backdrop', 'Lounge styling'] },
      { name: 'Signature', label: '₹12,00,000', features: ['Bespoke full-venue concept', 'Ceiling floral installation', 'Phoolon ki chaadar', '35+ centrepieces', 'Bridal suite decor', 'Dedicated design director'] },
    ],
    reviews: [
      { name: 'Priya & Aditya', rating: 5, text: 'The Decor Studio made our wedding look like a Vogue editorial. Every corner was immaculate — guests were speechless the moment they walked in.' },
      { name: 'Sunita Mehta', rating: 5, text: 'Worth every rupee. They took our Pinterest board and turned it into something ten times better. The flower wall alone made a thousand Instagram moments.' },
    ],
  },
  sd2: {
    bio: 'Blooms & Beyond brings a soft, romantic aesthetic to every wedding — think garden parties, soft draping, and florals that feel freshly picked. Based in Delhi with pan-India delivery.',
    contact: { phone: '+91 99400 22310', email: 'hello@bloomsandbeyond.in', website: 'bloomsandbeyond.in' },
    galleryColors: ['#C4688A', '#8B3060', '#F0A0C0', '#5C1840', '#E8C8D8'],
    packages: [
      { name: 'Garden',   label: '₹1,50,000', features: ['Mandap arch', 'Entrance florals', '10 table centrepieces', 'Bride garland'] },
      { name: 'Romantic', label: '₹2,80,000', selected: true, features: ['Full mandap', 'Entrance + pathway', '20 centrepieces', 'Pastel draping', 'Flower wall', 'Car decor'] },
      { name: 'Dreamy',   label: '₹4,00,000', features: ['Full venue florals', 'Ceiling installation', 'Phoolon ki chaadar', 'Bridal bouquet', 'Suite decoration', 'Floral jewellery'] },
    ],
    reviews: [
      { name: 'Neha & Rohan', rating: 5, text: 'Our venue felt like a secret garden. Blooms & Beyond captured exactly the soft, romantic look we wanted. Guests were in awe.' },
      { name: 'Kavya Sharma', rating: 4, text: 'Beautiful florals and a lovely team to work with. Delivery was seamless and setup was complete well before guests arrived.' },
    ],
  },
  sd3: {
    bio: 'Kalank Events specialises in traditional North Indian and fusion wedding decor with rich fabrics, gold tones, and intricate detailing. Jaipur\'s premier heritage decorator for 18 years.',
    contact: { phone: '+91 98100 55678', email: 'events@kalankevents.in', website: 'kalankevents.in' },
    galleryColors: ['#8B4010', '#6B2808', '#C87040', '#3A1404', '#E8A878'],
    packages: [
      { name: 'Heritage',   label: '₹3,00,000', features: ['Traditional mandap', 'Marigold entrance', 'Brass lamp + diya setup', '15 table settings', 'Rajasthani draping'] },
      { name: 'Royal',      label: '₹5,50,000', selected: true, features: ['Grand durbar-style mandap', 'Full venue transformation', 'Gold + jewel-tone draping', 'Hand-painted props', '25 centrepieces', 'Mirror work accents'] },
      { name: 'Maharaja',   label: '₹7,00,000', features: ['Palace-inspired full venue', 'Ceiling gold canopy', 'Jharokha photo booths', 'Custom monogram work', 'Elephant prop entrance', 'Meenakari table decor'] },
    ],
    reviews: [
      { name: 'Pooja & Vikram', rating: 5, text: 'Kalank Events made our wedding feel like a royal Rajasthani celebration. The mandap was breathtaking and every detail was perfect.' },
      { name: 'Ritu Agarwal', rating: 5, text: 'We wanted a traditional yet grand wedding — Kalank delivered exactly that. The marigold entrance was stunning and guests loved the heritage feel.' },
    ],
  },
  sd4: {
    bio: 'Minimal Shaadi Co. redefines Indian wedding decor with a clean, contemporary aesthetic. Neutral palettes, architectural structures, and thoughtful lighting make every element intentional.',
    contact: { phone: '+91 97300 11456', email: 'hello@minimalshaadi.co', website: 'minimalshaadi.co' },
    galleryColors: ['#9080A0', '#6B5880', '#C0B0D8', '#3A2858', '#E0D8F0'],
    packages: [
      { name: 'Edit',    label: '₹80,000',   features: ['Minimal mandap frame', 'Neutral draping', 'Geometric centrepieces (10)', 'Warm Edison lighting'] },
      { name: 'Studio',  label: '₹1,40,000', selected: true, features: ['Architectural mandap structure', 'Full venue neutral palette', 'Statement lighting rig', '20 centrepieces', 'Pampas + dried floral styling', 'Photo-ready vignettes'] },
      { name: 'Gallery', label: '₹2,00,000', features: ['Full venue concept design', 'Bespoke structure build', 'Neon/acrylic name signage', 'Hanging installations', 'Furniture curation', 'Dedicated stylist on-site'] },
    ],
    reviews: [
      { name: 'Tara & Karan', rating: 5, text: 'Finally a decorator that understood we wanted something different. No gold, no chaos — just clean, beautiful, intentional decor. Exactly us.' },
      { name: 'Ananya Reddy', rating: 4, text: "Minimal Shaadi Co.'s aesthetic is unlike anything else in the market. The pampas grass centrepieces and Edison lights were perfect." },
    ],
  },
  sd5: {
    bio: 'Regal Weddings creates palace-style heritage events that transport guests to another era. Specialists in destination weddings at Udaipur, Jodhpur, and Jaipur forts and havelis.',
    contact: { phone: '+91 98200 77890', email: 'luxury@regalweddings.in', website: 'regalweddings.in' },
    galleryColors: ['#1A3A6B', '#0E2248', '#4878C8', '#080E30', '#80A8F0'],
    packages: [
      { name: 'Palace',    label: '₹10,00,000', features: ['Grand durbar hall setup', 'Royalty-inspired mandap', 'Full venue florals & draping', '30 centrepieces', 'Vintage furniture pieces'] },
      { name: 'Maharaja',  label: '₹17,00,000', selected: true, features: ['Complete heritage transformation', 'Ceiling fabric installation', 'Monogram projections', 'Antique prop collection', 'Fountain focal point', 'Dedicated art director'] },
      { name: 'Imperial',  label: '₹25,00,000', features: ['2-day multi-venue styling', 'Custom-built set pieces', 'Live flower installation team', 'Candelabra + crystal chandeliers', 'Film-grade lighting design', 'Butler service coordination'] },
    ],
    reviews: [
      { name: 'Ishaan & Meera', rating: 5, text: 'Regal Weddings took our Udaipur venue and made it look like a scene from Devdas. Guests were stunned. Worth absolutely every rupee.' },
      { name: 'Nidhi Bajaj', rating: 5, text: 'We had 5.0 expectations and they delivered 10. The imperial setup with the fountain centrepiece and projections was unlike anything we had ever seen.' },
    ],
  },
  // ── Makeup / Beauty ──────────────────────────────────────────────────────────
  mu1: {
    bio: 'Priya has transformed 800+ brides across South India with her signature clean-glam look. She specialises in long-wear airbrush formulas and classic Kanjeevaram-ready styles that hold all day.',
    contact: { phone: '+91 98401 23456', email: 'glam@priyamakeup.in', website: 'glambypriya.in' },
    galleryColors: ['#E8A0B0', '#C47080', '#F0D0D8', '#A05060', '#F8E8EC'],
    packages: [
      { name: 'Bride',         label: '₹25,000', features: ['Full bridal makeup', 'Hair styling', 'Airbrush foundation', 'Lash application'] },
      { name: 'Bridal Suite',  label: '₹40,000', selected: true, features: ['Bride + 3 family members', 'Pre-event trial session', 'Touch-up kit', 'All-day artist on-call', 'Airbrush finish'] },
      { name: 'Premier',       label: '₹50,000', features: ['Bride + 5 family members', 'Full-day artist present', 'Premium luxury products', 'Hair + bun styling', 'Saree/lehenga draping assistance'] },
    ],
    reviews: [
      { name: 'Sneha Nair', rating: 5, text: 'Priya made me look like myself but ten times better. My makeup lasted from 8am to 2am without a single touch-up!' },
      { name: 'Aditi Rao',  rating: 5, text: 'Absolutely phenomenal artist. She understood exactly the look I wanted and delivered it perfectly.' },
    ],
  },
  mu2: {
    bio: 'Bridal Bliss Studio is a Chennai-based boutique beauty parlour specialising in South Indian bridal looks — silk saree draping, jasmine arrangements, and classic kohl-lined looks.',
    contact: { phone: '+91 97400 65432', email: 'bookings@bridalbliss.in', website: 'bridalbliss.in' },
    galleryColors: ['#C4A060', '#8B6830', '#E8D090', '#5C3810', '#F5E8C0'],
    packages: [
      { name: 'Classic',    label: '₹20,000', features: ['Bridal makeup + hair', 'Saree draping', 'Silk blouse assistance', 'Jasmine arrangement'] },
      { name: 'Signature',  label: '₹32,000', selected: true, features: ['Bride + 2 family', 'Pre-event trial', 'South Indian bridal look', 'Traditional hair accessories', 'Jasmine + gajra arrangement', 'Touch-up pack'] },
      { name: 'Royal',      label: '₹45,000', features: ['Bride + 4 family', 'Morning + evening looks', 'Silk saree & lehenga draping', 'Premium jewellery staging photos', 'Full-day team'] },
    ],
    reviews: [
      { name: 'Ramya Krishnan', rating: 5, text: 'They nailed the traditional look I wanted. The jasmine braiding was intricate and beautiful. Highly recommend for South Indian weddings.' },
      { name: 'Vaishali Iyer',  rating: 4, text: 'Lovely team, very experienced with Kanchipuram sarees. My look lasted the full day — no touch-ups needed till the reception.' },
    ],
  },
  mu3: {
    bio: 'The Bridal Atelier is a luxury beauty collective offering editorial and destination-ready bridal looks. They have worked on Bollywood film sets and international bridal editorials.',
    contact: { phone: '+91 99800 11223', email: 'book@thebridalatelier.in', website: 'thebridalatelier.in' },
    galleryColors: ['#7A5080', '#502858', '#C090D0', '#300838', '#F0D8F8'],
    packages: [
      { name: 'Editorial',  label: '₹30,000', features: ['Signature editorial bridal look', 'High-fashion hair styling', 'Professional lighting-tested formula', '2 trials included'] },
      { name: 'Couture',    label: '₹48,000', selected: true, features: ['Bride + 3 family', 'Pre-wedding editorial trial', 'Custom look moodboard', 'Professional kit with HD products', 'All-day artist presence'] },
      { name: 'Atelier',    label: '₹65,000', features: ['Full team of 3 artists', 'Destination-ready look', 'Couture saree + lehenga draping', 'Behind-the-scenes photo set', 'Luxury branded touch-up kit as gift'] },
    ],
    reviews: [
      { name: 'Nisha Singhania', rating: 5, text: 'I have never felt more beautiful. The Bridal Atelier gave me a magazine-cover look — effortless, luminous, and totally ME.' },
      { name: 'Preethi Kumar',   rating: 5, text: 'Worth every rupee. They brought 3 artists and transformed our whole bridal party. The lighting-tested formulas truly lasted all night.' },
    ],
  },
  // ── Choreographer ────────────────────────────────────────────────────────────
  ch1: {
    bio: 'Nrityanjali Dance Co. is a Chennai-based performance collective known for breathtaking Sangeet choreography. Their signature fusion of Bharatanatyam, Bollywood, and contemporary dance is unmissable.',
    contact: { phone: '+91 98500 88760', email: 'perform@nrityanjali.in', website: 'nrityanjali.in' },
    galleryColors: ['#C87840', '#8B4810', '#E8B078', '#5C2808', '#F5D8B0'],
    packages: [
      { name: 'Spark',     label: '₹40,000', features: ['Family group choreo (8–10 pax)', '3 rehearsal sessions', '1 performance on Sangeet night', 'Costume consultation'] },
      { name: 'Showtime',  label: '₹65,000', selected: true, features: ['2 group performances', 'Bride/groom solo option', '5 rehearsal sessions', 'Live music coordination', 'Stage entry choreography'] },
      { name: 'Spektakle', label: '₹80,000', features: ['3 full group acts', 'Flash mob sequence', '7 rehearsal sessions', 'LED prop coordination', 'Full event MC + choreography'] },
    ],
    reviews: [
      { name: 'Divya Menon',    rating: 5, text: 'Nrityanjali rehearsed with our chaotic family group and somehow produced a stunning performance. Tears of joy from every guest.' },
      { name: 'Tarun Pillai',   rating: 5, text: 'The flash mob entrance at the Sangeet had every single guest on their feet. Absolutely spectacular. Will recommend forever.' },
    ],
  },
  ch2: {
    bio: 'Step & Celebrate is a boutique Sangeet choreography studio specialising in fun, accessible routines for all ages. They are known for turning reluctant dads and aunties into star performers.',
    contact: { phone: '+91 97600 44120', email: 'hello@stepandcelebrate.in', website: 'stepandcelebrate.in' },
    galleryColors: ['#4A8060', '#285C3C', '#88C0A0', '#143C20', '#C0E8D0'],
    packages: [
      { name: 'Fun Steps',  label: '₹25,000', features: ['1 family group routine (6–8 pax)', '3 sessions over 2 days', 'Easy beginner choreography', 'Bollywood hits setlist'] },
      { name: 'Showstopper', label: '₹42,000', selected: true, features: ['2 group acts', '5 rehearsal sessions', 'Kids + elders included', 'Props coordination', 'All-ages friendly'] },
      { name: 'Grand Finale', label: '₹55,000', features: ['3 acts + surprise element', '7 sessions', 'Costume colour coordination', 'MC guidance on Sangeet night', 'Video reel of performance'] },
    ],
    reviews: [
      { name: 'Shweta Agarwal', rating: 5, text: 'My 65-year-old mother-in-law danced brilliantly because of Step & Celebrate. The routines were fun, manageable, and absolutely adorable.' },
      { name: 'Kiran Desai',    rating: 4, text: 'Great team, very patient with a big mixed-age family group. The final performance was a massive hit.' },
    ],
  },
  // ── Invitation Designer / Stationery ─────────────────────────────────────────
  in1: {
    bio: 'Paper & Petals Studio creates bespoke luxury wedding invitations that set the tone for your celebration. Handmade paper, foil printing, floral inlays, and custom illustration for each bride.',
    contact: { phone: '+91 98600 77234', email: 'create@paperandpetals.in', website: 'paperandpetals.in' },
    galleryColors: ['#E0C8A0', '#B09060', '#F8ECD8', '#806040', '#FFF0D8'],
    packages: [
      { name: 'Classic',    label: '₹15,000', features: ['50 invitation sets', 'Envelope + card', 'Foil printing', 'RSVP card', '2 design revisions'] },
      { name: 'Signature',  label: '₹28,000', selected: true, features: ['100 invitation sets', 'Box enclosure', 'Gold foil + emboss', 'Custom illustration (mandap/couple)', 'Digital version included', '4 design revisions'] },
      { name: 'Heirloom',   label: '₹42,000', features: ['150 invitation sets', 'Handmade paper', 'Custom hand-drawn portrait', 'Wax seal + ribbon', 'Gift tag set', 'WhatsApp digital e-invite suite'] },
    ],
    reviews: [
      { name: 'Anaya Sharma',  rating: 5, text: 'Our invitations were so beautiful that guests framed them! The custom mandap illustration was an exact replica of our venue. Flawless work.' },
      { name: 'Rina Kapoor',   rating: 5, text: 'Paper & Petals exceeded every expectation. The foil printing quality is exceptional — these are truly heirlooms.' },
    ],
  },
  in2: {
    bio: 'Shagun Prints is Delhi\'s most loved wedding stationery house, trusted for vibrant, rich-coloured Indian wedding invitations delivered across India within 10 working days.',
    contact: { phone: '+91 99100 55678', email: 'orders@shagunprints.in', website: 'shagunprints.in' },
    galleryColors: ['#C04030', '#881818', '#E88070', '#500808', '#F8C0B0'],
    packages: [
      { name: 'Vibrant',    label: '₹8,000',  features: ['50 cards', 'Full-colour digital print', 'Envelope included', 'Standard 2-day dispatch'] },
      { name: 'Festive',    label: '₹15,000', selected: true, features: ['100 cards', 'Premium matt lamination', 'Pocket folder enclosure', 'Inserts (4 cards)', 'RSVP + map card'] },
      { name: 'Grand',      label: '₹25,000', features: ['150 cards', 'Duplex board premium', 'Gold foil optional', 'Multi-fold booklet format', 'Digital WhatsApp suite free'] },
    ],
    reviews: [
      { name: 'Komal Jain',  rating: 5, text: 'Fast, affordable, and gorgeous. Shagun Prints delivered 100 invitations in 8 days and every single one was perfect.' },
      { name: 'Neetu Singh', rating: 4, text: 'Great quality for the price. The pocket folder with 4 inserts looked premium. Very happy with the overall result.' },
    ],
  },
  in3: {
    bio: 'Ivory & Gold Designs specialises in contemporary minimalist invitation suites with a luxury feel. Each suite is carefully curated with premium materials and thoughtful typography.',
    contact: { phone: '+91 98801 33456', email: 'studio@ivoryandgold.in', website: 'ivoryandgold.in' },
    galleryColors: ['#D4C890', '#9A8848', '#F0E8C0', '#605018', '#FFF8E0'],
    packages: [
      { name: 'Minimal',    label: '₹20,000', features: ['75 invitation sets', 'Letterpress or foil', 'Vellum overlay option', 'Neutral palette', '3 design revisions'] },
      { name: 'Curated',    label: '₹35,000', selected: true, features: ['100 sets', 'Duplex card + vellum wrap', 'Wax seal', 'Gold/silver foil', 'Custom monogram', 'Digital suite included'] },
      { name: 'Atelier',    label: '₹50,000', features: ['150 sets', 'Handmade cotton paper', 'Blind emboss + foil', 'Acrylic details', 'Personalised couple illustration', 'Full digital stationery suite'] },
    ],
    reviews: [
      { name: 'Tia Malhotra',  rating: 5, text: 'Ivory & Gold made our minimalist dream come to life. The vellum overlay and wax seal were exactly the elegant touch we wanted.' },
      { name: 'Kabir Mehta',   rating: 5, text: 'Beautifully crafted, arrived well-packaged, and ahead of schedule. The custom monogram was a hit with every guest.' },
    ],
  },
}
