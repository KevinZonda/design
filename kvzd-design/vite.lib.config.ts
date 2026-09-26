import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { stripGovukBranding } from '../build/stripGovukBranding.mjs'

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  css: {
    postcss: { plugins: [stripGovukBranding()] },
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
        kss: 'src/kss/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: (id: string) => ['react', 'react-dom', 'react/jsx-runtime'].includes(id) || id.startsWith('shiki'),
    },
  },
})
