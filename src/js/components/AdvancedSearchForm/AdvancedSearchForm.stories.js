import AdvancedSearchForm from './index.svelte';
import AdvancedSearchDecorator from '../../decorators/AdvancedSearchDecorator.svelte'
import { fn, expect, waitFor } from 'storybook/test';

export default {
  title: 'AdvancedSearchForm',
  component: AdvancedSearchForm,
  decorators: [() => AdvancedSearchDecorator],
  args: {
    mockSubmit: fn(),
  },
};

export const MobileDefault = {
  globals: {
    viewport: {
      value: 'bsXs',
      isRotated: false,
    },
  },
};

export const DefaultDesktop = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
  play: async ({ args, canvas, userEvent }) => {

    await canvas.getByLabelText('Search Term 1').focus();
    await userEvent.type(canvas.getByLabelText('Search Term 1'), 'elephant');
    await userEvent.click(canvas.getByTestId('advanced-search-submit'));

    await waitFor(() => expect(args.mockSubmit).toHaveBeenCalled())

    const calledUrl = args.mockSubmit.mock.calls[0][0];
    expect(calledUrl).toContain('q1=elephant')

  }
};

export const TwoFieldsWithAnd = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
  play: async ({ args, canvas, userEvent }) => {

    await canvas.getByLabelText('Search Term 1').focus();
    await userEvent.type(canvas.getByLabelText('Search Term 1'), 'elephant');
    const searchField2 = canvas.getByLabelText('Selected field 2');
    await userEvent.selectOptions(searchField2, 'Subject');
    await canvas.getByLabelText('Search Term 2').focus();
    await userEvent.type(canvas.getByLabelText('Search Term 2'), 'conservation');
    await userEvent.click(canvas.getByTestId('advanced-search-submit'));

    await waitFor(() => expect(args.mockSubmit).toHaveBeenCalled())

    const calledUrl = args.mockSubmit.mock.calls[0][0];
    expect(calledUrl).toContain('lmt=ft&a=srchls&adv=1&q1=elephant&q2=conservation&field1=ocr&field2=subject&anyall1=all&anyall2=all&op2=AND')

  }
}
export const Fields1And4WithOr = {
  globals: {
    viewport: {
      value: 'bsXl',
      isRotated: false,
    },
  },
  play: async ({ args, canvas, userEvent }) => {

    await canvas.getByLabelText('Search Term 1').focus();
    await userEvent.type(canvas.getByLabelText('Search Term 1'), 'elephant');
    const searchField4 = canvas.getByLabelText('Selected field 4');
    await userEvent.selectOptions(searchField4, 'Subject');
    await canvas.getByLabelText('Search Term 4').focus();
    await userEvent.type(canvas.getByLabelText('Search Term 4'), 'conservation');
    const thirdRadioGroupOr = canvas.getAllByRole('radio', { name: 'OR' })[2];
    await userEvent.click(thirdRadioGroupOr);
    await userEvent.click(canvas.getByTestId('advanced-search-submit'));

    await waitFor(() => expect(args.mockSubmit).toHaveBeenCalled())

    const calledUrl = args.mockSubmit.mock.calls[0][0];
    expect(calledUrl).toContain('lmt=ft&a=srchls&adv=1&q1=elephant&q2=conservation&field1=ocr&field2=subject&anyall1=all&anyall2=all&op2=OR')

  }
}

