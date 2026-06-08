import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import path from 'node:path';
import fs from 'node:fs';

const scssOptions = {
  quietDeps: true,
};

// removes the stylesheet from cloudflare.html
const removeStylesheet = () => {
  return {
    name: 'remove-stylesheet',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replaceAll(/<link\s+rel="stylesheet"(\s.*\s)href="(.*)\.css">/gi, '');
    },
  };
};

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        scss: {},
      }),
    }),
    //custom vite plugin to rewrite the name of the CSS key in manifest.json
    //from 'style.css' (the name of our scss file) to 'index.css' (all of our apps expect that key)
    {
      name: 'postbuild-commands',
      writeBundle: () => {
        const path = 'dist/manifest.json';
        const manifest = JSON.parse(fs.readFileSync(path).toString());
        if (manifest['style.css']) {
          manifest['index.css'] = manifest['style.css'];
          delete manifest['style.css'];
          fs.writeFileSync(path, JSON.stringify(manifest, null, 2));
        }
      },
    },
    removeStylesheet(),
  ],
  root: path.resolve(import.meta.dirname, 'src'),
  publicDir: 'public',
  build: {
    manifest: 'manifest.json',
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, 'src/index.html'),
        cloudflare: path.resolve(import.meta.dirname, 'src/cloudflare/cloudflare.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((name) => name.endsWith('.css'))) {
            return `assets/index-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      external: [/^..\/fonts/, /^\/common\/firebird/],
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.json', '.svelte', '.scss'],
  },
  server: {
    hot: true,
    proxy: {
      '^/cgi/ping': {
        target: 'https://babel.hathitrust.org',
        changeOrigin: true,
      },
      '^/cgi/ls': {
        target: 'https://dev-3.babel.hathitrust.org',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: scssOptions,
    },
  },
});
