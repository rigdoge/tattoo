import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
