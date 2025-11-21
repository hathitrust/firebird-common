import CollectionSearchForm from './index.svelte';
import MarginDecorator from '../MarginDecorator';

export default {
  title: 'Designs/Collection Search Form',
  component: CollectionSearchForm,
  decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
  globals: {
    viewport: {
      value: 'bsLg',
      isRotated: false,
    },
  },
};

export const SeachForm = {};
