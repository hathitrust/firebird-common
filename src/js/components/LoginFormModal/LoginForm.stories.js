import LoginForm from './LoginForm.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from 'storybook/test';
import { action } from 'storybook/actions';

import { expect } from 'storybook/test';

export const actionsData = {
  show: action('show'),
  hide: action('hide'),
};

export default {
  title: 'Login Form',
  component: LoginForm,
  excludeStories: /.*Data$/,
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false },
    }),
  ],
  argTypes: {
    show: { action: 'show' },
    hide: { action: 'hide' },
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};

export const NotLoggedIn = {
  args: {},
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: false,
      },
    }),
  ],
};

export const AlreadyLoggedIn = {
  args: {},
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: true,
      },
    }),
  ],
};
