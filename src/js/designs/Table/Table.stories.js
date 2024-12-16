import Table from './index.svelte';
import { userEvent, within } from "@storybook/test";
import { expect } from "@storybook/test";

export default {
  title: 'Designs/Table',
  component: Table,
};

export const Default = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
  },
};
