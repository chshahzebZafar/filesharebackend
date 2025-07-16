import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, AuthResponse, RegisterRequest, LoginRequest } from '@/services/api';

interface User {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  subscription: {
    plan: string;
    status: string;
    features: string[];
  };
  storage: {
    used: number;
    limit: number;
  };
  settings?: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  // Frontend-specific properties
  name?: string;
  plan?: string;
  planExpiry?: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    autoDownload: boolean;
    defaultPrivacy: 'public' | 'private';
  };
  stats?: {
    totalUploads: number;
    totalDownloads: number;
    totalShares: number;
    storageUsed: number;
    storageLimit: number;
  };
  onboarding?: {
    completed: boolean;
    steps: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  updateUserPlan: (plan: string) => void;
  getCurrentPlan: () => string;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  updateUserStats: (stats: Partial<User['stats']>) => void;
  completeOnboardingStep: (step: string) => void;
  isOnboardingComplete: () => boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert backend user data to frontend format
  const convertBackendUser = (backendUser: any): User => {
    return {
      _id: backendUser._id,
      email: backendUser.email,
      username: backendUser.username,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      isEmailVerified: backendUser.isEmailVerified,
      subscription: backendUser.subscription,
      storage: backendUser.storage,
      settings: backendUser.settings,
      // Frontend-specific properties with defaults
      name: backendUser.firstName && backendUser.lastName 
        ? `${backendUser.firstName} ${backendUser.lastName}` 
        : backendUser.username,
      plan: backendUser.subscription?.plan || 'free',
      planExpiry: backendUser.subscription?.endDate,
      avatar: undefined,
      preferences: {
        theme: backendUser.settings?.theme || 'auto',
        language: backendUser.settings?.language || 'en',
        notifications: backendUser.settings?.notifications?.email || true,
        autoDownload: false,
        defaultPrivacy: 'private'
      },
      stats: {
        totalUploads: 0,
        totalDownloads: 0,
        totalShares: 0,
        storageUsed: backendUser.storage?.used || 0,
        storageLimit: backendUser.storage?.limit || 2 * 1024 * 1024 * 1024
      },
      onboarding: {
        completed: false,
        steps: []
      }
    };
  };

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Try to get current user from backend
          const response = await apiService.getCurrentUser();
          if (response.success && response.data?.user) {
            const userData = convertBackendUser(response.data.user);
            setUser(userData);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data?.user) {
        const userData = convertBackendUser(response.data.user);
        setUser(userData);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data?.user) {
        const convertedUser = convertBackendUser(response.data.user);
        setUser(convertedUser);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const updateUserPlan = (plan: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      plan,
      subscription: {
        ...user.subscription,
        plan
      }
    };
    
    setUser(updatedUser);
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedPreferences = { ...user.preferences, ...preferences };
    const updatedUser = { ...user, preferences: updatedPreferences };
    
    setUser(updatedUser);
  };

  const updateUserStats = (stats: Partial<User['stats']>) => {
    if (!user) return;
    
    const updatedStats = { ...user.stats, ...stats };
    const updatedUser = { ...user, stats: updatedStats };
    
    setUser(updatedUser);
  };

  const completeOnboardingStep = (step: string) => {
    if (!user) return;
    
    const updatedSteps = [...(user.onboarding?.steps || []), step];
    const updatedOnboarding = {
      ...user.onboarding,
      steps: updatedSteps,
      completed: updatedSteps.length >= 3 // Mark as complete after 3 steps
    };
    
    const updatedUser = { ...user, onboarding: updatedOnboarding };
    setUser(updatedUser);
  };

  const isOnboardingComplete = () => {
    return user?.onboarding?.completed || false;
  };

  const getCurrentPlan = () => {
    return user?.plan || user?.subscription?.plan || 'free';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    updateUserPlan,
    getCurrentPlan,
    updateUserPreferences,
    updateUserStats,
    completeOnboardingStep,
    isOnboardingComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 