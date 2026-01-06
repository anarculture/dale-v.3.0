import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fd5810', // Orange
          light: '#ff7733', 
          dark: '#e34b0a', 
        },
        secondary: {
          DEFAULT: '#fc5e59', // Coral
          light: '#fd7e7a',
          dark: '#e04f4a',
        },
        accent: {
          DEFAULT: '#ffa53c', // Amber
          light: '#ffb966',
          dark: '#e6902b',
        },
        surface: {
          DEFAULT: '#fffbf3', // Cream
          50: '#ffffff',
          100: '#fffbf3', // Base cream
          200: '#fdf3e0',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#ffa53c', // Using accent for warning
          light: '#ffb966',
          dark: '#e6902b',
        },
        neutral: {
          DEFAULT: '#1a1a1a', // Near black for text
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Agrandir', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(253, 88, 16, 0.12)',
        'card-hover': '0 8px 24px rgba(253, 88, 16, 0.18)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    forms,
    heroui(),
  ],
};
export default config;
