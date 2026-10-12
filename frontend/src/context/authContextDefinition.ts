import { createContext } from 'react';

export type User = {
  id: number;
  name: string;
  email: string;
  address: string | null;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);