import { useState, useCallback } from 'react';

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    // Simulate a login process
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    // Simulate a logout process
    setIsLoggedIn(false);
  }, []);

  return {
    isLoggedIn,
    login,
    logout,
  };
};
