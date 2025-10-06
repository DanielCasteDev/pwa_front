import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApiProvider, API_BASE_URL } from './config/ApiContext.tsx'

// Registrar el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registrado:', registration.scope);
        // Forzar activación inmediata si hay un SW en espera
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        const sendApiBaseToSw = () => {
          if (registration.active) {
            registration.active.postMessage({ type: 'SET_API_BASE_URL', baseUrl: API_BASE_URL });
            return true;
          }
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SET_API_BASE_URL', baseUrl: API_BASE_URL });
            return true;
          }
          return false;
        };

        // Intento inmediato
        if (!sendApiBaseToSw()) {
          // Intento cuando esté listo
          navigator.serviceWorker.ready.then(() => {
            sendApiBaseToSw();
          });
        }

        // Reintentar al cambiar de controlador (nuevo SW tomando control)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          sendApiBaseToSw();
        });
      })
      .catch((error) => {
        console.error('❌ SW error:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider baseUrl={API_BASE_URL}>
      <App />
    </ApiProvider>
  </StrictMode>,
)