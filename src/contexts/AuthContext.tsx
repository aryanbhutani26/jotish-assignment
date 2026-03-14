import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextValue, PersistedAuth } from '../types';

const VALID_USERNAME = 'testuser';
const VALID_PASSWORD = 'Test123';
const STORAGE_KEY = 'eid_auth';

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: PersistedAuth = JSON.parse(raw);
        return parsed.isAuthenticated === true;
      }
    } catch {
      // SecurityError or JSON parse error — treat as unauthenticated
    }
    return false;
  });

  useEffect(() => {
    // Sync any external localStorage changes (e.g. another tab)
    // Not strictly required but keeps state consistent on mount
  }, []);

  function login(username: string, password: string): boolean {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      try {
        const payload: PersistedAuth = { isAuthenticated: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // SecurityError — session is in-memory only, no crash
      }
      return true;
    }
    return false;
  }

  function logout(): void {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // SecurityError — ignore
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export default AuthContext;
