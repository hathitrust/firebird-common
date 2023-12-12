import SearchBar from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from '@storybook/testing-library';

export default {
  title: 'Search Bar',
  component: SearchBar,
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  },
};
export const Desktop = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
  },
  args: {
    modalOpen: false,
  },
};
