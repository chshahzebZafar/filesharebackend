import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
  plan?: string;
  planExpiry?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  loading: boolean;
  updateUserPlan: (plan: string) => void;
  getCurrentPlan: () => string;
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

    if (isAuthenticated && userEmail) {
      setUser({
        email: userEmail,
        name: userName || undefined,
        plan: userPlan,
        planExpiry: planExpiry || undefined,
      });
    }
    
    setLoading(false);
  }, []);

  const login = (email: string, name?: string) => {
    const userData = { 
      email, 
      name,
      plan: localStorage.getItem('userPlan') || 'free',
      planExpiry: localStorage.getItem('planExpiry') || undefined,
    };
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    if (name) {
      localStorage.setItem('userName', name);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPlan');
    localStorage.removeItem('planExpiry');
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 