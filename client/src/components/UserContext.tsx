import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserType } from '../types';
import { setCurrentUser, getCurrentUser, addUser } from '../lib/storage';

interface UserContextType {
  user: User | null;
  login: (userType: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userType: UserType) => {
    // Create a simulated user for demo purposes
    const newUser: Omit<User, "id"> = {
      username: `${userType}_user`,
      userType
    };
    
    const createdUser = addUser(newUser);
    setCurrentUser(createdUser);
    setUser(createdUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
