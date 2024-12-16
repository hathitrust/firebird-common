import Footer from './index.svelte';
import { userEvent, within } from "@storybook/test";

export default {
  title: 'Footer',
  component: Footer,
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
