import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:3001';

// 🔑 Clave pública VAPID específica para pwa_back
const VAPID_PUBLIC_KEY = "BA0QfSuyhYW-m1x5YfN26hbr2wC1J5SLzT3_mRI3d0BOreMLoJN7bktyihkny_gh2XQ0uK9C7yRsOY7dWoI_UYE";

export const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convertir clave VAPID
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Suscribirse a notificaciones push
  const subscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Iniciando proceso de suscripción...');
      
      // Verificar soporte
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker no soportado');
      }
      
      if (!('PushManager' in window)) {
        throw new Error('Push Manager no soportado');
      }

      // Solicitar permisos
      console.log('📋 Solicitando permisos...');
      const permission = await Notification.requestPermission();
      console.log('📋 Permiso recibido:', permission);
      
      if (permission !== 'granted') {
        throw new Error('Permiso denegado para notificaciones');
      }

      // Esperar service worker
      console.log('⚙️ Esperando service worker...');
      const reg = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker listo');

      // Verificar si ya existe suscripción
      let subscription = await reg.pushManager.getSubscription();
      
      if (subscription) {
        console.log('✅ Ya existe una suscripción:', subscription);
      } else {
        console.log('📝 Creando nueva suscripción...');
        
        // Intentar múltiples estrategias para evitar AbortError
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts && !subscription) {
          try {
            console.log(`🔄 Intento ${attempts + 1} de ${maxAttempts}...`);
            
            // Estrategia 1: Configuración estándar
            if (attempts === 0) {
              subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
            }
            // Estrategia 2: Sin userVisibleOnly
            else if (attempts === 1) {
              subscription = await reg.pushManager.subscribe({
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
            }
            // Estrategia 3: Con timeout personalizado
            else {
              const subscribePromise = reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
              
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout en suscripción')), 10000)
              );
              
              subscription = await Promise.race([subscribePromise, timeoutPromise]) as PushSubscription;
            }
            
            console.log('✅ Suscripción creada:', subscription);
            break;
            
          } catch (error) {
            attempts++;
            console.error(`❌ Error en intento ${attempts}:`, error);
            
            if (attempts < maxAttempts) {
              console.log('⏳ Esperando 3 segundos antes del siguiente intento...');
              await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
              throw error;
            }
          }
        }
        
        if (!subscription) {
          throw new Error('No se pudo crear la suscripción después de múltiples intentos');
        }
      }

      // Enviar al servidor
      console.log('📤 Enviando suscripción al servidor...');
      const response = await fetch(`${BACKEND_URL}/api/notifications/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('✅ Suscripción enviada al servidor correctamente');
        setIsSubscribed(true);
      } else {
        throw new Error(`Error enviando suscripción: ${response.status}`);
      }
      
    } catch (error) {
      console.error('❌ Error en suscripción:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar suscripciones
  const unsubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🧹 Limpiando suscripciones...');
      
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        
        if (subscription) {
          console.log('🗑️ Eliminando suscripción existente...');
          const success = await subscription.unsubscribe();
          console.log('✅ Suscripción eliminada:', success);
        }
        
        // Actualizar service worker
        console.log('🔄 Actualizando service worker...');
        await reg.update();
        
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('❌ Error limpiando suscripciones:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar notificación de prueba
  const sendTestNotification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Enviando notificación de prueba...');
      
      const res = await fetch(`${BACKEND_URL}/api/notifications/send-notification`, {
        method: 'POST',
        body: JSON.stringify({
          title: '🎉 ¡TechStore Notificación!',
          body: 'Las notificaciones push están funcionando correctamente',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          data: {
            url: window.location.origin,
            timestamp: Date.now()
          }
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Notificación enviada:', data);
        return data;
      } else {
        throw new Error(`Error enviando notificación: ${res.status}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar notificación cuando se agrega producto al carrito
  const sendCartNotification = async (productName: string, productPrice: string, cartCount: number, cartTotal: number) => {
    try {
      console.log('🛒 Enviando notificación de carrito...');
      
      const res = await fetch(`${BACKEND_URL}/api/notifications/cart-notification`, {
        method: 'POST',
        body: JSON.stringify({
          productName,
          productPrice,
          cartCount,
          cartTotal
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Notificación de carrito enviada:', data);
        return data;
      } else {
        console.warn('⚠️ Error enviando notificación de carrito:', res.status);
      }
    } catch (error) {
      console.warn('⚠️ Error enviando notificación de carrito:', error);
      // No mostrar error al usuario, es solo una notificación adicional
    }
  };

  // Verificar estado inicial
  useEffect(() => {
    const checkSubscription = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const reg = await navigator.serviceWorker.ready;
          const subscription = await reg.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error('Error verificando suscripción:', error);
        }
      }
    };

    checkSubscription();
  }, []);

  return {
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    sendCartNotification
  };
};
