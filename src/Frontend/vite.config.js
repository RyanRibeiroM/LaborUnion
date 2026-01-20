import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// URL da API Backend
const API_URL = 'http://localhost:5260';

// Rotas da API
const apiRoutes = [
  '/dashboard',
  '/document',
  '/farmer',
  '/login',
  '/sector',
  '/servicetype',
  '/service',
  '/token',
  '/user'
];

// Gera configuração de proxy para cada rota
const generateProxy = (routes, target) => {
  return routes.reduce((acc, route) => {
    acc[route] = { target, changeOrigin: true };
    return acc;
  }, {});
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5260', // URL da API (Alterar conforme necessário)
        changeOrigin: true,
        secure: false, // Ignora erros de certificado SSL auto-assinado
      }
    }
  }
})
