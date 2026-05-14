/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E0C09',
          2: '#1C1810',
          3: '#2A2418',
        },
        gold: {
          DEFAULT: '#C8973A',
          light: '#E8B85A',
          dim: 'rgba(200,151,58,0.15)',
          border: 'rgba(200,151,58,0.25)',
        },
        terra: {
          DEFAULT: '#C4501E',
          light: '#E06030',
          dim: 'rgba(196,80,30,0.12)',
          border: 'rgba(196,80,30,0.35)',
        },
        cream: {
          DEFAULT: '#F2EBD8',
          2: '#E8DFC8',
          muted: 'rgba(232,220,196,0.45)',
          dim: 'rgba(232,220,196,0.12)',
        },
        confirmed: '#3D7A34',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Cormorant', 'serif'],
        // Body / UI text → Inter. work-sans alias preserved so no component changes needed.
        'work-sans': ['Inter', '"Work Sans"', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        // legacy alias — maps to Inter via work-sans stack
        outfit: ['Inter', '"Work Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
