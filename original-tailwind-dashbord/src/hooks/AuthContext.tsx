// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importa a função para decodificar

// 1. Define o formato dos dados do usuário que extraímos do token
interface User {
  sub: string;      // Username
  name: string;
  roles?: string[];
  userId: number;
  picture?: string; 
}

// 2. Define o que o nosso contexto vai fornecer
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (jwtToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 3. Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Cria o "Provedor" do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Efeito para carregar o usuário do token no localStorage ao iniciar a app
  useEffect(() => {
    if (token) {
      const decodedUser: User = jwtDecode(token);
      setUser(decodedUser);
    }
  }, [token]);

  const login = (jwtToken: string) => {
    localStorage.setItem('authToken', jwtToken);
    const decodedUser: User = jwtDecode(jwtToken);
    setToken(jwtToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Cria um hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}