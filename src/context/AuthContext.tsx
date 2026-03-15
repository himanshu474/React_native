// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User, AuthState } from '../types/auth';

const AUTH_STORAGE_KEY = '@ecommerce_auth';
const USER_STORAGE_KEY = '@ecommerce_user';

// Mock user for demo (in real app, this would be your backend)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
  },
];

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const authToken = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (userJson && authToken) {
        const user = JSON.parse(userJson);
        setState({
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to restore session',
      });
    }
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo, accept any email/password
      // In real app, validate with backend
      if (email && password) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
        };

        // Save to storage
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'mock-auth-token');

        setState({
          user,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      });
      throw error;
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      // Save to storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'mock-auth-token');

      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      });
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      setState({
        user: null,
        isLoading: false,
        error: 'Sign out failed',
      });
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};