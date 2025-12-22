/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // TMDB Brand Colors
        primary: '#01B4E4',      // TMDB Light Blue
        secondary: '#90CEA1',    // TMDB Light Green
        accent: '#01D277',       // TMDB Green
        
        // Dark Theme
        dark: {
          100: '#0D253F',        // TMDB Dark Blue (Primary)
          200: '#1A1A2E',        // Darker background
          300: '#16213E',        // Card background
          400: '#0F3460',        // Elevated surface
        },
        
        // Light colors
        light: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#E0E0E0',
        },
        
        // Rating colors
        rating: {
          high: '#21D07A',       // Green for high ratings
          medium: '#D2D531',     // Yellow for medium
          low: '#DB2360',        // Red for low ratings
        }
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        semibold: ['System'],
        bold: ['System'],
      },
    },
  },
  plugins: [],
}