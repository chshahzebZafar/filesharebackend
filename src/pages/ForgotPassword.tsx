import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.forgotPassword(email);
      if (response.success) {
        setSubmitted(true);
        toast({
          title: 'Check your email',
          description: response.message || 'If an account with that email exists, a password reset link has been sent.',
        });
      } else {
        // Handle specific error cases
        if (response.message?.toLowerCase().includes('user not found') ||
            response.message?.toLowerCase().includes('email not found')) {
          setErrors({ email: 'No account found with this email address' });
        } else if (response.message?.toLowerCase().includes('too many requests') ||
                   response.message?.toLowerCase().includes('rate limit')) {
          setErrors({ general: 'Too many reset attempts. Please wait a moment before trying again.' });
        } else if (response.message?.toLowerCase().includes('invalid email')) {
          setErrors({ email: 'Please enter a valid email address' });
        } else {
          setErrors({ general: response.message || 'Could not send reset email. Please try again.' });
        }

        toast({
          title: 'Request failed',
          description: response.message || 'Could not send reset email.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else if (error.status === 429) {
        setErrors({ general: 'Too many reset attempts. Please wait a moment before trying again.' });
      } else if (error.status === 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }

      toast({
        title: 'Request failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your email to receive a password reset link.
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
                    Check your email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    If an account with that email exists, a password reset link has been sent.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Don't see the email? Check your spam folder.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to="/login"
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                  >
                    Back to Login
                  </Link>
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

                <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
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

export default ForgotPassword; 