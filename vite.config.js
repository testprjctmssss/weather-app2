import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/weather-app2/',  // ← これが超重要
  plugins: [react()],
})