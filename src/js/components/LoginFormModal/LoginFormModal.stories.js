import LoginFormModal from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within } from "@storybook/test";
import { action } from '@storybook/addon-actions';

import { expect } from "@storybook/test";

export const actionsData = {
  show: action('show'),
  hide: action('hide'),
};

export default {
  title: 'Login Form Modal',
  component: LoginFormModal,
  excludeStories: /.*Data$/,
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false },
    }),
  ],
  argTypes: {
    show: { action: 'show' },
    hide: { action: 'hide' },
  },
};

export const ModalOpen = {
  parameters: {
    title: 'Modal Open',
  },
  args: {
    isOpen: true,
  },
};
export const ToggleOpen = {};

export const FindInstitution = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputFilter = await canvas.getByLabelText('Filter options');
    await userEvent.click(inputFilter);
    await userEvent.keyboard('state');
    expect(await canvas.getAllByRole('radio').length).toBe(1);
  },
};

export const UnlistedInstitution = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputFilter = await canvas.getByLabelText('Filter options');
    await userEvent.click(inputFilter);
    await userEvent.keyboard('winnemac');
    expect(await canvas.queryAllByRole('radio').length).toBe(0);
  },
};

export const SelectInstitution = {
  selected_href: null,
  args: {
    isOpen: true,
    onSubmit: function (href) {
      SelectInstitution.selected_href = href;
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputFilter = await canvas.getByLabelText('Filter options');
    await userEvent.click(inputFilter);
    await userEvent.keyboard('state');

    const selectedInstitution = await canvas.getByRole('radio');
    await userEvent.click(selectedInstitution);

    const button = await canvas.getByRole('button', { name: 'Continue' });
    await userEvent.click(button);

    // expect(SelectInstitution.selected_href).not.toBeNull();
  },
};
