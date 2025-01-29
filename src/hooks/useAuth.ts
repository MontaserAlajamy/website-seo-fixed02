import { useState, useEffect } from 'react';
import { adminSchema } from '../lib/types';
import { storage } from '../lib/storage';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => storage.auth.get());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(storage.auth.get());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (password: string) => {
    try {
      adminSchema.parse({ password });
      storage.auth.set(true);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid password',
      };
    }
  };

  const logout = () => {
    storage.auth.remove();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}