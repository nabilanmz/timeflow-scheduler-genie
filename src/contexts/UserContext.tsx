import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/types/api';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const { data } = await api.get('/api/user');
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      const userResponse = await api.get('/api/user');
      setUser(userResponse.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('auth_token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/api/logout');
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
