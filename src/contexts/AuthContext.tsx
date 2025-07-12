import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
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
  login: (email: string, name?: string) => void;
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

  useEffect(() => {
    // Check if user is authenticated on app load
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userPlan = localStorage.getItem('userPlan') || 'free';
    const planExpiry = localStorage.getItem('planExpiry');
    const userAvatar = localStorage.getItem('userAvatar');
    const userPreferences = localStorage.getItem('userPreferences');
    const userStats = localStorage.getItem('userStats');
    const userOnboarding = localStorage.getItem('userOnboarding');

    if (isAuthenticated && userEmail) {
      setUser({
        email: userEmail,
        name: userName || undefined,
        plan: userPlan,
        planExpiry: planExpiry || undefined,
        avatar: userAvatar || undefined,
        preferences: userPreferences ? JSON.parse(userPreferences) : {
          theme: 'auto',
          language: 'en',
          notifications: true,
          autoDownload: false,
          defaultPrivacy: 'private'
        },
        stats: userStats ? JSON.parse(userStats) : {
          totalUploads: 0,
          totalDownloads: 0,
          totalShares: 0,
          storageUsed: 0,
          storageLimit: 2 * 1024 * 1024 * 1024 // 2GB
        },
        onboarding: userOnboarding ? JSON.parse(userOnboarding) : {
          completed: false,
          steps: []
        }
      });
    }
    
    setLoading(false);
  }, []);

  const login = (email: string, name?: string) => {
    const userData: User = { 
      email, 
      name,
      plan: localStorage.getItem('userPlan') || 'free',
      planExpiry: localStorage.getItem('planExpiry') || undefined,
      avatar: localStorage.getItem('userAvatar') || undefined,
      preferences: {
        theme: 'auto',
        language: 'en',
        notifications: true,
        autoDownload: false,
        defaultPrivacy: 'private'
      },
      stats: {
        totalUploads: 0,
        totalDownloads: 0,
        totalShares: 0,
        storageUsed: 0,
        storageLimit: 2 * 1024 * 1024 * 1024 // 2GB
      },
      onboarding: {
        completed: false,
        steps: []
      }
    };
    
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    if (name) {
      localStorage.setItem('userName', name);
    }
    localStorage.setItem('userPreferences', JSON.stringify(userData.preferences));
    localStorage.setItem('userStats', JSON.stringify(userData.stats));
    localStorage.setItem('userOnboarding', JSON.stringify(userData.onboarding));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPlan');
    localStorage.removeItem('planExpiry');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userStats');
    localStorage.removeItem('userOnboarding');
  };

  const updateUserPlan = (plan: string) => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const updatedUser = {
      ...user!,
      plan,
      planExpiry: expiryDate.toISOString(),
    };
    
    setUser(updatedUser);
    localStorage.setItem('userPlan', plan);
    localStorage.setItem('planExpiry', expiryDate.toISOString());
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedPreferences = { ...user.preferences, ...preferences };
    const updatedUser = { ...user, preferences: updatedPreferences };
    
    setUser(updatedUser);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  const updateUserStats = (stats: Partial<User['stats']>) => {
    if (!user) return;
    
    const updatedStats = { ...user.stats, ...stats };
    const updatedUser = { ...user, stats: updatedStats };
    
    setUser(updatedUser);
    localStorage.setItem('userStats', JSON.stringify(updatedStats));
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
    localStorage.setItem('userOnboarding', JSON.stringify(updatedOnboarding));
  };

  const isOnboardingComplete = () => {
    return user?.onboarding?.completed || false;
  };

  const getCurrentPlan = () => {
    return user?.plan || localStorage.getItem('userPlan') || 'free';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
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