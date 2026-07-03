import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/v1/instants': {
        target: 'https://www.myinstants.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})