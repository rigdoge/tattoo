import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        id: '/',
        name: 'Globe Artists',
        short_name: 'Globe Artists',
        description: 'A globe visualization of tattoo artists around the world',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'any',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.svg',
            sizes: '1920x1080',
            type: 'image/svg+xml',
            form_factor: 'wide',
            label: 'Globe Artists Desktop View'
          },
          {
            src: '/screenshots/mobile.svg',
            sizes: '750x1334',
            type: 'image/svg+xml',
            label: 'Globe Artists Mobile View'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true
      }
    }),
    {
      name: 'handle-three-webgpu',
      enforce: 'pre',
      config(config, { command }) {
        return {
          optimizeDeps: {
            esbuildOptions: {
              plugins: [
                {
                  name: 'webgpu-stub',
                  setup(build) {
                    build.onResolve({ filter: /^three\/webgpu$/ }, () => ({
                      path: 'three/webgpu',
                      namespace: 'webgpu-stub'
                    }))
                    build.onLoad({ filter: /.*/, namespace: 'webgpu-stub' }, () => ({
                      contents: `
                        export class WebGPURenderer {
                          constructor() {
                            throw new Error('WebGPU is not supported in this build');
                          }
                        }
                        export const isWebGPUAvailable = false;
                        export default { WebGPURenderer, isWebGPUAvailable };
                      `
                    }))
                  }
                }
              ]
            }
          }
        }
      },
      resolveId(source) {
        if (source === 'three/webgpu') {
          return {
            id: 'virtual:webgpu-stub',
            moduleSideEffects: false
          }
        }
      },
      load(id) {
        if (id === 'virtual:webgpu-stub') {
          return `
            export class WebGPURenderer {
              constructor() {
                throw new Error('WebGPU is not supported in this build');
              }
            }
            export const isWebGPUAvailable = false;
            export default { WebGPURenderer, isWebGPUAvailable };
          `
        }
      }
    }
  ],
  base: './',
  optimizeDeps: {
    exclude: ['three/examples/jsm/renderers/webgpu/*'],
    include: ['three', 'react-globe.gl']
  },
  resolve: {
    dedupe: ['three', 'react', 'react-dom']
  },
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
      ],
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'three': ['three'],
          'globe': ['react-globe.gl']
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      exclude: [/node_modules\/three/]
    }
  }
})
