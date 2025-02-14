import AlertBanner from './index.svelte'
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';

export default {
    title: 'Alert Banner',
    component: AlertBanner,
}

const parameters = {
  viewport: {
    defaultViewport: 'bsLg',
  },
};

export const Warning = {
  parameters: parameters, 
  args: {
    type: 'warning',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
}

export const Danger = {
  parameters: parameters, 
  args: {
    type: 'danger',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
}

export const DangerMobile = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  }, 
  args: {
    type: 'danger',
    title: `Outage: Ongoing website issues`,
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
}

export const MessageOnly = {
  parameters: parameters, 
  args: {
    type: 'warning',
    title: '',
    message: `Some parts of the HathiTrust website is experiencing intermittent access issues. We are monitoring this issue.`
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
}

export const MessageOnlyMobile = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  }, 
  args: {
    type: 'danger',
    title: '',
    message: `We're having problems with our website and applications right now. Please be patient while we fix it. Thanks!`
  },
  decorators: [
    () => ({
      //ping here for cookie handling
      Component: PingCallbackDecorator,
    }),
  ],
}