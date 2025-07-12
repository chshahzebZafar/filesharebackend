
import React, { useState, useEffect, useRef } from 'react';
import { Share2, LogOut, User, BarChart3, History, Download, Settings as SettingsIcon, Crown, ChevronDown, Zap, Users, FolderOpen, Brain, MessageSquare, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, getCurrentPlan } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const getPlanBadge = () => {
    const currentPlan = getCurrentPlan();
    
    switch (currentPlan) {
      case 'pro':
        return {
          icon: <Crown className="w-3 h-3" />,
          text: 'Pro Plan',
          gradient: 'from-teal-400 to-blue-500',
          color: 'text-white'
        };
      case 'business':
        return {
          icon: <Users className="w-3 h-3" />,
          text: 'Business Plan',
          gradient: 'from-purple-400 to-pink-500',
          color: 'text-white'
        };
      default:
        return {
          icon: <Zap className="w-3 h-3" />,
          text: 'Free Plan',
          gradient: 'from-yellow-400 to-orange-500',
          color: 'text-white'
        };
    }
  };

  const planBadge = getPlanBadge();

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            FileShare
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`transition-colors duration-200 ${
              isActive('/') 
                ? 'text-teal-600 dark:text-teal-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/file-manager" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/file-manager') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Files
              </Link>
              <Link 
                to="/ai-analyzer" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/ai-analyzer') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <Brain className="w-4 h-4" />
                AI Analysis
              </Link>
              <Link 
                to="/collaboration" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/collaboration') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Collaborate
              </Link>
              <Link 
                to="/analytics" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/analytics') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
              <Link 
                to="/stats" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/stats') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </Link>
              <Link 
                to="/history" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/history') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>
              <Link 
                to="/download" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/download') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <Download className="w-4 h-4" />
                Downloads
              </Link>
              <Link 
                to="/settings" 
                className={`transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/settings') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/pricing" 
                className={`transition-colors duration-200 ${
                  isActive('/pricing') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors duration-200 ${
                  isActive('/about') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors duration-200 ${
                  isActive('/contact') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                Contact
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {/* Plan Badge */}
              <Link to="/pricing">
                <div className={`flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${planBadge.gradient} ${planBadge.color} text-xs font-medium rounded-full hover:scale-105 transition-transform`}>
                  {planBadge.icon}
                  <span className="hidden sm:inline">{planBadge.text}</span>
                </div>
              </Link>
              
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name || user?.email}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${planBadge.gradient} ${planBadge.color}`}>
                          {planBadge.icon}
                          {planBadge.text}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {getCurrentPlan() === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                    </Link>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
