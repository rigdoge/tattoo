import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      external: [
        'typescript',
        '@loaders.gl/core',
        '@loaders.gl/las',
        '@loaders.gl/ply',
        '@loaders.gl/draco',
        '@loaders.gl/gltf'
      ]
    }
  }
})
