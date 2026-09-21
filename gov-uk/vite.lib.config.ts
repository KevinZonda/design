import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  css: {
    lightningcss: {
      errorRecovery: true,
    },
  },
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: 'src/lib.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'gov-uk',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
