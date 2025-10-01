import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Plugin manual para copiar el SW
    {
      name: 'copy-sw-manual',
      closeBundle() {
        const srcPath = resolve(__dirname, 'public/sw.js')
        const destPath = resolve(__dirname, 'dist/sw.js')
        
        if (existsSync(srcPath)) {
          try {
            copyFileSync(srcPath, destPath)
            console.log('✅ Service Worker copiado exitosamente a dist/sw.js')
          } catch (err) {
            console.error('❌ Error copiando Service Worker:', err)
          }
        } else {
          console.error('❌ No se encontró public/sw.js')
        }
      }
    }
  ]
})