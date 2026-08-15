import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
          {
            src: 'favicon-igreja.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicon-igreja.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})