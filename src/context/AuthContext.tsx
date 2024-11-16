// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userType: 'admin' | 'student' | null;
  login: (type: 'admin' | 'student') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<'admin' | 'student' | null>(null);

  const login = async (type: 'admin' | 'student') => {
    setUserType(type);
    await AsyncStorage.setItem('@userType', type);
  };

  const logout = async () => {
    setUserType(null);
    await AsyncStorage.removeItem('@userType');
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
