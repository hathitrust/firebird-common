import CookieConsentBanner from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from "@storybook/test";
import { expect } from "@storybook/test";

export default {
  title: 'Cookie Consent Banner',
  component: CookieConsentBanner,
  argTypes: { confirm: { action: 'banner confirmed' } },
  args: {
    lgSrc: '/src/public/hathitrust-logo-stacked-orange-gray.png',
    smSrc: '/src/public/hathitrust-icon-orange.png'
  }
};

export const Default = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
    layout: 'fullscreen',
    design:{
      type:'figma', 
      url: 'https://www.figma.com/file/Ju55vvmsCEFHHTjfyysGyJ/HathiTrust---Design-Explorations?type=design&node-id=1095-14949&mode=design&t=afnXdsdlpCz3QKPV-4'
    }
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      // props: { loggedIn: true },
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const consentButton = await canvas.getByRole('button', {
      name: 'Allow all cookies',
    });

    //sanity check
    expect(consentButton.innerHTML).toBe('Allow all cookies');
    expect(consentButton.classList).toContain('btn-primary');
  },
};
export const MobileDefault = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      // props: { loggedIn: true },
    }),
  ],
};

// export const PreviouslyAccepted = {
//   parameters: {
//     viewport: {
//       defaultViewport: 'bsLg',
//     },
//   },
//   decorators: [
//     () => ({
//       Component: PingCallbackDecorator,
//       props: { loggedIn: true, cookieData: { 'HT.x': JSON.stringify({ 'aup-notice': true }) } },
//     }),
//   ],
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     //sanity check
//     expect(canvasElement.querySelector('button')).toBeFalsy();
//   },
// };
