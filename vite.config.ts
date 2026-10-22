import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures assets resolve correctly on GitHub Pages, Vercel, and custom domains
  plugins: [
    tailwindcss(),
    react()
  ],
})
