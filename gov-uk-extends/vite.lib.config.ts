import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: 'src/lib.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'gov-uk-extends',
    },
    rollupOptions: {
      external: ['@kvzd-design/gov-uk', 'react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
