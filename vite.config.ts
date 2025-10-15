import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import manifest from './src/manifest.config';

export default defineConfig({
  plugins: [
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/_locales',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
  },
});
