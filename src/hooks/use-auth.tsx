
'use client';

import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { login as loginAction, signup as signupAction, getUserFromSession, clearUserSession, verifyPhoneOtp } from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';

// A simplified user object for the client-side context
export type ClientUser = Omit<IUser, 'password' | 'addresses'> & {
  id: string;
  displayName: string;
  avatar?: string;
  addresses: IUser['addresses'];
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
  phoneLogin: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  const refreshUser = useCallback(async () => {
     setIsUserLoading(true);
      const sessionUser = await getUserFromSession();
      if (sessionUser) {
           const clientUser: ClientUser = {
              ...JSON.parse(JSON.stringify(sessionUser)),
              id: sessionUser._id,
              displayName: `${sessionUser.firstName} ${sessionUser.lastName}`,
              avatar: sessionUser.avatar,
              addresses: sessionUser.addresses || [],
          };
          setUser(clientUser);
      } else {
          setUser(null);
      }
      setIsUserLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);


  const login = useCallback(async (email: string, password: string) => {
    await loginAction({ email, password });
    await refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      await signupAction({ firstName, lastName, email, password });
      await refreshUser();
    },
    [refreshUser]
  );

  const phoneLogin = useCallback(async (phone: string, otp: string) => {
      await verifyPhoneOtp(phone, otp);
      await refreshUser();
  }, [refreshUser]);


  const logout = useCallback(async () => {
    await clearUserSession();
    setUser(null);
    router.push('/');
  }, [router]);

  const value = {
    user,
    isUserLoading,
    login,
    signup,
    phoneLogin,
    logout,
    refreshUser,
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
