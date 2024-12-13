import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],

  server: {
    open: true,
    host: 'localhost',
    port: 5174,
  },

  build: {
    outDir: 'dist',
  },
};
