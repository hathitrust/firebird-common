import AdvancedSearchForm from './index.svelte';
import { userEvent, within } from 'storybook/test';

export default {
  title: 'AdvancedSearchForm',
  component: AdvancedSearchForm,
};

export const MobileDefault = {
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};

export const DefaultDesktop = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
