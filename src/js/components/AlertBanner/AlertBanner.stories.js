import BannerMessage from './BannerMessage.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';

export default {
  title: 'Alert Banner',
  component: BannerMessage,
  globals: {
    viewport: { value: 'bsXl' },
  },
};

export const Warning = {
  args: {
    type: 'warning',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};

export const Brand = {
  args: {
    type: 'brand',
    title: `Update: Thanks for being awesome!`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};

export const Danger = {
  args: {
    type: 'danger',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};

export const DangerMobile = {
  globals: {
    viewport: { value: 'bsXs' },
  },
  args: {
    type: 'danger',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};

export const MessageOnly = {
  args: {
    type: 'warning',
    title: '',
    message: `Some parts of the HathiTrust website is experiencing intermittent access issues. We are monitoring this issue.`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};

export const MessageOnlyMobile = {
  globals: {
    viewport: { value: 'bsXs' },
  },
  args: {
    type: 'danger',
    title: '',
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`,
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
};
