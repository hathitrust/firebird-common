/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y'
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
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');

    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
      config.plugins = config.plugins.filter((plugin) => {
        return plugin.name != 'postbuild-commands';
      });
    }
    return mergeConfig(config, {
      // Your environment configuration here
      build: {
        rollupOptions: {
          external: [/^..\/fonts/, /^\/common\/firebird/],
        },
      },
    });
  },
};
export default config;
