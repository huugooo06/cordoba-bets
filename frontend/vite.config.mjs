import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // --- AÑADIR ESTE BLOQUE ---
  server: {
    host: '0.0.0.0', // Esencial para Docker
    port: 5173,
    watch: {
      usePolling: true, // Necesario para que funcione el Hot Reload en Windows con Docker
    }
  }
  // --------------------------
});