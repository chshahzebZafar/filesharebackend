import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
    general?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!token) {
      newErrors.token = 'Reset token is missing. Please use the link from your email.';
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.resetPassword(token, password);
      if (response.success) {
        setSubmitted(true);
        toast({
          title: 'Password reset successful',
          description: 'You can now log in with your new password.',
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle specific error cases
        if (response.message?.toLowerCase().includes('invalid token') ||
            response.message?.toLowerCase().includes('expired token')) {
          setErrors({ token: 'Reset link is invalid or has expired. Please request a new password reset.' });
        } else if (response.message?.toLowerCase().includes('weak password') ||
                   response.message?.toLowerCase().includes('password too weak')) {
          setErrors({ password: 'Password is too weak. Please choose a stronger password.' });
        } else if (response.message?.toLowerCase().includes('same password')) {
          setErrors({ password: 'New password must be different from your current password.' });
        } else {
          setErrors({ general: response.message || 'Could not reset password. Please try again.' });
        }

        toast({
          title: 'Reset failed',
          description: response.message || 'Could not reset password.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else if (error.status === 400) {
        setErrors({ token: 'Reset link is invalid or has expired. Please request a new password reset.' });
      } else if (error.status === 429) {
        setErrors({ general: 'Too many reset attempts. Please wait a moment before trying again.' });
      } else if (error.status === 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }

      toast({
        title: 'Reset failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
          <Card className="w-full shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                The password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please request a new password reset link from the login page.
                </AlertDescription>
              </Alert>
              <Link
                to="/forgot-password"
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
              >
                Request New Reset Link
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login Button */}
        <div className="mb-6">
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
        <Card className="w-full shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Password Reset Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can now log in with your new password.
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* General Error Alert */}
                {errors.general && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Token Error Alert */}
                {errors.token && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.token}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
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
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
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
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 