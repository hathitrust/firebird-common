import ResultsPagination from './index.svelte';
import { userEvent, within, expect } from 'storybook/test';

export default {
  title: 'Results Pagination',
  component: ResultsPagination,
  args: {
    value: 1,
    maxPages: 10,
    stickyBottom: false,
    prevHref: '?page=1',
    nextHref: '?page=3',
  },
};

export const FirstPage = {
  args: {
    value: 1,
    nextHref: '?page=2',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('previous is disabled', async () => {
      await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    await step('next is a link', async () => {
      await expect(canvas.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '?page=2');
    });
  },
};

export const MiddlePage = {
  args: {
    value: 2,
    prevHref: '?page=1',
    nextHref: '?page=3',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '?page=1');
    await expect(canvas.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '?page=3');
  },
};

export const LastPage = {
  args: {
    value: 10,
    prevHref: '?page=9',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('next is disabled', async () => {
      await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    await step('previous is a link', async () => {
      await expect(canvas.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '?page=9');
    });

    await step('shows the page total', async () => {
      await expect(canvas.getByText('of 10')).toBeVisible();
    });
  },
};

export const GoToPageInput = {
  args: {
    value: 1,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Go to page:');

    await step('starts on the first page', async () => {
      await expect(input).toHaveValue(1);
      await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    await step('typing a later page enables previous', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '5');
      await expect(input).toHaveValue(5);
      await expect(canvas.getByRole('link', { name: 'Previous' })).toBeVisible();
    });
  },
};
