import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const STORAGE_KEY = 'isLoggedIn';

  useEffect(() => {
    (async () => {
      const val = await AsyncStorage.getItem(STORAGE_KEY);
      setIsLoggedIn(val === 'true');
    })();
  }, []);

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
