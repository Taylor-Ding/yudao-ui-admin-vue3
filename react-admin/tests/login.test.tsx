import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/login';
import { useModel } from 'umi';

jest.mock('umi', () => ({
  useModel: jest.fn(),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
  history: {
    push: jest.fn(),
  },
  Outlet: () => <div />,
  setLocale: jest.fn(),
}));

describe('LoginPage', () => {
  it('renders correctly', () => {
    (useModel as jest.Mock).mockReturnValue({
      login: jest.fn(),
    });
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    expect(getByPlaceholderText('login.username')).toBeInTheDocument();
    expect(getByPlaceholderText('login.password')).toBeInTheDocument();
    expect(getByText('login.login')).toBeInTheDocument();
  });

  it('calls the login function when the form is submitted', async () => {
    const login = jest.fn();
    (useModel as jest.Mock).mockReturnValue({
      login,
    });
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    fireEvent.change(getByPlaceholderText('login.username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(getByPlaceholderText('login.password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(getByText('login.login'));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
  });
});
