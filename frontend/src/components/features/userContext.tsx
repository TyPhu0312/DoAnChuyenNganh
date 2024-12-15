"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
}

interface UserContextType {
  appUser: User | null; // Đổi tên từ 'user' thành 'appUser'
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [appUser, setAppUser] = useState<User | null>(null); // Đổi tên từ 'user' thành 'appUser'

  return (
    <UserContext.Provider value={{ appUser, setUser: setAppUser }}>
      {children}
    </UserContext.Provider>
  );
};
