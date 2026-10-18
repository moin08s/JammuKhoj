import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-soft': 'var(--color-primary-soft)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        stone: 'var(--color-stone)',
        accent: 'var(--color-accent)',
        'accent-ink': 'var(--color-accent-ink)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warn: 'var(--color-warn)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        control: '10px',
        card: '14px',
        sheet: '20px',
      },
      spacing: {
        '1u': '4px',
        '2u': '8px',
        '3u': '12px',
        '4u': '16px',
        '6u': '24px',
        '8u': '32px',
        '12u': '48px',
      },
      maxWidth: {
        content: '640px',
      },
      boxShadow: {
        sheet: '0 -2px 16px rgba(16, 37, 43, 0.08)',
        toast: '0 4px 12px rgba(16, 37, 43, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
