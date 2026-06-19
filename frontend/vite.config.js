import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker container mapping
    port: 5173,
    watch: {
      usePolling: true // Ensures hot-reload works smoothly inside Docker
    }
  }
})
