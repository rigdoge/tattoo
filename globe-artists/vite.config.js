import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-three-imports',
      enforce: 'pre',
      resolveId(source) {
        if (source === 'three/tsl') {
          return {
            id: 'virtual:three-tsl-stub',
            moduleSideEffects: false
          }
        }
        if (source === 'three/webgpu') {
          return {
            id: 'virtual:webgpu-stub',
            moduleSideEffects: false
          }
        }
      },
      load(id) {
        if (id === 'virtual:three-tsl-stub') {
          return `
            export const Fn = {};
            export const If = {};
            export const uniform = {};
            export const storage = {};
            export const float = {};
            export const instanceIndex = {};
            export const Loop = {};
            export const sqrt = {};
            export const sin = {};
            export const cos = {};
            export const asin = {};
            export const exp = {};
            export const negate = {};
          `
        }
        if (id === 'virtual:webgpu-stub') {
          return `
            export class WebGPURenderer {
              constructor() {
                throw new Error('WebGPU is not supported in this build');
              }
            }
            export class StorageInstancedBufferAttribute {
              constructor() {
                throw new Error('WebGPU is not supported in this build');
              }
            }
            export const isWebGPUAvailable = false;
            export default { WebGPURenderer, StorageInstancedBufferAttribute, isWebGPUAvailable };
          `
        }
      }
    }
  ],
  base: './',
  optimizeDeps: {
    include: ['three', 'react-globe.gl'],
    exclude: ['three/webgpu', 'three/tsl'],
    esbuildOptions: {
      plugins: [
        {
          name: 'exclude-three-webgpu',
          setup(build) {
            build.onResolve({ filter: /^three\/webgpu$/ }, () => ({
              path: 'three/webgpu',
              namespace: 'three-stub'
            }))
            build.onLoad({ filter: /.*/, namespace: 'three-stub' }, () => ({
              contents: `
                export class WebGPURenderer {
                  constructor() {
                    throw new Error('WebGPU is not supported in this build');
                  }
                }
                export class StorageInstancedBufferAttribute {
                  constructor() {
                    throw new Error('WebGPU is not supported in this build');
                  }
                }
                export const isWebGPUAvailable = false;
                export default { WebGPURenderer, StorageInstancedBufferAttribute, isWebGPUAvailable };
              `
            }))
          }
        }
      ]
    }
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
    }
  },
  server: {
    cors: true,
    host: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
})
