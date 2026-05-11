# ShaadiMubarak.ai — Design System & Product Instructions

This file defines the authoritative design system, color tokens, typography, and component patterns for ShaadiMubarak.ai wedding planning app. Always follow these rules when building or editing any UI in this codebase.

---

## Brand Identity

ShaadiMubarak.ai is a premium Indian wedding planning app. The aesthetic is **editorial luxury** — clean whites, deep magenta, warm dark text, and refined typography. Every screen should feel like a high-end wedding publication brought to life on a phone.

---

## Color Palette

### Primary Brand — Deep Magenta
| Token | Value | Usage |
|-------|-------|-------|
| `--brand` | `#7A0F46` | Primary accent: icons, active states, borders, listening states, key UI highlights |
| `--brand-mid` | `#5C0B35` | Darker maroon for gradients, pressed states |
| `--brand-light` | `rgba(122, 15, 70, 0.08)` | Tinted backgrounds on maroon-accented elements |
| `--brand-border` | `rgba(122, 15, 70, 0.20)` | Subtle maroon borders |
| `--brand-border-strong` | `rgba(122, 15, 70, 0.30)` | Focused/active borders |

> **Rule**: ALL primary brand accents use deep magenta. Never use gold/amber (#C8973A) for new brand UI.

### Action / CTA
| Token | Value | Usage |
|-------|-------|-------|
| `--cta` | `#C4501E` | Primary CTA buttons (Resolve, Invite, Sign in, Save) |
| `--cta-dark` | `#A03A12` | Gradient end for CTA buttons |
| `--cta-shadow` | `rgba(196, 80, 30, 0.28)` | Box shadow under CTA buttons |

CTA button style: `background: linear-gradient(135deg, #C4501E, #A03A12)`, `box-shadow: 0 6px 20px rgba(196,80,30,0.28)`, `border-radius: 14px`, `padding: 15px`, `font-size: 14px`, `font-weight: 500`, `color: #FFFFFF`.

### Secondary Button
Used for icon buttons (notifications, profile avatar) and ghost actions that don't need full CTA weight.
- `background: rgba(122,15,70,0.06)`
- `border: 1px solid rgba(122,15,70,0.28)`
- `color / icon: #7A0F46`
- `border-radius: 50%` for circular icon buttons, `99px` for pill-shaped text buttons
- No box-shadow

### Surface & Text
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FFFBF5` | All screen backgrounds (warm ivory) |
| `--text-primary` | `#1A1410` | All primary body text |
| `--text-secondary` | `rgba(26, 20, 16, 0.45)` | Subheadings, labels, metadata |
| `--text-muted` | `rgba(26, 20, 16, 0.35)` | Placeholders, disabled states |
| `--text-faint` | `rgba(26, 20, 16, 0.20)` | Decorative text, dividers |

### Semantic States (never replace with brand color)
| State | Text | Background | Border |
|-------|------|-----------|--------|
| **Success / Confirmed** | `#2D6025` | `rgba(45, 96, 37, 0.08)` | `rgba(45, 96, 37, 0.22)` |
| **Pending / Caution** | `#A07020` | `rgba(200, 151, 58, 0.10)` | `rgba(200, 151, 58, 0.30)` |
| **Danger / Declined** | `#B03A10` | `rgba(196, 80, 30, 0.08)` | `rgba(196, 80, 30, 0.22)` |
| **At-risk / Crisis** | `#C4501E` | `rgba(196, 80, 30, 0.06)` | `rgba(196, 80, 30, 0.18)` |

> **Rule**: Amber/gold (`#A07020`, `rgba(200,151,58,...)`) is ONLY used for the "Pending" semantic state. Never use it for brand UI.

### Deprecated Colors — Do Not Use for New UI
- ~~`#C8973A`~~ (gold/amber) — replaced by `#7A0F46` for brand accent
- ~~`#E8B85A`~~ (light gold) — replaced by `#7A0F46` with opacity for brand light
- ~~`rgba(200,151,58,...)`~~ as brand — only valid for Pending semantic state
- ~~`#8B1252`~~ (old magenta) — replaced by `#7A0F46` (deep magenta)
- ~~`#6D0E41`~~ (old dark magenta) — replaced by `#5C0B35` (dark magenta)

---

## Typography

### Fonts
- **Display / Headers**: `font-cormorant italic` — Cormorant Garamond, weight 300, italic
- **UI / Body**: `font-outfit` — Outfit, weight 300–600

### Type Scale
| Level | Size | Font | Weight | Usage |
|-------|------|------|--------|-------|
| Hero | 44px | Cormorant italic | 300 | Splash screen, large brand moments |
| Screen title | 36px | Cormorant italic | 300 | Screen H1 (`Guests`, `Budget`, `Vendors`) |
| Section header | 22–28px | Cormorant italic | 300 | Sheet headers, modal titles |
| Card header | 14–16px | Outfit | 600 | Card titles, bold labels |
| Body | 13px | Outfit | 300–400 | All body copy, descriptions |
| Caption | 10–11px | Outfit | 300–400 | Metadata, timestamps, helper text |
| Micro | 9–10px | Outfit | 400–600 | Badges, pills, chip labels |

Letter spacing: `-0.02em` on Cormorant headings; `0.08–0.14em` on uppercase Outfit labels.

---

## Spacing & Layout

- **Screen horizontal padding**: `20px` (class `px-5`)
- **Card gap**: `8–12px` between cards
- **Section gap**: `20px` between sections (`gap-5`)
- **Bottom spacer** on scrollable screens: `80px` (clears the Agent Bar overlay)

---

## Border Radius
| Element | Radius |
|---------|--------|
| Screen cards | `14–16px` |
| Bottom sheet / modal | `22px 22px 0 0` |
| Input fields | `13px` |
| CTA buttons | `14px` |
| Pill badges | `99px` |
| Icon containers | `9–12px` |
| Circular avatars | `50%` |

---

## Elevation & Shadow
| Element | Shadow |
|---------|--------|
| Glass card | `1px solid rgba(0,0,0,0.07)`, `box-shadow: 0 1px 8px rgba(0,0,0,0.04)` |
| Agent bar pill | `0 2px 16px rgba(0,0,0,0.07)` |
| CTA button | `0 6px 20px rgba(196,80,30,0.28)` |
| Bottom sheet | natural (no extra shadow, overlay handles depth) |

---

## Component Patterns

### Bottom Sheets / Modals
- Slide up from bottom: `initial={{ y: '100%' }} → animate={{ y: 0 }}`
- Spring: `{ type: 'spring', stiffness: 380, damping: 36 }`
- Border radius top: `22px 22px 0 0`
- Handle bar: `width: 36px, height: 4px, borderRadius: 2px, background: rgba(0,0,0,0.1)`, centered, `margin-bottom: 20px`
- Always include a dark `rgba(26,20,16,0.30)` backdrop that closes the sheet on tap

### Screen Transitions
- `AnimatePresence mode="wait"` at the router level
- Fade + slight Y translation: `initial={{ opacity:0, y:14 }} → animate={{ opacity:1, y:0 }}`
- Stagger children with `transition: { staggerChildren: 0.07 }`

### Agent Bar
- Omnipresent bar at `bottom: 72px` in every app screen (sits above 64px BottomNav)
- Collapsed pill: white bg, magenta Sparkles icon, grey placeholder text, waveform button
- Expanded: spring animated bottom sheet (74% height)
- Voice: waveform icon (NOT mic), magenta color when listening, real-time interim transcription shown in input
- All brand accents in Agent Bar use deep magenta (`#7A0F46`)

### Input Fields (`glass-input` class)
- Background: white with subtle border `rgba(0,0,0,0.08)`
- Focused / active: border `rgba(122,15,70,0.25)`, background tint `rgba(122,15,70,0.03)`
- Placeholder text: `rgba(26,20,16,0.35)`

### Filter Pills / Tabs
- Inactive: `border: 1px solid rgba(0,0,0,0.09)`, `color: rgba(26,20,16,0.5)`
- Active: `border: 1px solid rgba(122,15,70,0.40)`, `color: #7A0F46`, `background: rgba(122,15,70,0.07)`

### Quick Chips (Agent Bar)
- Style: `color: #7A0F46`, `background: rgba(122,15,70,0.07)`, `border: 1px solid rgba(122,15,70,0.18)`, `borderRadius: 99px`

---

## Splash Screen

1. **Logo phase (0–2.8s)**: Full-screen `#7A0F46` (deep magenta) background. White "ShaadiMubarak.ai" (Cormorant italic, 44px) centered. White `0.5` opacity divider line. White `0.65` opacity "YOUR WEDDING, ALWAYS IN VIEW" tagline.
2. **Image phase (2.8–4.5s)**: Logo fades out. 3-column scrolling wedding photo grid fades in. Magenta gradient overlay (`rgba(122,15,70,0.85)` top/bottom, `rgba(122,15,70,0.55)` center) stays on top so it still feels branded.
3. **Auth**: Screen transitions after 4.5s.

---

## Navigation

Bottom nav: 5 tabs — Today, Guests, Budget, Vendors, Journey. Active tab indicator uses `#7A0F46` (deep magenta) for icon and label. Inactive: `rgba(26,20,16,0.32)`.

---

## Voice Input

- Use the custom `WaveformIcon` SVG (4 animated bars) everywhere — never use the Lucide `Mic` or `MicOff` icons
- Idle state: magenta `#7A0F46` bars, static
- Listening state: animated bars (scale/height oscillation), deep magenta color, pulsing dot in input
- Interim transcription appears in the input field in real-time as the user speaks

---

## PWA / Home Screen

- Android: Intercept `beforeinstallprompt`, show a native install button
- iOS: Show illustrated step-by-step guide using Safari share sheet icon
- Widget promo card appears at the bottom of HomeScreen (dismissible)
- Widget modal: dark preview card showing today's tasks, then install steps

---

## Data & Content Conventions

- Currency: Indian Rupees, formatted as `₹31.8L` (lakhs)
- Dates: `December 17, 2026` (long form) or `Dec 17` (short)
- Countdown: `4 days away`
- Guest counts: `317 invited · 127 attending`
- RSVP states: `confirmed` / `pending` / `declined` (lowercase in data, title-case in UI)
- Vendor states: `confirmed` / `pending` / `at-risk` / `cancelled`
