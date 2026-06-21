/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep space palette
        bg: {
          primary: '#080b14',
          secondary: '#0d1117',
          tertiary: '#161b22',
          card: '#1c2128',
          hover: '#21262d',
        },
        // Accent system - Electric Violet
        accent: {
          blue: '#58a6ff',
          purple: '#bc8cff',
          cyan: '#39d2c0',
          emerald: '#3fb950',
          amber: '#d29922',
          rose: '#f85149',
        },
        // Text hierarchy
        text: {
          primary: '#f0f6fc',
          secondary: '#8b949e',
          tertiary: '#6e7681',
          muted: '#484f58',
        },
        // Borders
        border: {
          subtle: 'rgba(139, 148, 158, 0.1)',
          medium: 'rgba(139, 148, 158, 0.2)',
          accent: 'rgba(188, 140, 255, 0.5)',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(188, 140, 255, 0.3)',
        'glow-blue': '0 0 30px rgba(88, 166, 255, 0.3)',
        'glow-emerald': '0 0 30px rgba(63, 185, 80, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flow': 'flow 2s linear infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(188, 140, 255, 0.5)' },
          '100%': { boxShadow: '0 0 25px rgba(188, 140, 255, 0.8)' },
        },
        flow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
