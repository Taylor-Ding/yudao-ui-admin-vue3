import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../src/pages/index';
import { useIntl } from 'umi';

jest.mock('umi', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('HomePage', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomePage />);

    expect(getByText('welcome.title')).toBeInTheDocument();
    expect(getByText('welcome.message')).toBeInTheDocument();
  });
});
