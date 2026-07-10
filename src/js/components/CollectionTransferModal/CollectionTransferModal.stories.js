import CollectionTransferModal from './index.svelte';
// import PingCallbackDecorator from '../../decorators/PingCallbackDecorator.svelte';
import { userEvent, within, expect } from 'storybook/test';
import { action } from 'storybook/actions';

export default {
  title: 'Collection Transfer Modal',
  component: CollectionTransferModal,
  props: {
    src: '/hathitrust-icon-orange.svg',
  },
};

export const Desktop = {
  args: {
    isOpen: true,
    src: '/hathitrust-icon-orange.svg',
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
