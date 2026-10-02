/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: 'var(--color-bg-light)',
          dark: 'var(--color-bg-dark)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          light: 'var(--color-text-light)',
        },
        amber: {
          brand: 'var(--color-primary-amber)',
          hover: 'var(--color-primary-amber-hover)',
          dark: 'var(--color-primary-amber-dark)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          dark: 'var(--color-border-dark)',
        }
      },
      fontFamily: {
        display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        sans: ['Hind', '"Noto Sans Tamil"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.25rem',
        lg: '0.25rem',
        xl: '0.25rem',
        '2xl': '0.25rem',
        '3xl': '0.25rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
