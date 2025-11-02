
'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
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
  const { app } = useFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsUserLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`,
    });

    await setDoc(doc(firestore, 'users', firebaseUser.uid), {
      id: firebaseUser.uid,
      firstName,
      lastName,
      email,
    });
    
    // This is to make sure the user object in the context is updated with the new display name
    const updatedUser = { ...firebaseUser, displayName: `${firstName} ${lastName}` };
    setUser(updatedUser);
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

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
