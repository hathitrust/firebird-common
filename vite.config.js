import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import pkg from 'svelte-preprocess';
const { scss } = pkg;
import path from 'node:path';
import glob from 'fast-glob';
import fs from 'fs';

// Find all HTML files and build an object of names and paths to work from
const files = glob
  .sync(path.resolve(__dirname, 'src') + '/**/*.html', { ignore: [(path.resolve(__dirname, 'src') + '/coverage')] })
  .reduce((acc, cur) => {
    // we want to keep the path
    let name = cur
      .replace(path.join(__dirname) + '/src/', '')
      .replace('.html', '')
      .replace('/', '-');

    // let name = path.basename(cur, '.html');
    // console.log(name, '->', cur);

    acc[name] = cur;
    return acc;
  }, {});

const scssOptions = {
  quietDeps: true,
};
// if ( process.env.NODE_ENV == 'development' ) {
//   scssOptions.additionalData = `$firebird-font-path: "//localhost:5173"; $fa-font-path: "//localhost:5173/fonts";`;
// }

const removeStylesheet = () => {
  return {
    name: 'remove-stylesheet',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replaceAll(/<link\s+rel="stylesheet"(\s.*\s)href="(.*)\.css">/gi, "");
    },
  }
}

export default defineConfig({
  plugins: [
    svelte({
      /* plugin options */
      preprocess: [scss({})],
    }),
    //custom vite plugin to rewrite the name of the CSS file in manifest.json
    //hopefully temporary workaround until we can upgrade to svelte 5/vite 6
    {
      name: 'postbuild-commands',
      closeBundle: () => {
        const path = 'dist/manifest.json';
        const manifest = JSON.parse(fs.readFileSync(path).toString());
        if (manifest['style.css']) {
          const newKey = 'index.css';
          manifest[newKey] = manifest['style.css'];
          manifest['index.css'].file = manifest['index.css'].file.replace('style', 'index');
          delete manifest['style.css'];
          fs.writeFileSync(path, JSON.stringify(manifest, null, 2));
        }
      }
    },
   removeStylesheet()
  ],
  root: path.resolve(__dirname, 'src'),
  publicDir: 'public',
  build: {
    manifest: 'manifest.json',
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    //renames the style asset file to index
    //hopefully temporary workaround until we can upgrade to svelte 5/vite 6
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        cloudflare: path.resolve(__dirname, 'src/cloudflare/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
         if (assetInfo.name == 'style.css') {
          return `assets/index-[hash].[ext]`
         }
        return assetInfo;
        },
      },
      external: [
        /^..\/fonts/,
        /^\/common\/firebird/
      ]
    },
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      "~open-props": path.resolve(__dirname, "node_modules/open-props"),
    },
    extensions: ['.mjs', '.js', '.ts', '.json', '.svelte', '.scss'],
  },
  server: {
    // port: 8080,
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
  test: {
    coverage: {
      reporter: 'lcov'
    },
  },
});
