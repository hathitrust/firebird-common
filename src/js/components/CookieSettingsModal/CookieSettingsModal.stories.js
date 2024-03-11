import CookieSettingsModal from './index.svelte';

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