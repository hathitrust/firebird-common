import Expandables from './index.svelte';

import SingleAccordionArgs from './fixtures/SingleAccordion.js';
import MultipleIndependentAccordionArgs from './fixtures/MultipleIndependentAccordion.js';
import SingleOpenAccordionArgs from './fixtures/SingleOpenAccordion.js';
import ManySingleOpenAccordionsInFixedViewArgs from './fixtures/ManySingleOpenAccordionsInFixedView.js';

export default {
  title: 'Designs/Accordion',
  component: Expandables,
};


export const SingleAccordion = {
  args: SingleAccordionArgs
};

export const MultipleIndependentAccordion = {
  args: MultipleIndependentAccordionArgs
};

export const SingleOpenAccordion = {
  args: SingleOpenAccordionArgs
};

export const ManySingleOpenAccordionsInFixedView = {
  args: ManySingleOpenAccordionsInFixedViewArgs
};
