import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/models';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  role: 'user' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: 'admin001',
    name: 'Jagadish',
    email: 'admin@library.com',
    password: 'jagadishmec18',
    role: 'admin'
  },
  {
    id: 'user001',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: `user${Date.now()}`,
      name,
      email,
      password,
      role
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      role: user?.role || null 
    }}>
      {children}
    </AuthContext.Provider>
  );
};