import RoleSwitchModal from './index.svelte'
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator.svelte'
import { userEvent, within, expect } from '@storybook/test'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Role Switch Modal',
    component: RoleSwitchModal,
    decorators: [
      () => ({
        Component: PingCallbackDecorator,
        props: { loggedIn: true },
      }),
    ],
    
  };

export const DesktopSwitchableRoleNotActivated = {
    parameters: { viewport: {
        defaultViewport: 'bsXl',
    }, },
    args: {
        isOpen: true,
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
    }
}
export const DesktopRoleToggle = {
    parameters: { viewport: {
        defaultViewport: 'bsXl',
    }, },
    args: {
        isOpen: true,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: false },
        }),
      ],
      play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // expect(canvas.getByRole('heading', {name: 'Choose a role'}))
        const switchableRole = canvas.getByLabelText(/Resource Sharing/)
        await userEvent.click(switchableRole)
    }
}
export const DesktopRoleToggleSubmitted = {
    parameters: { viewport: {
        defaultViewport: 'bsXl',
    }, },
    args: {
        isOpen: true,
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
        // expect(canvas.getByRole('heading', {name: 'Choose a role'}))
        const switchableRole = canvas.getByLabelText(/Resource Sharing/)
        await userEvent.click(switchableRole)
    }
}
export const DesktopSwitchableRoleActivated = {
    parameters: { viewport: {
        defaultViewport: 'bsXl',
    }, },
    args: {
        isOpen: true,
    },
    decorators: [
        () => ({
          Component: PingCallbackDecorator,
          props: { loggedIn: true, role: 'resourceSharing', hasActivatedRole: true },
        }),
      ],
      play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // expect(canvas.getByRole('heading', {name: 'Choose a role'}))
        const switchableRole = canvas.getByLabelText(/Member/)
        await userEvent.click(switchableRole)
    }
}