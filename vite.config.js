import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Numele repo-ului pe GitHub → URL: https://USER.github.io/lumea-steagurilor/
export default defineConfig({
  plugins: [react()],
  base: '/lumea-steagurilor/',
})
