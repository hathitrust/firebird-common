/** @type { import('@storybook/svelte-vite').StorybookConfig } */

const config = {
  framework: '@storybook/svelte-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
  ],
  features: {
    interactions: true,
  },
  docs: {},
  staticDirs: ['../src/public'],
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');

    if (configType === 'PRODUCTION') {
      config.plugins = config.plugins.filter((plugin) => {
        return plugin.name != 'postbuild-commands';
      });
    }
    return mergeConfig(config, {
      //this plugin is a (hopefully) temporary workaround for storybook not picking up our local styles
      //we use an alias to reference bootstrap styles and they weren't getting picked up by storybook at all during prod build
      //if we only used storybook for dev, I would've never seen this issue, but chromatic builds for prod for our snapshots
      plugins: [
        {
          name: 'inject-preview-css',
          enforce: 'post',
          generateBundle(options, bundle) {
            //find the style.css chunk
            const cssChunk = Object.values(bundle).find(
              (chunk) => chunk.type === 'asset' && chunk.name === 'style.css'
            );

            if (cssChunk) {
              const iframeHtml = Object.values(bundle).find(
                (chunk) => chunk.type === 'asset' && chunk.fileName === 'iframe.html'
              );

              if (iframeHtml) {
                iframeHtml.source = iframeHtml.source.replace(
                  '</head>',
                  `  <link rel="stylesheet" href="./${cssChunk.fileName}">\n</head>`
                );
              }
            }
          },
        },
      ],
      build: {
        cssCodeSplit: false,
        rollupOptions: {
          external: [/^..\/fonts/, /^\/common\/firebird/],
        },
      },
    });
  },
};
export default config;
