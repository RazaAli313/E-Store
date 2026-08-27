import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { DEV_ACCESS_TOKEN } from '#/constants';
import { clearAccessToken, setAccessToken } from '#/services/authToken';

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    const initialToken = import.meta.env.DEV ? DEV_ACCESS_TOKEN : null;
    setAccessToken(initialToken);
    return initialToken;
  });

  const login = (newToken: string) => {
    setToken(newToken);
    setAccessToken(newToken);
  };

  const logout = () => {
    setToken(null);
    clearAccessToken();
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
