import React, { createContext, useState, useEffect, useContext } from 'react';

const PlaidContext = createContext();

export function PlaidProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('plaid_access_token');
    if (token) setAccessToken(token);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('plaid_access_token', accessToken);
    } else {
      localStorage.removeItem('plaid_access_token');
    }
  }, [accessToken]);

  return (
    <PlaidContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </PlaidContext.Provider>
  );
}

export function usePlaid() {
  return useContext(PlaidContext);
}
