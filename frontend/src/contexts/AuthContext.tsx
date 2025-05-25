import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from './ApiContext';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  cadastrarServico: (caregiverId: string, data: { title: string; description: string; hourly_rate: number; location: string; }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const api = useApi();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      logout();
    }
  };

  const login = async (token: string) => {
    try {
      // Primeiro armazenamos o token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Depois buscamos os dados do usuário
      const response = await api.get('/api/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const cadastrarServico = async (caregiverId: string, data: { title: string; description: string; hourly_rate: number; location: string; }) => {
    return api.post('/api/services/offer', {
      caregiverId,
      ...data,
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, cadastrarServico }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
} 