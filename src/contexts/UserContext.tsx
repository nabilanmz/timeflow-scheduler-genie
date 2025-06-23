
import React, { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '@/hooks/useProfile';

export type UserRole = 'student' | 'lecturer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: profile } = useProfile();

  const user = profile ? {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole
  } : null;

  // Mock functions for compatibility - these won't be used in real auth
  const setUser = () => {};
  const switchRole = () => {};

  return (
    <UserContext.Provider value={{ user, setUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
};
