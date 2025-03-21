import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing `.jsx` without specifying extension
  },
  build: {
    outDir: 'dist',
  },
  base: '/Culture-Shock/',
})
