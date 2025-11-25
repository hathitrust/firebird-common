import Header from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from "storybook/test";

export default {
  title: 'Header',
  component: Header,
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
};

export const MobileDefault = {
  args: {
    searchOpenToggle: false,
  },
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false
    }
  },
};

export const DefaultDesktop = {
  args: {
    searchOpenToggle: false,
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false
    }
  },
};
