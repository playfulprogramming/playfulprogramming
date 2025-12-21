import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
        // Simulate `useScroll` being in a dependency, therefore not covered by Babel
        exclude: ['src/useScroll.js'],
      },
    }),
  ],
});
