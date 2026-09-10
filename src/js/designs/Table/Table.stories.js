import Table from './index.svelte';

export default {
  title: 'Designs/Table',
  component: Table,
};

export const MobileDefault = {
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};

export const Default = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
