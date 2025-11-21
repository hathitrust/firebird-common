import Navbar from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from 'storybook/test';
import { expect } from 'storybook/test';

export default {
  title: 'Navbar',
  component: Navbar,
  // decorators: [
  //   () => ({
  //     Component: PingCallbackDecorator,
  //     props: { loggedIn: false, notificationData: null },
  //   }),
  // ],
};

export const Default = {
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    //sanity check
    expect(await canvas.getByTitle('HathiTrust Home')).toBeInTheDocument();
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
export const DesktopDropdownMenuSelected = {
  parameters: { ...Default.parameters },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mainMenu = await canvas.getByText(/member libraries/i);
    await userEvent.click(mainMenu);
  },
};
export const DesktopLoginModalOpen = {
  parameters: { ...Default.parameters },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  args: {
    loggedIn: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loginButton = canvas.getByTestId('login-button');
    // const loginButton = await canvas.getByRole('button', { name: /log in/i });
    // const loginButton = await canvas.locator('#navbarNavDropdown:has-text"Log In"');
    await userEvent.click(loginButton);
  },
};

export const DesktopLoggedIn = {
  parameters: { ...Default.parameters },
  args: {
    loggedIn: false,
    isOpen: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true },
    }),
  ],
};
export const DesktopLoggedInResourceSharingRole = {
  parameters: { ...Default.parameters },
  args: {
    loggedIn: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accountButton = canvas.getByLabelText(/My Account/);
    await userEvent.click(accountButton);
  },
};
export const DesktopLoggedInResourceSharingRoleActivated = {
  parameters: { ...Default.parameters },
  args: {
    loggedIn: true,
    hasActivatedRole: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: true },
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accountButton = canvas.getByLabelText(/My Account/);
    await userEvent.click(accountButton);
  },
};
export const DesktopLoggedInWithNotifications = {
  parameters: { ...Default.parameters },
  args: {
    loggedIn: true,
    hasNotification: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: true,
        notificationData: [
          {
            title: 'A navbar story',
            message: 'Once upon a time there was a user with notifications',
            read_more_label: 'Do you want to know more?',
            read_more_link: 'https://umich.edu',
          },
        ],
      },
    }),
  ],
};
export const Mobile = {
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};
export const MobileOpenMenu = {
  parameters: { ...Mobile.parameters },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    await userEvent.click(mobileMenuButton);
  },
};
export const MobileDropdownMenuSelected = {
  parameters: { ...Mobile.parameters },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    const mainMenu = canvas.getByText(/member libraries/i);

    await userEvent.click(mobileMenuButton);
    await userEvent.click(mainMenu);
  },
};
export const MobileLoggedIn = {
  parameters: { ...Mobile.parameters },
  args: {
    loggedIn: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};
export const MobileLoggedInResourceSharingRole = {
  parameters: { ...Mobile.parameters },
  args: {
    loggedIn: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    const accountButton = canvas.getByLabelText(/My Account/);
    await userEvent.click(mobileMenuButton);
    await userEvent.click(accountButton);
  },
};
export const MobileLoggedInResourceSharingRoleActivated = {
  parameters: { ...Mobile.parameters },
  args: {
    loggedIn: true,
    hasActivatedRole: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: true },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    const accountButton = canvas.getByLabelText(/My Account/);
    await userEvent.click(mobileMenuButton);
    await userEvent.click(accountButton);
  },
};
export const MobileLoggedInWithNotifications = {
  parameters: { ...Mobile.parameters },
  args: {
    loggedIn: true,
    hasNotification: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: true,
        notificationData: [
          {
            title: 'A navbar story',
            message: 'Once upon a time there was a user with notifications',
            read_more_label: 'Do you want to know more?',
            read_more_link: 'https://umich.edu',
          },
        ],
      },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};
export const MobileLoggedInMyAccountDropdown = {
  parameters: { ...Mobile.parameters },
  args: { ...MobileLoggedInWithNotifications.args },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: true,
      },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    const myAccount = canvas.getByLabelText(/My Account/);

    await userEvent.click(mobileMenuButton);
    await userEvent.click(myAccount);
  },
};
export const MobileLoggedInResourceSharingRoleActivatedHasNotification = {
  parameters: { ...Mobile.parameters },
  args: {
    loggedIn: true,
    hasActivatedRole: true,
  },
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: {
        loggedIn: true,
        role: 'resourceSharing',
        hasActivatedRole: true,
        notificationData: [
          {
            title: 'A navbar story',
            message: 'Once upon a time there was a user with notifications',
            read_more_label: 'Do you want to know more?',
            read_more_link: 'https://umich.edu',
          },
        ],
      },
    }),
  ],
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileMenuButton = canvas.getByLabelText('Toggle navigation');
    const accountButton = canvas.getByLabelText(/My Account/);
    await userEvent.click(mobileMenuButton);
    await userEvent.click(accountButton);
  },
};
