import React, { createContext, useContext, useEffect, useState } from "react";
import { signInUser, registerUser, signOutUser } from "@/services/firebase/auth";
import type { AppUser } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { doc, getDocFromServer } from "firebase/firestore";
import { collections } from "@/services/firebase/firestore";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state — persists across page refreshes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDocFromServer(doc(collections.users, firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as AppUser);
          } else {
            // Auth user exists but no Firestore profile yet — sign them out
            await signOutUser();
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AppUser> => {
    const signedInUser = await signInUser(email, password);
    setUser(signedInUser);
    return signedInUser;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<AppUser> => {
    const newUser = await registerUser(name, email, password, phone);
    setUser(newUser);
    return newUser;
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};