import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to AWS
      '/api': {
        target: 'https://7vqththcwd.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/test'),
        secure: false,
      },
    },
  },
})