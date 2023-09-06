import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/translateApi': {
        // target: process.env.VITE_TRANSLATION_API_URL,
        target: 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/translateApi/, ''),
      },
      '/chatApi': {
        target: 'https://api-mebo.dev/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatApi/, ''),
      }
    }
  }
})
