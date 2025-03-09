import { LoginData, RegisterData, UpdateUserData } from '@/models/auth.model';
import { User } from '@/models/user.model';
import { UserService } from '@/services/user.service';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await UserService.login(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await UserService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await UserService.logout();
    setUser(null);
  };

  const updateProfile = async (data: UpdateUserData) => {
    try {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      const updatedUser = await UserService.updateProfile(user.id, data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 
