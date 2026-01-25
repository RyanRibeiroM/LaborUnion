import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = 'http://localhost:5260';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas as chamadas que começam com /api são redirecionadas para o backend
      // e o prefixo /api é removido (rewrite)
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})