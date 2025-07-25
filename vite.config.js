import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Specifies which IP address Vite should listen on
    port: 5173, // Specifies which port number to use
  },
});
