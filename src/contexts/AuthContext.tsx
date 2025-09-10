import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  identifiant?: string;
  role: 'professeur' | 'eleve';
  premiere_connexion?: boolean;
  first_login?: boolean;
  classe_id?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [token]);

  const login = async (credentials: any, role: string) => {
    try {
      const response = await authAPI.login(credentials, role);
      const { token: newToken, ...userData } = response.data;
      
      const userWithRole = { ...userData, role };
      
      setToken(newToken);
      setUser(userWithRole);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithRole));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};