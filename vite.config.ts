import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This will proxy any request starting with /api to your Netlify Functions server
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/.netlify/functions'),
      },
    },
  },
  build: {
    // Set a specific ECMAScript target for broader browser compatibility.
    // 'es2020' is a good balance, supporting features like optional chaining
    // while being compatible with the vast majority of modern browsers.
    target: 'es2020',
    rollupOptions: {
      // By removing `framer-motion` from externals, we ensure it gets bundled
      // into the production build. This makes the app more robust and removes
      // the runtime dependency on the esm.sh CDN.
    }
  }
})