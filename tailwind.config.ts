import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          strong: 'hsl(var(--accent-strong))',
          soft: 'hsl(var(--accent-soft))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        highlight: {
          DEFAULT: 'hsl(var(--highlight))',
          soft: 'hsl(var(--highlight-soft))',
        },
        surface: {
          elevated: 'hsl(var(--background-elevated))',
          deep: 'hsl(var(--background-deep))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 3px)',
        sm: 'calc(var(--radius) - 6px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        // 分层奢华阴影体系(由浅到深)
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card': '0 2px 6px -2px hsl(235 50% 20% / 0.15), 0 1px 3px 0 hsl(235 50% 20% / 0.08)',
        'luxury-sm':
          '0 1px 0 0 hsl(0 0% 100% / 0.7) inset, 0 8px 20px -12px hsl(235 70% 20% / 0.22)',
        'luxury-md':
          '0 1px 0 0 hsl(0 0% 100% / 0.8) inset, 0 16px 40px -18px hsl(235 70% 20% / 0.3), 0 6px 14px -8px hsl(235 70% 20% / 0.2)',
        'luxury-lg':
          '0 1px 0 0 hsl(0 0% 100% / 0.9) inset, 0 32px 70px -28px hsl(235 70% 25% / 0.38), 0 14px 28px -14px hsl(235 70% 20% / 0.28)',
        'glow-accent':
          '0 0 0 1px hsl(var(--accent) / 0.15), 0 0 30px hsl(var(--accent) / 0.25), 0 14px 30px -10px hsl(var(--accent-strong) / 0.35)',
      },
      backgroundImage: {
        'grad-primary': 'var(--grad-primary)',
        'grad-highlight': 'var(--grad-highlight)',
        'grad-surface': 'var(--grad-surface)',
        'grid-hero':
          'linear-gradient(to right, hsl(var(--border) / 0.55) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.55) 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out both',
        'float-y': 'floatY 8s ease-in-out infinite',
        'shimmer-x': 'shimmerMove 7s ease-in-out infinite',
        'shine': 'shine 2.2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmerMove: {
          '0%, 100%': { backgroundPosition: '120% 0' },
          '50%': { backgroundPosition: '-20% 0' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
