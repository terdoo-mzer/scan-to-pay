import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({ 
      registerType: 'autoUpdate' ,
      devOptions: {
        enabled: true
      },
      manifest: {
        "name": "Scan 2 Shop",
        "short_name": "S2S",
        "start_url": "https://scan-to-pay.vercel.app/dashboard",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#fff",
        "theme_color": "#ff3385",
        "icons": [
          {
            "src": "icons/s2s.png",
            "type": "image/png",
            "sizes": "512x512"
         },
        ],
        "description": "Scan To Shop. A revolutionary way to shop!",
        "lang": "en",
        "categories": ['ecommerce'],
        "screenshots": [
          {
            "src": "icons/shop2scan.png",
            "type": "image/png",
            "sizes": "540x720",
            "form_factor": "narrow"
          },
        ],
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
