import { useEffect } from 'react'

// Only photo IDs confirmed loading (verified via naturalWidth check)
const COL1: string[] = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80&fit=crop',
]

const COL2: string[] = [
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.3',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.6',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.4',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.7',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80&fit=crop',
]

const COL3: string[] = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.3',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.5',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80&fit=crop&crop=focalpoint&fp-x=0.3',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80&fit=crop&crop=focalpoint&fp-x=0.6',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80&fit=crop&crop=focalpoint&fp-y=0.4',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80&fit=crop&crop=focalpoint&fp-x=0.4',
]

interface WeddingAnimationProps {
  onComplete: () => void
  duration?: number
}

function ScrollColumn({
  images,
  speed,
  offsetY = 0,
}: {
  images: string[]
  speed: number   // px per second
  offsetY?: number
}) {
  // Duplicate for seamless loop
  const tiles = [...images, ...images]

  return (
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          // CSS animation: scrollUp defined in index.css
          animation: `scrollUp ${speed}s linear infinite`,
          marginTop: `${offsetY}px`,
          willChange: 'transform',
        }}
      >
        {tiles.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="eager"
            style={{
              width: '100%',
              aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1/1' : '3/5',
              objectFit: 'cover',
              borderRadius: '10px',
              display: 'block',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function WeddingAnimation({ onComplete, duration = 5000 }: WeddingAnimationProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  }, [onComplete, duration])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'transparent' }}>
      {/* Scrolling columns */}
      <div style={{ display: 'flex', gap: '6px', height: '100%', padding: '0 6px' }}>
        <ScrollColumn images={COL1} speed={28} offsetY={0} />
        <ScrollColumn images={COL2} speed={22} offsetY={-80} />
        <ScrollColumn images={COL3} speed={26} offsetY={-40} />
      </div>
    </div>
  )
}
