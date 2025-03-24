import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslint(),react()],
  base: './',
  build: {
    outDir: 'dist-react',
  },
  server: {
    port: 5123,
    strictPort: true,
  },
});
