import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy anterior hacia MailHog API (ya no lo usaremos para crear correos,
      // pero lo dejamos por si quieres seguir consultando la API desde el navegador)
      '/mailhog-api': {
        target: 'http://localhost:8025',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mailhog-api/, '/api/v2')
      },
      // Nuevo proxy hacia el pequeño backend de email (Express + Nodemailer)
      '/email-api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/email-api/, '')
      }
    }
  }
})  