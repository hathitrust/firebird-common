import TwoColumnLayout from './index.svelte';

// import MarginDecorator from '../MarginDecorator';

import { userEvent, within } from 'storybook/test';
import { action } from 'storybook/actions';

import { expect } from 'storybook/test';

export default {
  title: 'Designs/Two Column Layout',
  component: TwoColumnLayout,
  // decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
  globals: {
    viewport: {
      value: 'bsLg',
      isRotated: false,
    },
  },
};

export const Desktop = {
  args: {
    enableBorder: false,
  },
};

export const Narrow = {
  args: {
    enableBorder: false,
  },
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};
