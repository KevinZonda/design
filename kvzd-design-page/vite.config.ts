import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { stripGovukBranding } from '../build/stripGovukBranding.mjs'

// https://vite.dev/config/
export default defineConfig({
  base: `${process.env.SITE_BASE_PATH?.replace(/\/+$/, '') ?? ''}/`,
  plugins: [react()],
  css: {
    postcss: { plugins: [stripGovukBranding()] },
    lightningcss: {
      errorRecovery: true,
    },
  },
})
