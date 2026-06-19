import React, { createContext, useState, useEffect } from 'react';
import { oauthAPI } from '../api/Index'; // 💡 Import your clean API module

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [token, user]);

  const loginWithProviderToken = async (provider, accessToken) => {
    try {
      // Clean call using your API abstraction folder
      const data = await oauthAPI.exchangeCode(provider, accessToken);
      setToken(data.access);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Failed to authorize with your Google Account.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    // 💡 THE CRITICAL FIX: Added setUser right here into the value bundle!
    <AuthContext.Provider value={{ user, setUser, token, logout, loginWithProviderToken, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
