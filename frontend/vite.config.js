import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acessar via IP local
    port: 5173,
    watch: {
      usePolling: true, // útil se estiver em WSL, Docker ou rede lenta
    },
  },
});

