import {useState, type ReactNode,} from 'react';
import {AuthContext, type User,} from './authContextDefinition';

type AuthProviderProps = {children: ReactNode;};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );

  function login(user: User, token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
