/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0077B6',
        'medical-light-blue': '#00B4D8',
        'medical-dark-blue': '#03045E',
        'medical-green': '#52B788',
        'medical-light-green': '#95D5B2',
        'medical-white': '#F8F9FA',
        'medical-gray': '#495057',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 119, 182, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 119, 182, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
