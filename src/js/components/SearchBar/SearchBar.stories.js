import SearchBar from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from "storybook/test";

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
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false
    }
  },
};
export const Desktop = {
  args: {
    modalOpen: false,
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false
    }
  },
};
