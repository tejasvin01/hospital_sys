import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcssVite from '@tailwindcss/vite';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    react(),
    tailwindcssVite(),
  ],
})
