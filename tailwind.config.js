/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        'primary-dark': '#B5952F',
        secondary: '#0A192F',
        'secondary-light': '#172A46',
      },
    },
  },
  plugins: [],
}
