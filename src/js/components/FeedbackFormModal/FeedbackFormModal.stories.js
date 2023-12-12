import FeedbackFormModal from './index.svelte';

export default {
  title: 'Feedback Form Modal',
  component: FeedbackFormModal,
};

export const Default = {
  args: {
    isOpen: true,
    form: 'basic',
    winterBreak: false,
  },
};

export const Catalog = {
  args: {
    isOpen: true,
    form: 'catalog',
    winterBreak: false,
  },
};

export const Content = {
  args: {
    isOpen: true,
    form: 'content',
    winterBreak: false,
  },
};


export const WinterBreak = {
  args: {
    isOpen: true,
    winterBreak: true
  } 
};
