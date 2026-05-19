import React from 'react';
import { render, fireEvent, act, RenderResult } from '@testing-library/react';
import BasicLayout from '../src/layouts/index';
import { useModel } from 'umi';

jest.mock('umi', () => ({
  useModel: jest.fn(),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
  setLocale: jest.fn(),
  history: {
    push: jest.fn(),
  },
  Outlet: () => <div />,
}));

describe('BasicLayout', () => {
  it('renders correctly when logged in', () => {
    (useModel as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      logout: jest.fn(),
    });
    let getByText: RenderResult['getByText'];
    act(() => {
      const { getByText: gbt } = render(<BasicLayout />);
      getByText = gbt;
    });
    // @ts-ignore
    expect(getByText('nav.home')).toBeInTheDocument();
    // @ts-ignore
    expect(getByText('Logout')).toBeInTheDocument();
  });

  it('calls the logout function when the logout button is clicked', () => {
    const logout = jest.fn();
    (useModel as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      logout,
    });
    let getByText: RenderResult['getByText'];
    act(() => {
      const { getByText: gbt } = render(<BasicLayout />);
      getByText = gbt;
    });

    act(() => {
        // @ts-ignore
      fireEvent.click(getByText('Logout'));
    });

    expect(logout).toHaveBeenCalled();
  });
});
