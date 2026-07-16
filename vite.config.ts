import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Para la búsqueda
      '/api/v1/instants': {
        target: 'https://www.myinstants.com',
        changeOrigin: true,
        secure: false,
      },
      // Para los archivos de audio (NUEVO)
      '/media/sounds': {
        target: 'https://www.myinstants.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})