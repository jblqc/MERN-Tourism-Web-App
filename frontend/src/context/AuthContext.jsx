// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // mimic authController.isLoggedIn → fetch /api/v1/users/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/users/me');
        setUser(res.data.data.user || res.data.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await axiosClient.get('/users/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
