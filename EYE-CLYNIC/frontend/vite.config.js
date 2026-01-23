import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
        includeAssets: ['./public/icon-192.jpg', './public/icon-512.jpg'],
      manifest: {
        name: 'Eye Clinic Management System',
        short_name: 'Eye Clinic',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f766e',
        icons: [
          { src: './public/icon-192.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: './public/icon-512.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      }
    })
  ]
})
