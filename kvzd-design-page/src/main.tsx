import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@kevinzonda/design'
import '@kevinzonda/design/style.css'
import './pages/index.css'
import App from './pages/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider palette={{
        brand: '#000000',
        templateBackground: '#eeeeee',
        surfaceBackground: '#eeeeee' }}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
