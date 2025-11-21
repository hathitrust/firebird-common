import ResultsItem from './index.svelte';
import MarginDecorator from '../MarginDecorator';

import { userEvent, within } from 'storybook/test';
import { action } from 'storybook/actions';

import { expect } from 'storybook/test';

export default {
  title: 'Designs/Results Item',
  component: ResultsItem,
  decorators: [() => MarginDecorator],
  excludeStories: /.*Data$/,
  globals: {
    viewport: {
      value: 'bsLg',
      isRotated: false,
    },
  },
};

export const FullView = {
  args: {
    visited: false,
  },
};
export const MultipleItems = {
  args: {
    access: 'multiple-items',
    supportsSelection: false,
  },
};
export const SearchOnly = {
  args: {
    access: 'limited-search-only',
    visited: false,
  },
};
export const RegisteredAccess = {
  args: {
    access: 'registered-access',
    visited: false,
  },
};
export const AccessPermitted = {
  args: {
    access: 'limited-access-permitted',
    visited: false,
  },
};
