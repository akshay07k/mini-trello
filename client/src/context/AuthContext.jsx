import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore user if token present
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingAuth(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        // backend may return { user: { ... } } or user directly
        setUser(data.user ?? data);
      } catch (err) {
        console.error('Failed to restore user', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login(token) kept to match your existing calls (Login uses login(res.data.token))
  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user ?? data);
      navigate('/');
      return data;
    } catch (err) {
      console.error('login: failed to fetch /auth/me', err);
      localStorage.removeItem('token');
      throw err;
    }
  };

  // helper for registering (returns api response so page can redirect)
  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
