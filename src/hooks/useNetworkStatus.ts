import { useEffect, useState, useRef } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStatusRef = useRef(navigator.onLine);

  useEffect(() => {
    // Inicializar el estado de referencia
    lastStatusRef.current = navigator.onLine;
    
    const handleOnline = () => {
      if (lastStatusRef.current !== true) {
        console.log('🟢 Network: Online detected');
        lastStatusRef.current = true;
        setIsOnline(true);
      }
    };

    const handleOffline = () => {
      if (lastStatusRef.current !== false) {
        console.log('🔴 Network: Offline detected');
        lastStatusRef.current = false;
        setIsOnline(false);
      }
    };

    // Escuchar mensajes del service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NETWORK_OFFLINE') {
        if (lastStatusRef.current !== false) {
          console.log('🔴 Network: Service worker detected offline');
          lastStatusRef.current = false;
          setIsOnline(false);
        }
      }
    };

    // Función simplificada para verificar conexión
    const checkConnection = async () => {
      try {
        // Usar un endpoint externo confiable para verificar internet
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (lastStatusRef.current !== true) {
          console.log('🟢 Network: Connection restored');
          lastStatusRef.current = true;
          setIsOnline(true);
        }
      } catch {
        if (lastStatusRef.current !== false) {
          console.log('🔴 Network: Connection lost');
          lastStatusRef.current = false;
          setIsOnline(false);
        }
      }
    };

    // Escuchar eventos del navegador
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Escuchar mensajes del service worker si está disponible
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Verificar conexión cada 60 segundos (menos frecuente para evitar spam)
    intervalRef.current = setInterval(checkConnection, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOnline]);

  return {
    isOnline,
    isOffline: !isOnline
  };
};