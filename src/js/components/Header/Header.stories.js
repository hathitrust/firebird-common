import Header from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from "@storybook/test";

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
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  },
};

export const DefaultDesktop = {
  args: {
    searchOpenToggle: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
  },
};
