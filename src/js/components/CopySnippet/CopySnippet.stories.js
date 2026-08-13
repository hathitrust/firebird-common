import CopySnippet from './index.svelte';
import { userEvent, within, expect } from 'storybook/test';
import { action } from 'storybook/actions';
import CopySnippetDecorator from '../../decorators/CopySnippetDecorator.svelte';

export default {
  title: 'Copy Snippet',
  component: CopySnippet,
  props: {
    snippetLink: 'https://www.copysnippetforcopying.com',
  },
  decorators: [() => CopySnippetDecorator],
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

export const DesktopHoverForTooltip = {
  args: {
    snippetLink: 'https://www.thisisalinktobecopied.com',
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('focus copy button', async () => {
      const copyButton = canvas.getByTitle('Copy to clipboard');
      await copyButton.focus();
    });

    // i would love to figure out how to get this to work
    // but no matter what i try, storybook can't find it
    // await step('tooltip visible', async () => {
    //   await expect(canvas.getByRole('tooltip')).toBeVisible();
    // });
  },
};
