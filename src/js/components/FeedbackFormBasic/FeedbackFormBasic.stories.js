import FeedbackFormBasic from './index.svelte';
import { userEvent, within } from 'storybook/test';
import { expect } from 'storybook/test';

export default {
  title: 'Feedback Form - Basic',
  component: FeedbackFormBasic,
  argTypes: { onSubmit: { action: 'form submitted' } },
};

export const Default = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', {
      name: 'Submit',
    });

    //sanity check
    await expect(canvas.getByRole('main')).toBeInTheDocument();
    await expect(submitButton).toHaveTextContent('Submit');
    await expect(submitButton.classList).toContain('btn-primary');
  },
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false
    }
  },
};

//check for cookie???
//or user agent?

export const DesktopFormFilled = {
  parameters: { ...Default.parameters },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // const name = await canvas.getByRole('textbox', { name: 'Name ' });
    const name = await canvas.getByLabelText('Name (required)', { selector: 'input' });
    const email = await canvas.getByLabelText('Email address (required)', { selector: 'input' });
    const summary = await canvas.getByLabelText('Short summary (required)', { selector: 'input' });
    const bookDescription = await canvas.getByLabelText(
      'If your question is related to a specific book, what is the title or URL? (optional)',
      {
        selector: 'input',
      }
    );
    const description = await canvas.getByLabelText('Full description of problem or question (required)', {
      selector: 'textarea',
    });

    await userEvent.type(name, 'Caryl Wyatt');
    await userEvent.type(email, 'caryl@umich.edu');
    await userEvent.type(summary, 'Where was that book?');
    await userEvent.type(bookDescription, "I can't remember the name but the cover was blue.");
    await userEvent.type(
      description,
      "I was browsing the collection and found the most amazing book, but not I can't remember what it was called. It was blue?"
    );
  },
};
export const DesktopFormMissingRequiredFields = {
  parameters: { ...Default.parameters },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const bookDescription = await canvas.getByLabelText(
      'If your question is related to a specific book, what is the title or URL? (optional)',
      {
        selector: 'input',
      }
    );

    const submitButton = await canvas.getByRole('button', { name: 'Submit' });

    await userEvent.type(bookDescription, "I can't remember the name but the cover was blue.");

    await userEvent.click(submitButton);
  },
};
export const DesktopLoadingOnSubmit = {
  parameters: { ...Default.parameters },
  args: {
    loading: true,
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const submitButton = await canvas.getByRole('button', { name: 'Submit' });

  //   // this is a dumb test
  //   // i want to test that the loading prop is working, but how?
  // },
};
export const DesktopSuccessMessage = {
  parameters: { ...Default.parameters },
  args: {
    hidden: true,
    submitted: true,
    postResponseStatusCode: 200,
  },
};
export const DesktopSubmissionLimitMessage = {
  parameters: { ...Default.parameters },
  args: {
    hidden: false,
    submitted: true,
    postResponseStatusCode: 429,
  },
};
export const DesktopFailureMessage = {
  parameters: { ...Default.parameters },
  args: {
    hidden: false,
    submitted: true,
    postResponseStatusCode: null,
  },
};

export const DefaultMobile = {
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false
    }
  },
};
