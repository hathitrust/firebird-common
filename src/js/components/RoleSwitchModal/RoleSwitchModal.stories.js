import RoleSwitchModal from './index.svelte'
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator.svelte'
import { userEvent, within, expect } from 'storybook/test'
import { action } from 'storybook/actions'

export default {
    title: 'Role Switch Modal',
    component: RoleSwitchModal,
    props: {
        src: '/hathitrust-icon-orange.svg'
    },
    decorators: [
      () => ({
        Component: PingCallbackDecorator,
        props: { loggedIn: true },
      }),
    ],
    
  };

export const DesktopSwitchableRoleNotActivated = {
    args: {
        isOpen: true,
        src: '/hathitrust-icon-orange.svg'
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      expect(canvas.getByRole('heading', {name: 'Choose a role'}))
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}
export const DesktopRoleToggle = {
    args: {
        ...DesktopSwitchableRoleNotActivated.args,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const switchableRole = canvas.getByRole('radio', { name: /Resource Sharing/ })
      await userEvent.click(switchableRole)
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}
export const DesktopRoleToggleSubmitted = {
    args: {
        ...DesktopSwitchableRoleNotActivated.args,
        loading: true,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const switchableRole = canvas.getByRole('radio', { name: /Resource Sharing/ })
      await userEvent.click(switchableRole)
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}
export const DesktopSwitchableRoleActivated = {
    args: {
        ...DesktopSwitchableRoleNotActivated.args,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: true },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const switchableRole = canvas.getByRole('radio', { name: /Member/ })
      await userEvent.click(switchableRole)
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}
export const DesktopCollAdmAccNotActivated = {
    args: {
        ...DesktopSwitchableRoleNotActivated.args,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'totalAccess', hasActivatedRole: false },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const switchableRole = canvas.getByRole('radio', { name: /Collection Administration Access/ })
      await userEvent.click(switchableRole)
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}
export const DesktopAccTextReqNotActivated = {
    args: {
        ...DesktopSwitchableRoleNotActivated.args,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'enhancedTextProxy', hasActivatedRole: false },
        }),
      ],
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const switchableRole = canvas.getByRole('radio', { name: /Accessible Text Request Service/ })
      await userEvent.click(switchableRole)
  },
      globals: {
          viewport: {
              value: 'bsXl',
              isRotated: false
          }
      }
}