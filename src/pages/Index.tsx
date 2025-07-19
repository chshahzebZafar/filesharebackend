import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, ArrowRight, CheckCircle, Check, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { RequestFilesCard } from '@/components/RequestFilesCard';
import { WorldMap } from '@/components/WorldMap';
import { TransitionText } from '@/components/TransitionText';

const Index = () => {
  const { t } = useTranslation();

  // Features for the hero section
  const features = [
    {
      icon: Shield,
      title: t('home.features.secure', 'Secure & Private'),
      description: t('home.features.secureDesc', 'End-to-end encryption ensures your files are protected during transfer and storage.')
    },
    {
      icon: Zap,
      title: t('home.features.fast', 'Lightning Fast'),
      description: t('home.features.fastDesc', 'Upload and share files up to 2GB with our optimized infrastructure.')
    },
    {
      icon: Globe,
      title: t('home.features.global', 'Share Anywhere'),
      description: t('home.features.globalDesc', 'Generate secure links and QR codes to share files across any device or platform.')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Request Files Card at the top */}
      <div className="py-12 flex justify-center">
        <RequestFilesCard />
      </div>
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/5 to-purple-500/10 dark:from-teal-500/5 dark:via-blue-500/5 dark:to-purple-500/5 animate-pulse"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-blue-400/30 to-teal-500/30 rounded-full blur-md animate-bounce" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
          <div className="absolute top-60 right-1/3 w-8 h-8 bg-gradient-to-br from-green-400/25 to-blue-400/25 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                linear-gradient(180deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-teal-400/60 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
                <TransitionText as="span">{t('home.hero.title', 'Share Files Instantly')}</TransitionText>
              </h1>
              
              {/* Glowing effect behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-3xl -z-10 animate-pulse"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
              <TransitionText as="span">{t('home.hero.subtitle', 'Send files up to 2GB quickly and securely.')}</TransitionText>
            </p>

            {/* Enhanced feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${index === 0 ? 'border-teal-200 dark:border-teal-700' : index === 1 ? 'border-blue-200 dark:border-blue-700' : 'border-purple-200 dark:border-purple-700'}`}>
                  <feature.icon className={`w-4 h-4 ${index === 0 ? 'text-teal-600' : index === 1 ? 'text-blue-600' : 'text-purple-600'}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <TransitionText>{feature.title}</TransitionText>
                  </span>
                </div>
              ))}
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {/* These stats are not loaded from an API, so they will be 0 */}
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Files Shared</div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {/* These stats are not loaded from an API, so they will be 0 */}
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Transfers</div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {/* These stats are not loaded from an API, so they will be 0 */}
                  {/* formatBytes is not defined, so it will show 0 Bytes */}
                  0 Bytes
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Data Transferred</div>
              </div>
            </div>
          </div>
          {/* Enhanced Upload Section */}
          <div className="animate-slide-up relative" style={{ animationDelay: '0.9s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-3xl blur-3xl"></div>
            {/* The FileUpload component was removed, so this section is now empty */}
          </div>

          {/* Enhanced Success State */}
          {/* This section is no longer relevant as file upload is removed */}
          {/* Keeping it for now, but it will always be empty */}
          {/* {uploadedFiles.length > 0 && (
            <div className="max-w-2xl mx-auto mt-8 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 animate-scale-in relative overflow-hidden">
              {/* Success background effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl"></div> */}
              
              {/* <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white ml-4">
                    Files uploaded successfully!
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-lg">
                  {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready to share
                </p>
                
                {isAuthenticated ? (
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setShowLinkSettings(true)}
                      className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 border-0"
                    >
                      Generate Share Link
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/download'}
                      className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      View Downloads
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Sign in to generate share links and access advanced features
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 border-0"
                      >
                        Sign In
                        <ArrowRight className="w-5 h-5 animate-pulse" />
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/signup'}
                        className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </section>



      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-50/30 to-transparent dark:via-gray-800/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Why Choose FileShare?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-up">
              Built with modern technology and security best practices to give you the best file sharing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Activity Map Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
                <TransitionText as="span">Global Community</TransitionText>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-up">
                <TransitionText as="span">See where our users are sharing files around the world</TransitionText>
              </p>
            </div>
            
            <WorldMap className="animate-scale-in" />
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Ready to Upgrade?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              Choose the perfect plan for your file sharing needs. Upgrade or downgrade at any time.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold px-10 py-5 text-xl rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Ready to start sharing?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto animate-slide-up">
            Join thousands of users who trust FileShare for their file sharing needs.
          </p>
          <Button 
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold px-10 py-5 text-xl rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/25 animate-scale-in"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Sharing Now
          </Button>
        </div>
      </section>

      {/* LinkSettings and Onboarding components were removed, so they are no longer rendered */}
    </div>
  );
};

export default Index;
