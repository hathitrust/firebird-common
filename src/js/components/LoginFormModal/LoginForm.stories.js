import LoginForm from './LoginForm.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from '@storybook/testing-library';
import { action } from '@storybook/addon-actions';

import { expect } from '@storybook/jest';

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
