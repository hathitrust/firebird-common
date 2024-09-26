import CookieSettingsModal from './index.svelte';
import { userEvent, within } from "@storybook/test";

export default {
  title: 'Cookie Settings Modal',
  component: CookieSettingsModal,
};

export const Default = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXl',
    },
    design:{
      type:'figma', 
      url: 'https://www.figma.com/file/Ju55vvmsCEFHHTjfyysGyJ/HathiTrust---Design-Explorations?type=design&node-id=1156-4805&mode=design&t=OFcXMYKLXi1GEmh5-4'
    }
  },
  args: {
    isOpen: true,
    
  },
};

export const MobileDefault = {
  parameters: {
    viewport: {
      defaultViewport: 'bsXs',
    },
  },
  args: {
    isOpen: true,
    
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
    const closeButton = await canvas.getByLabelText('Close Modal')
    await userEvent.click(closeButton);
  },
}