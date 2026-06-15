import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // npm run dev 실행 시 Chrome 자동 실행
    open: 'http://localhost:5173',
    browser: 'chrome',
  },
});
