import { defineConfig, mergeConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reporter: 'lcov',
      },
      projects: [
        {
          plugins: [
            svelte({
              hot: false,
              compilerOptions: { hydratable: true },
            }),
          ],
          test: {
            name: 'default',
            include: ['**/*.test.js'],
            exclude: ['**/*.stories.js'],
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(import.meta.dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            root: path.resolve(import.meta.dirname),
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
            setupFiles: ['./.storybook/vitest.setup.js'],
          },
        },
      ],
    },
  })
);
