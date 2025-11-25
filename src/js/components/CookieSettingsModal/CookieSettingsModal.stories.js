import CookieSettingsModal from './index.svelte';
import { userEvent, within } from "storybook/test";

export default {
  title: 'Cookie Settings Modal',
  component: CookieSettingsModal,
};

export const Default = {
  parameters: {
    design:{
      type:'figma', 
      url: 'https://www.figma.com/file/Ju55vvmsCEFHHTjfyysGyJ/HathiTrust---Design-Explorations?type=design&node-id=1156-4805&mode=design&t=OFcXMYKLXi1GEmh5-4'
    }
  },

  args: {
    isOpen: true,
    
  },

  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false
    }
  }
};

export const MobileDefault = {
  args: {
    isOpen: true,
    
  },
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false
    }
  },
};

export const AccordionOpen = {
 parameters: { ...Default.parameters },
  args: {
   isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstAccordion = await canvas.getAllByRole('button', {name: 'Necessary cookies' })[0]
    await userEvent.click(firstAccordion);
  },
}

export const MarketingSelected = {
 parameters: { ...Default.parameters },
  args: {
   isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const marketing = await canvas.getAllByRole('checkbox')[2]
    await userEvent.click(marketing);
  },
}

export const CloseSettingsModal = {
 parameters: { ...Default.parameters },
  args: {
   isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole('button', {name: 'Close modal'})
    await userEvent.click(closeButton);
  },
}