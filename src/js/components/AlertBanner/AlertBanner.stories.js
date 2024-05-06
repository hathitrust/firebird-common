import AlertBanner from './index.svelte'
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';

export default {
    title: 'Alert Banner',
    component: AlertBanner,
}

export const Default = {
   parameters: {
    viewport: {
      defaultViewport: 'bsLg',
    },
  }, 
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      // props: { loggedIn: true },
    }),
  ],
}