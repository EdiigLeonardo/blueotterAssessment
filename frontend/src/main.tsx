import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { StorageProvider } from './context/storage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StorageProvider>
  </StrictMode>,
)
