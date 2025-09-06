import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// hardcoded credentials
const HARDCODED = { email: 'JakeDoe@gmail.com', password: 'P@$$word123' };
const STORAGE_KEY = 'inkwire_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const login = ({ email, password }) => {
    if (!validateEmail(email)) return { success: false, message: 'Invalid email format.' };
    if (email === HARDCODED.email && password === HARDCODED.password) {
      const u = { email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const checkExistingLogin = () => {
    return !!localStorage.getItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, validateEmail, checkExistingLogin }}>
      {children}
    </AuthContext.Provider>
  );
}