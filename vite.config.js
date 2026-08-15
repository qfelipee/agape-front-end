import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico'],
  manifest: {
    name: 'Agape Financeiro',
    short_name: 'Agape',
    description: 'Sistema de gestão financeira da Igreja Batista Agape',
    theme_color: '#f5a623',
    background_color: '#0d0d0d',
    display: 'standalone',
    start_url: '/',
    icons: [
      // mantém exatamente como já está configurado no seu projeto
    ],
  },
}),
