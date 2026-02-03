
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Đảm bảo Rollup xử lý tốt các module từ node_modules
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
          ai: ['@google/genai']
        }
      }
    }
  }
});
