import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get redirect path from URL params or location state
  const redirectTo = searchParams.get('redirect') || 
                    (location.state as any)?.from?.pathname || 
                    '/';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field: keyof typeof errors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData: RegisterRequest = {
        username,
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      };

      const result = await register(userData);
      
      if (result.success) {
        toast({
          title: "Account created!",
          description: "Welcome to our platform!",
        });

        // Redirect to the original destination or home
        navigate(redirectTo, { replace: true });
      } else {
        // Handle specific error cases
        if (result.message?.toLowerCase().includes('username already exists') ||
            result.message?.toLowerCase().includes('username taken')) {
          setErrors({ username: 'Username is already taken. Please choose a different one.' });
        } else if (result.message?.toLowerCase().includes('email already exists') ||
                   result.message?.toLowerCase().includes('email taken')) {
          setErrors({ email: 'An account with this email already exists. Please use a different email or try logging in.' });
        } else if (result.message?.toLowerCase().includes('invalid email')) {
          setErrors({ email: 'Please enter a valid email address.' });
        } else if (result.message?.toLowerCase().includes('password') && 
                   result.message?.toLowerCase().includes('weak')) {
          setErrors({ password: 'Password is too weak. Please choose a stronger password.' });
        } else {
          setErrors({ general: result.message || 'Registration failed. Please try again.' });
        }

        toast({
          title: "Signup failed",
          description: result.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else if (error.status === 429) {
        setErrors({ general: 'Too many registration attempts. Please wait a moment before trying again.' });
      } else if (error.status === 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }

      toast({
        title: "Signup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Join us to start sharing files securely
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* General Error Alert */}
            {errors.general && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) clearFieldError('username');
                  }}
                  className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                    errors.username ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) clearFieldError('firstName');
                    }}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) clearFieldError('lastName');
                    }}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) clearFieldError('email');
                  }}
                  className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) clearFieldError('password');
                    }}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 pr-10 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) clearFieldError('confirmPassword');
                    }}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 pr-10 ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link 
                  to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 