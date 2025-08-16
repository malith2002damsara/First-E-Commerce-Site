/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Android Device Specific Breakpoints
      screens: {
        'xs': '475px',
        // Android Phone Breakpoints
        'android-sm': '360px',      // Samsung Galaxy S series, Pixel compact
        'android-md': '390px',      // iPhone equivalent, most modern Android
        'android-lg': '414px',      // Samsung Galaxy Note, Pixel XL
        'android-xl': '430px',      // Large Android phones
        'android-fold': '768px',    // Samsung Galaxy Fold unfolded
        // Tablet specific
        'android-tablet': '800px',  // Android tablets
      },
      // Android-optimized aspect ratios
      aspectRatio: {
        'android-phone': '9 / 16',  // Common Android phone ratio
        'android-wide': '9 / 18',   // Modern Android phones
        'android-fold': '4.2 / 6.2', // Samsung Fold
      },
      // Enhanced image rendering
      backdropBlur: {
        'android': '8px',
      },
      // Android-specific animations
      animation: {
        'android-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'android-bounce': 'bounce 1s ease-in-out infinite',
      },
      // Enhanced transforms for Android performance
      scale: {
        '102': '1.02',
        '108': '1.08',
      }
    },
  },
  plugins: [],
}