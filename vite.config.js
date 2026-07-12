import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: /lumea-steagurilor/
// Capacitor / local preview relative: ./
// Override: VITE_BASE=./ npm run build
const base = process.env.VITE_BASE || '/lumea-steagurilor/'

export default defineConfig({
  plugins: [react()],
  base,
})
