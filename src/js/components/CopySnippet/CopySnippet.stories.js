import CopySnippet from './index.svelte';
// import PingCallbackDecorator from '../../decorators/PingCallbackDecorator.svelte';
import { userEvent, within, expect } from 'storybook/test';
import { action } from 'storybook/actions';

export default {
  title: 'Copy Snippet',
  component: CopySnippet,
  props: {
    snippetLink: 'https://www.copysnippetforcopying.com',
  },
};

export const Desktop = {
  args: {
    snippetLink: 'https://www.thisisalinktobecopied.com',
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
};
