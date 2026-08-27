/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FBF8F3',         // Soft Warm Cream Linen
          surface: '#FFFFFF',    // Crisp Warm White Card
          card: '#F7F3EB',       // Soft Sand Container
          border: '#E8DEC8',     // Subtle Warm Border
          text: '#2B1E16',       // Deep Dark Coffee Text
          muted: '#7A6B5D',      // Muted Warm Taupe Text
          accent: '#B87D4B',     // Warm Terracotta Ochre Accent
          accentHover: '#A06838',// Darker Ochre
          secondary: '#6E503B',  // Muted Mocha
          success: '#5B8C69',    // Soft Sage Green
          warning: '#D99B26',    // Soft Warm Amber
          danger: '#C95D56',     // Soft Pastel Rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        geist: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
