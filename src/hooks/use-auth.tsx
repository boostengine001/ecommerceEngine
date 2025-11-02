'use client';

import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { login as loginAction, signup as signupAction } from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';

// A simplified user object for the client-side context
export type ClientUser = Omit<IUser, 'password'> & {
  id: string;
  displayName: string;
};

export interface AuthContextType {
  user: ClientUser | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsUserLoading(true);
    try {
      const loggedInUser = await loginAction({ email, password });
      const clientUser: ClientUser = {
        ...loggedInUser,
        id: loggedInUser._id,
        displayName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };
      setUser(clientUser);
    } catch (error) {
      // Re-throw the error to be caught by the form
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      setIsUserLoading(true);
      try {
        const newUser = await signupAction({ firstName, lastName, email, password });
         const clientUser: ClientUser = {
          ...newUser,
          id: newUser._id,
          displayName: `${newUser.firstName} ${newUser.lastName}`,
        };
        setUser(clientUser);
      } catch (error) {
        throw error;
      } finally {
        setIsUserLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  const value = {
    user,
    isUserLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
