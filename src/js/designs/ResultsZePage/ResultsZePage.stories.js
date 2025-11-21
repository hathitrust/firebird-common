import ResultsZePage from './index.svelte';

export default {
  title: 'Designs/Results Page',
  component: ResultsZePage,
  excludeStories: /.*Data$/,
  globals: {
    viewport: {
      value: 'bsLg',
      isRotated: false,
    },
  },
};

export const FullText = {};
