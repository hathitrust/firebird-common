import ResultsList from './index.svelte';
import MarginDecorator from '../MarginDecorator';

import { userEvent, within } from 'storybook/test';
import { action } from 'storybook/actions';

import { expect } from 'storybook/test';

export default {
  title: 'Designs/Results List',
  component: ResultsList,
  decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
  globals: {
    viewport: {
      value: 'bsLg',
      isRotated: false,
    },
  },
};

export const FullText = {};

export const Catalog = {
  args: {
    supportsSelection: false,
  },
};
