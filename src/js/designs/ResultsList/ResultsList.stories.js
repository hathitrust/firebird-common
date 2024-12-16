import ResultsList from './index.svelte';
import MarginDecorator from '../MarginDecorator';

import { userEvent, within } from "@storybook/test";
import { action } from '@storybook/addon-actions';

import { expect } from "@storybook/test";

export default {
  title: 'Designs/Results List',
  component: ResultsList,
  decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
};

const parameters = {
  viewport: {
    defaultViewport: 'bsLg',
  },
};

export const FullText = {
  parameters: parameters,
};

export const Catalog = {
  parameters: parameters,
  args: {
    supportsSelection: false,
  },
};
