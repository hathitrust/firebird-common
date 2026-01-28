import Navbar from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within, waitFor, expect } from 'storybook/test';
// import { expect } from 'storybook/test';

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
    expect(canvas.getByTitle('HathiTrust Home')).toBeInTheDocument();
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

    const mainMenu = canvas.getByText(/member libraries/i);
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
export const DesktopLoggedInResourceSharingRolePromptDismissed = {
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
  play: async ({ canvas }) => {
    const closeModal = canvas.getByRole('button', { name: 'Cancel' });
    await userEvent.click(closeModal);

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
      props: {
        loggedIn: true,
        role: 'resourceSharing',
        hasActivatedRole: true,
        cookieData: {
          'HT-role-prompt': 'true',
        },
      },
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
export const DesktopLoggedInResourceSharingRoleAndNotification = {
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
        role: 'resourceSharing',
        hasActivatedRole: false,
        cookieData: {},
        notificationData: [{ title: 'What happens with two modals?', message: 'Hopefully these are not overlapping!' }],
      },
    }),
  ],
  play: async ({ canvas, userEvent }) => {
    const rolePromptCancelButton = canvas.getByRole('button', { name: 'Cancel' });
    await userEvent.click(rolePromptCancelButton);
  },
};
export const DesktopLoggedInRoleSwitchClosed = {
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
        role: 'resourceSharing',
        hasActivatedRole: false,
        cookieData: {},
        notificationData: [
          {
            title: 'Closed role switch modal',
            message:
              'User closed role switch modal using the X icon. Cookie was set, notifications should still appear.',
          },
        ],
      },
    }),
  ],
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => {
      expect(canvas.getByRole('heading', { name: 'Choose a role' })).toBeVisible();
    });
    const rolePromptCloseButton = canvas.getByRole('button', { name: 'Close modal' });
    await userEvent.click(rolePromptCloseButton);
  },
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
