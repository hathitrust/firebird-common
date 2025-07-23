import ResultsItem from './index.svelte';
import MarginDecorator from '../MarginDecorator';

import { userEvent, within } from "@storybook/test";
import { action } from '@storybook/addon-actions';

import { expect } from "@storybook/test";

export default {
  title: 'Designs/Results Item',
  component: ResultsItem,
  decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
};

const parameters = {
  viewport: {
    defaultViewport: 'bsLg',
  },
};

export const FullView = {
  parameters: parameters,
  args: {
    visited: false,
  }
};
export const MultipleItems = {
  parameters: parameters,
  args: {
    access: 'multiple-items',
    supportsSelection: false,
  },
};
export const SearchOnly = {
  parameters: parameters,
  args: {
    access: 'limited-search-only',
    visited: false,
  },
};
export const RegisteredAccess = {
  parameters: parameters,
  args: {
    access: 'registered-access',
    visited: false,
  },
};
export const AccessPermitted = {
  parameters: parameters,
  args: {
    access: 'limited-access-permitted',
    visited: false,
  },
};
