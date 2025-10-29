# 🔧 Configuración de la API

## ⚠️ IMPORTANTE: Cómo cambiar la URL del backend

Para cambiar la URL del backend, debes modificar **DOS archivos:**

### 1️⃣ Archivo principal de configuración
📄 **`src/config/api.ts`**

```typescript
// Para producción
export const API_URL = 'https://pwa-back-35rf.onrender.com';

// Para desarrollo local
// export const API_URL = 'http://localhost:3001';
```

### 2️⃣ Service Worker
📄 **`public/sw.js`** (línea ~5)

```javascript
let API_BASE_URL = 'https://pwa-back-35rf.onrender.com';

// Para desarrollo local:
// let API_BASE_URL = 'http://localhost:3001';
```

---

## 📝 Checklist al cambiar la URL:

- [ ] ✅ Cambiar `API_URL` en `src/config/api.ts`
- [ ] ✅ Cambiar `API_BASE_URL` en `public/sw.js`
- [ ] ✅ Ejecutar `npm run build`
- [ ] ✅ Verificar que ambas URLs sean **exactamente iguales**

---

**🎯 Importante:** Las dos URLs deben ser iguales para que la aplicación funcione correctamente.
