import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get redirect path from URL params or location state
  const redirectTo = searchParams.get('redirect') || 
                    (location.state as any)?.from?.pathname || 
                    '/';

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use auth context to login with real API
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });

        // Redirect to the original destination or home
        navigate(redirectTo, { replace: true });
      } else {
        // Handle specific error cases
        if (result.message?.toLowerCase().includes('invalid credentials') || 
            result.message?.toLowerCase().includes('wrong password')) {
          setErrors({ password: 'Invalid email or password' });
        } else if (result.message?.toLowerCase().includes('user not found') ||
                   result.message?.toLowerCase().includes('email not found')) {
          setErrors({ email: 'No account found with this email address' });
        } else if (result.message?.toLowerCase().includes('account locked') ||
                   result.message?.toLowerCase().includes('account suspended')) {
          setErrors({ general: 'Account is locked. Please contact support.' });
        } else {
          setErrors({ general: result.message || 'Login failed. Please try again.' });
        }

        toast({
          title: "Login failed",
          description: result.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else if (error.status === 429) {
        setErrors({ general: 'Too many login attempts. Please wait a moment before trying again.' });
      } else if (error.status === 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }

      toast({
        title: "Login failed",
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
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <Card className="w-full shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign in to access your share links
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) clearErrors();
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
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) clearErrors();
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
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Forgot Password?</Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 