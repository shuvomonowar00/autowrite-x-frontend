import heropatterns from 'tailwind-heropatterns';
import { jigsaw } from 'tailwind-heropatterns/patterns';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    // Custom scrollbar design 01
    // function ({ addUtilities }) {
    //   const newUtilities = {
    //     '.custom-scrollbar': {
    //       '&::-webkit-scrollbar': {
    //         width: '8px',
    //       },
    //       '&::-webkit-scrollbar-track': {
    //         background: '#f1f1f1',
    //         borderRadius: '9999px',
    //       },
    //       '&::-webkit-scrollbar-thumb': {
    //         background: '#c1c1c1',
    //         borderRadius: '9999px',
    //       },
    //       '&::-webkit-scrollbar-thumb:hover': {
    //         background: '#a8a8a8',
    //       },
    //     },
    //   };
    //   addUtilities(newUtilities);
    // },

    // Custom scrollbar design 02
    function ({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '5px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#EFF6FF', // Light blue background (blue-50)
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#93C5FD', // Blue thumb (blue-300)
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#60A5FA', // Darker blue on hover (blue-400)
          },
        },
      };
      addUtilities(newUtilities);
    },
    // Hero patterns
    require('tailwind-heropatterns')({
      // Enable specific patterns
      patterns: [
        'topography',
        'dots',
        'circuit-board',
        'brick-wall',
        'overlapping-circles',
        'graph-paper',
        'jigsaw',
        'hideout',
        'wallpaper',
        'texture',
      ],
      // Custom colors
      colors: {
        default: '#4B5563',
        blue: '#3B82F6',
      },
      // Opacity variants
      opacity: {
        default: 0.05,
        10: 0.1,
        20: 0.2,
      },
    }),
  ],
};
