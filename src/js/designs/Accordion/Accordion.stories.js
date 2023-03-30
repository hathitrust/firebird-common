import Expandables from './index.svelte';

export default {
  title: 'Designs/Accordion',
  component: Expandables,
};


export const SingleAccordion = {
  args: (await import('./fixtures/SingleAccordion.js')).default
};

export const MultipleIndependentAccordion = {
  args: (await import('./fixtures/MultipleIndependentAccordion.js')).default
};

export const SingleOpenAccordion = {
  args: (await import('./fixtures/SingleOpenAccordion.js')).default
};

export const ManySingleOpenAccordionsInFixedView = {
  args: (await import('./fixtures/ManySingleOpenAccordionsInFixedView.js')).default
};
