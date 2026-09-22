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
      entry: {
        index: 'src/index.ts',
        components: 'src/components/index.ts',
        extraComponents: 'src/extraComponents/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
