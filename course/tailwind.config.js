module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './docs/**/*.{md,mdx}', './i18n/**/*.{md,mdx}'],
  corePlugins: {preflight: false},
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        secondary: '#1E3A8A',
        accent: '#EA580C',
        sector: {
          afolu: '#15803D',
          energy: '#D97706',
          ippu: '#7C3AED',
          ce: '#0891B2',
          socio: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
