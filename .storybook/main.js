/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  features: {
    interactionsDebugger: true,
  },
  docs: {},
  staticDirs: ['../src/public'],
};
export default config;
