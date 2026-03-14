import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        basic: resolve(__dirname, 'demos/basic-terrain/index.html'),
        infinite: resolve(__dirname, 'demos/infinite-terrain/index.html'),
        fog: resolve(__dirname, 'demos/fog-landscape/index.html'),
        alien: resolve(__dirname, 'demos/alien-world/index.html')
      }
    }
  }
});
