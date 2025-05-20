import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockUsers } from "@/api/mockData";

type UserType = "customer" | "business" | "admin";

interface User {
  id: number;
  username: string;
  userType: UserType;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, password: string, userType: UserType) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Check if we're in static mode
const IS_STATIC = process.env.NODE_ENV === 'production';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        if (IS_STATIC) {
          // Get user from localStorage when in static mode
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Get user from API when not in static mode
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (error) {
        // Not authenticated
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      if (IS_STATIC) {
        // Static mode login - simulate with mock data
        const mockUser = mockUsers.find(u => 
          u.username === username && (password === 'password' || password === u.username)
        );
        
        if (!mockUser) {
          throw new Error("Invalid credentials");
        }
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      } else {
        // API login
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Login failed");
        }
        
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, userType: UserType): Promise<User> => {
    setIsLoading(true);
    try {
      if (IS_STATIC) {
        // Static mode registration - simulate with mock data
        // Check if username already exists
        if (mockUsers.some(u => u.username === username)) {
          throw new Error("Username already exists");
        }
        
        // Create new user with next available ID
        const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
        const newUser = { id: newId, username, userType };
        
        // Add to mock users array (in memory only)
        mockUsers.push(newUser);
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
      } else {
        // API registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, userType }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Registration failed");
        }
        
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (IS_STATIC) {
        // Static mode logout - just remove from localStorage
        localStorage.removeItem('currentUser');
      } else {
        // API logout
        await fetch("/api/auth/logout", {
          method: "POST",
        });
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}