import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir o tipo para o usuário (mockado)
interface Usuario {
  email: string;
  token: string;
}

// Definir o tipo para o contexto de autenticação
interface AuthContextType {
  usuario: Usuario | null;
  login: (dadosUsuario: Usuario) => Promise<void>;
  logout: () => Promise<void>;
  estaCarregando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    // Carrega o usuário do armazenamento local ao iniciar o aplicativo
    const carregarUsuario = async () => {
      try {
        const usuarioArmazenado = await AsyncStorage.getItem('usuario');
        if (usuarioArmazenado) {
          setUsuario(JSON.parse(usuarioArmazenado));
        }
      } catch (e) {
        console.error('Falha ao carregar usuário do armazenamento:', e);
      } finally {
        setEstaCarregando(false);
      }
    };
    carregarUsuario();
  }, []);

  // Função de login (simulada)
  const login = async (dadosUsuario: Usuario) => {
    setUsuario(dadosUsuario);
    await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  };

  // Função de logout (simulada)
  const logout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaCarregando }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

