import SearchBar from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within, expect } from 'storybook/test';

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
      isRotated: false,
    },
  },
};
export const Desktop = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
export const TypeThenChangeFields = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
  play: async ({ canvas, userEvent }) => {
    await canvas.getByLabelText('Search using keywords').focus();
    await userEvent.type(canvas.getByLabelText('Search using keywords'), 'elephant');
    const whereToSearch = canvas.getByLabelText('Where do you want to search?');
    await userEvent.selectOptions(whereToSearch, 'Collection');

    expect(await canvas.getByLabelText('Search using keywords')).toHaveValue('elephant');
  },
};
