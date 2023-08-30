import AcceptableUseBanner from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'Acceptable Use Banner',
  component: AcceptableUseBanner,
  argTypes: { confirm: { action: 'banner confirmed' } },
};

export const Default = {
  parameters: {
    viewport: {
      defaultViewport: 'bsLg',
    },
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true }
    })
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = await canvas.getByRole('button', {
      name: 'OK',
    });

    //sanity check
    expect(submitButton.innerHTML).toBe('OK');
    expect(submitButton.classList).toContain('btn-dark');
  },
};

export const PreviouslyAccepted = {
  parameters: {
  viewport: {
      defaultViewport: 'bsLg',
    },
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true, cookieData: { 'HT.x': JSON.stringify({ 'aup-notice': true }) } }
    })
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    //sanity check
    expect(canvasElement.querySelector('button')).toBeFalsy();
  }
}