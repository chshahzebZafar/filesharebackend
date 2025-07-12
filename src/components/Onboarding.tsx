import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Upload, Share2, Download, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Onboarding: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { completeOnboardingStep, isOnboardingComplete } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FileShare!',
      description: 'Let\'s get you started with secure file sharing',
      icon: <Shield className="w-8 h-8" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Secure File Sharing Made Simple
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Upload, share, and download files with enterprise-grade security. 
              No registration required for basic use, or sign up for advanced features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Upload className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Upload</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Drag & drop or click to upload</p>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Share2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Share</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get secure links instantly</p>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Download className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Download</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access files from anywhere</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Key Features',
      description: 'Discover what makes FileShare special',
      icon: <Zap className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">End-to-End Encryption</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your files are encrypted during transfer and storage</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Password Protection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add passwords to your shared links for extra security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Expiry Dates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set automatic expiration for your shared files</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">QR Code Generation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate QR codes for easy mobile sharing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">One-Time Downloads</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create links that expire after first download</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Global Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access your files from anywhere in the world</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'get-started',
      title: 'Ready to Start?',
      description: 'Begin sharing files securely',
      icon: <Globe className="w-8 h-8" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              You're All Set!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Start uploading and sharing files right away. Your files are secure, 
              and you can track all your sharing activity in your dashboard.
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Tips:</h4>
            <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Drag and drop files directly onto the upload area
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Use password protection for sensitive files
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Set expiry dates to automatically remove old files
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Sign up to access advanced features and analytics
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      completeOnboardingStep(steps[currentStep].id);
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboardingStep(steps[currentStep].id);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    steps.forEach(step => completeOnboardingStep(step.id));
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentStepData.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
        </CardContent>
        
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding; 