/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5ca',
          300: '#8dd1a5',
          400: '#57b57c',
          500: '#1F4D3E', // Primary green
          600: '#1a4034',
          700: '#15352a',
          800: '#102a21',
          900: '#0b1f18',
        },
        secondary: {
          50: '#fdfef6',
          100: '#fafbe9',
          200: '#f2f5d0',
          300: '#e6eca7',
          400: '#d4de73',
          500: '#C5A762', // Gold accent
          600: '#b8964a',
          700: '#99783d',
          800: '#7b5f33',
          900: '#644d2b',
        },
        accent: {
          50: '#fef7f0',
          100: '#feeedc',
          200: '#fcd9b8',
          300: '#f9bc89',
          400: '#f59551',
          500: '#C5A762', // Same as secondary for consistency
          600: '#b8964a',
          700: '#99783d',
          800: '#7b5f33',
          900: '#644d2b',
        },
        background: '#F7F3ED',
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1F4D3E 0%, #2E6653 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C5A762 0%, #D4B877 100%)',
        'texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}