import AdvancedSearchForm from './index.svelte';
import { userEvent, within } from "@storybook/test";

export default {
  title: 'AdvancedSearchForm',
  component: AdvancedSearchForm,
};

export const MobileDefault = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  },
};

export const DefaultDesktop = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
  },
};
