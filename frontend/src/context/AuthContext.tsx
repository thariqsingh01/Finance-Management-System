import {useState,useEffect,type ReactNode,} from 'react';
import {AuthContext,type User,} from './authContextDefinition';

type AuthProviderProps = {children: ReactNode;};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          return;
        }

        const data = await response.json();

        setToken(savedToken);
        setUser(data.user);
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

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
      {isLoading ? (
        <p>Loading your session...</p>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
