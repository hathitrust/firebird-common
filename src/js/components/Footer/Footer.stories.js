import Footer from './index.svelte';
import { userEvent, within } from "storybook/test";

export default {
  title: 'Footer',
  component: Footer,
};

export const MobileDefault = {
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false
    }
  },
};

export const DefaultDesktop = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false
    }
  },
};
