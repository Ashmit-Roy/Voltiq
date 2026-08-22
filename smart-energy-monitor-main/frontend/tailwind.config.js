/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        // Override slate with pure neutral carbon/zinc tones to eliminate all blue undertones
        slate: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1c1c1f',
          900: '#121215',
          950: '#09090b',
        },
        engine: {
          ingest: '#f59e0b',     // Telemetry Amber / Gold
          ingestBg: '#78350f',
          anomaly: '#f43f5e',    // Precision Crimson / Rose
          anomalyBg: '#881337',
          forecast: '#0d9488',   // Predictive Teal / Seafoam
          forecastBg: '#134e4a',
          eco: '#10b981',        // Energy Eco Green
          ecoBg: '#064e3b',
        }
      },
      boxShadow: {
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
