import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#2c3e50',
          50: '#f4f6f8',
          100: '#e9edf1',
          200: '#cad3df',
          300: '#abb9cd',
          400: '#6d86a9',
          500: '#2c3e50',
          600: '#273848',
          700: '#212f3c',
          800: '#1b2631',
          900: '#161f28',
          dark: '#1b2631',
        },
        burgundy: {
          DEFAULT: '#bc1929',
          50: '#fdf2f2',
          100: '#fbe4e4',
          200: '#f7ccd0',
          300: '#f1a6ad',
          400: '#e87581',
          500: '#bc1929',
          600: '#a31523',
          700: '#8c121e',
          800: '#750f19',
          900: '#610c14',
          dark: '#a31523',
        },
        background: '#f8f9fa',
        dark: {
          DEFAULT: '#1a1a2e',
          light: '#2c3e50',
          lighter: '#34495e',
        },
        accent: '#27ae60',
        gold: {
          DEFAULT: '#c9a84c',
          light: '#d4af37',
          dark: '#996515',
        },
        cream: {
          DEFAULT: '#fdfcf0',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(201, 168, 76, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
