
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
import { login as loginAction, signup as signupAction, getUserFromSession, clearUserSession } from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';
import { useSession, SessionProvider, signOut as nextAuthSignOut } from 'next-auth/react';

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

function AuthProviderContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  // Get session from next-auth
  const { data: session, status } = useSession();

  useEffect(() => {
    async function checkSession() {
        // next-auth is handling session, check its status
        if (status === 'loading') {
            setIsUserLoading(true);
            return;
        }

        if (session) {
            // If there's a next-auth session, we assume our custom session is also set.
            // We fetch our user data based on the session ID.
            const sessionUser = await getUserFromSession();
            if (sessionUser) {
                 const clientUser: ClientUser = {
                    ...JSON.parse(JSON.stringify(sessionUser)),
                    id: sessionUser._id,
                    displayName: `${sessionUser.firstName} ${sessionUser.lastName}`,
                };
                setUser(clientUser);
            } else {
                // If next-auth has a session but we don't, something is out of sync. Log out.
                await nextAuthSignOut({ redirect: false });
                setUser(null);
            }
        } else {
             // If no next-auth session, check for our custom token just in case
            const sessionUser = await getUserFromSession();
            if (sessionUser) {
                 const clientUser: ClientUser = {
                    ...JSON.parse(JSON.stringify(sessionUser)),
                    id: sessionUser._id,
                    displayName: `${sessionUser.firstName} ${sessionUser.lastName}`,
                };
                setUser(clientUser);
            } else {
                setUser(null);
            }
        }

        setIsUserLoading(false);
    }
    checkSession();
  }, [session, status]);


  const login = useCallback(async (email: string, password: string) => {
    setIsUserLoading(true);
    try {
      const loggedInUser = await loginAction({ email, password });
      const clientUser: ClientUser = {
        ...JSON.parse(JSON.stringify(loggedInUser)), // Ensure serializable
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
          ...JSON.parse(JSON.stringify(newUser)), // Ensure serializable
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

  const logout = useCallback(async () => {
    // Sign out from both next-auth and our custom session
    await nextAuthSignOut({ redirect: false });
    await clearUserSession();
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

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
