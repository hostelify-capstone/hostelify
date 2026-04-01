import React, { createContext, useContext, useMemo, useState } from "react";
import { signInWithDemoAuth, registerDemoUser } from "@/services/firebase/auth";
import type { AppUser } from "@/types";

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (name: string, email: string, password: string) => Promise<AppUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    signIn: async (email: string, password: string) => {
      const signedInUser = await signInWithDemoAuth(email, password);
      setUser(signedInUser);
      return signedInUser;
    },
    register: async (name: string, email: string, password: string) => {
      const newUser = await registerDemoUser(name, email, password);
      setUser(newUser);
      return newUser;
    },
    signOut: () => setUser(null)
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};