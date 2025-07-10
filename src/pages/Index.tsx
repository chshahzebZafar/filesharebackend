
import React, { useState } from 'react';
import { Shield, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import LinkSettings from '@/components/LinkSettings';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  file: File;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showLinkSettings, setShowLinkSettings] = useState(false);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setShowLinkSettings(true);
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your files are protected during transfer and storage."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload and share files up to 2GB with our optimized infrastructure."
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description: "Generate secure links and QR codes to share files across any device or platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 dark:from-teal-500/5 dark:to-blue-500/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Share Files
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              Send files up to 2GB quickly and securely. No registration required.
              <br />
              Just upload, share, and download.
            </p>
          </div>

          {/* Upload Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FileUpload onFilesUploaded={handleFilesUploaded} />
          </div>

          {/* Success State */}
          {uploadedFiles.length > 0 && (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Files uploaded successfully!
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready to share
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowLinkSettings(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  Generate Share Link
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose FileShare?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Built with modern technology and security best practices to give you the best file sharing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start sharing?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust FileShare for their file sharing needs.
          </p>
          <Button 
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-200 hover:scale-105"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Sharing Now
          </Button>
        </div>
      </section>

      <Footer />

      {/* Link Settings Modal */}
      <LinkSettings 
        isOpen={showLinkSettings} 
        onClose={() => setShowLinkSettings(false)} 
      />
    </div>
  );
};

export default Index;
