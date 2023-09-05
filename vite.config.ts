import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
      // '/api': {
        target: process.env.VITE_API_URL,
        // target: 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/genera_en_ja/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
