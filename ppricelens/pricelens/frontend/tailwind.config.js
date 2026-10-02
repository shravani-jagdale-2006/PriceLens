/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF0FF",
          100: "#E0E3FF",
          200: "#C7CCFE",
          300: "#A3ABFD",
          400: "#7F86FB",
          500: "#5B5FEF", // Primary accent
          600: "#494BD1",
          700: "#393AB0",
          800: "#2B2C8C",
          900: "#20216E"
        },
        deal: {
          50: "#E6FBF5",
          100: "#C4F6E7",
          200: "#92EED5",
          300: "#5CE2BF",
          400: "#29D4A7",
          500: "#00C896", // Secondary accent for best deal badges & price drops
          600: "#00A87D",
          700: "#008664",
          800: "#00674D",
          900: "#004B38"
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.72)",
          surfaceHover: "rgba(255, 255, 255, 0.88)",
          card: "rgba(255, 255, 255, 0.65)",
          border: "rgba(255, 255, 255, 0.8)",
          subtle: "rgba(240, 244, 255, 0.45)",
          dark: "rgba(15, 23, 42, 0.75)"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 14px 40px 0 rgba(31, 38, 135, 0.12)',
        'glass-pill': '0 4px 16px 0 rgba(91, 95, 239, 0.20)',
        'glass-deal': '0 4px 20px 0 rgba(0, 200, 150, 0.25)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)'
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
        'deep': '24px'
      },
      animation: {
        'float-slow': 'floatSlow 18s ease-in-out infinite',
        'float-reverse': 'floatReverse 22s ease-in-out infinite',
        'float-drift': 'floatDrift 20s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(40px, -35px) scale(1.08)' }
        },
        floatReverse: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-45px, 30px) scale(0.95)' }
        },
        floatDrift: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(25px, 20px)' },
          '66%': { transform: 'translate(-20px, -25px)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
}
