/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        fur: {
          cream: '#FFF8F0',
          beige: '#F5E6D3',
          lightbrown: '#D4A574',
          peach: '#FFB3BA',
          pink: '#FFC0CB',
          softpink: '#F8BBD9',
          lavender: '#E6E6FA',
          sky: '#B8E4F0',
          mint: '#B5EAD7',
          graypurple: '#C7CEEA',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Comic Neue', 'cursive'],
      },
      boxShadow: {
        'fluff': '0 8px 32px rgba(212, 165, 116, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'fur-texture': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"0.03\"/%3E%3C/svg%3E')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
};
