// Starts fetching illustration SVGs immediately at module-load time so
// they are already in memory (or well underway) when the screens mount.
const cache = new Map()

export function preloadSVG(url) {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => r.text()).catch(() => ''))
  }
  return cache.get(url)
}

/**
 * Inject a preloaded SVG into `container`, strip background rects and
 * white-fill paths (the unwanted outline illustrations), then tag each
 * <image> with a wobble CSS class for animation.
 */
export function injectIllustrationSVG(container, html, wobblePrefix, wobbleCount) {
  container.innerHTML = html
  const svg = container.querySelector('svg')
  if (!svg) return

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'

  // Remove background rects so our coloured bg shows through
  svg.querySelectorAll(':scope > rect, :scope > g > rect').forEach(el => {
    const fill = el.getAttribute('fill') || ''
    if (fill && fill !== 'none' && !fill.startsWith('url')) el.remove()
  })

  // Remove white-fill paths — these are the unwanted outline illustrations
  svg.querySelectorAll('[fill="#ffffff"], [fill="#fff"], [fill="white"]').forEach(el => el.remove())

  // Tag each photo/illustration image for wobble animation
  svg.querySelectorAll('image').forEach((el, i) => {
    el.classList.add(`${wobblePrefix}-${i % wobbleCount}`)
  })
}

// Kick off both fetches right now, before any React component mounts
preloadSVG('/splash-bg.svg')
preloadSVG('/building-bg.svg')
