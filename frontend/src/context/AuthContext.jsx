import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('immo_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('immo_admin_token') || null;
  });

  const login = async (username, password) => {
    const res = await api.login(username, password);
    if (res.status === 'success') {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('immo_admin_user', JSON.stringify(res.user));
      localStorage.setItem('immo_admin_token', res.token);
      return res;
    }
    throw new Error(res.message || 'Échec de connexion');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('immo_admin_user');
    localStorage.removeItem('immo_admin_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
