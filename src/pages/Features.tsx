import React, { useState } from 'react';
import { 
  Share2, Brain, Users, BarChart3, FolderOpen, MessageSquare, 
  TrendingUp, Zap, Shield, Globe, Smartphone, Monitor, 
  ArrowRight, CheckCircle, Star, Lock, Unlock, Download,
  Upload, Eye, Edit, Clock, HardDrive, Sparkles, Award,
  Play, Pause, Maximize, Minimize, Settings, Target, File
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Features: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState<string>('file-sharing');

  const features = [
    {
      id: 'file-sharing',
      title: 'Advanced File Sharing',
      subtitle: 'Secure, fast, and intelligent file sharing',
      icon: <Share2 className="w-8 h-8" />,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Share files with advanced security features, password protection, and customizable expiry dates.',
      highlights: [
        'One-time download links',
        'Password protection',
        'Custom expiry dates',
        'QR code generation',
        'Email sharing with multiple recipients',
        'Real-time upload progress'
      ],
      demo: {
        type: 'upload',
        title: 'Try File Upload',
        description: 'Experience our advanced file upload with real-time progress and intelligent categorization'
      }
    },
    {
      id: 'ai-analysis',
      title: 'AI-Powered File Analysis',
      subtitle: 'Intelligent insights and recommendations',
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Our AI analyzes your files to provide smart categorization, content insights, and optimization recommendations.',
      highlights: [
        'Smart file categorization',
        'Content-based analysis',
        'Security risk assessment',
        'Optimization suggestions',
        'Duplicate detection',
        'Usage pattern analysis'
      ],
      demo: {
        type: 'analysis',
        title: 'AI Analysis Demo',
        description: 'See how AI analyzes files and provides intelligent insights'
      }
    },
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      subtitle: 'Work together seamlessly',
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-green-500 to-teal-600',
      description: 'Collaborate in real-time with team members, add comments, and track changes with live notifications.',
      highlights: [
        'Live file editing',
        'Real-time comments',
        'User presence indicators',
        'Activity tracking',
        'Version control',
        'Team workspaces'
      ],
      demo: {
        type: 'collaboration',
        title: 'Collaboration Demo',
        description: 'Experience real-time collaboration features'
      }
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      subtitle: 'Comprehensive insights and metrics',
      icon: <BarChart3 className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-600',
      description: 'Get detailed analytics on file usage, user behavior, and performance metrics with beautiful visualizations.',
      highlights: [
        'Usage analytics',
        'Performance metrics',
        'Geographic insights',
        'Device statistics',
        'Security metrics',
        'Custom reports'
      ],
      demo: {
        type: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Explore comprehensive analytics and insights'
      }
    },
    {
      id: 'file-management',
      title: 'Advanced File Management',
      subtitle: 'Organize and manage files efficiently',
      icon: <FolderOpen className="w-8 h-8" />,
      gradient: 'from-indigo-500 to-blue-600',
      description: 'Powerful file management with folder organization, bulk operations, and intelligent search capabilities.',
      highlights: [
        'Folder organization',
        'Bulk operations',
        'Advanced search',
        'File tagging',
        'Duplicate detection',
        'Storage optimization'
      ],
      demo: {
        type: 'management',
        title: 'File Manager Demo',
        description: 'Explore our advanced file management system'
      }
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      subtitle: 'Bank-level security and compliance',
      icon: <Shield className="w-8 h-8" />,
      gradient: 'from-emerald-500 to-green-600',
      description: 'Enterprise-grade security with encryption, access controls, and compliance features for business users.',
      highlights: [
        'End-to-end encryption',
        'Access controls',
        'Audit trails',
        'Compliance features',
        'IP whitelisting',
        'Advanced permissions'
      ],
      demo: {
        type: 'security',
        title: 'Security Features',
        description: 'Learn about our security measures'
      }
    }
  ];

  const getActiveFeature = () => {
    return features.find(f => f.id === activeFeature) || features[0];
  };

  const renderDemo = (feature: any) => {
    switch (feature.demo.type) {
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Drag & Drop Files Here
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Or click to browse files
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Choose Files
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Upload Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">AI Analysis</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyzing file content...
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Security Score</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  95% Secure
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Insights</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• File categorized as "Business Document"</li>
                <li>• Contains sensitive financial data</li>
                <li>• Recommend encryption for security</li>
              </ul>
            </div>
          </div>
        );

      case 'collaboration':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  J
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  S
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                  M
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                3 people editing
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">John is typing...</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Sarah viewing document</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  J
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Great work on the executive summary!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">1,247</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">8,943</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
              </div>
            </div>
            <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-end justify-between p-4">
              {[20, 45, 30, 60, 40, 80, 65].map((height, index) => (
                <div
                  key={index}
                  className="w-6 bg-gradient-to-t from-orange-500 to-red-600 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Weekly activity trend
            </p>
          </div>
        );

      case 'management':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">/ Documents / Work</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                <File className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-900 dark:text-white">presentation.pdf</span>
                <Badge variant="secondary" className="ml-auto">2.4 MB</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                <File className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-900 dark:text-white">report.docx</span>
                <Badge variant="secondary" className="ml-auto">1.8 MB</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                <FolderOpen className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-900 dark:text-white">Images</span>
                <Badge variant="secondary" className="ml-auto">15.7 MB</Badge>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                <Lock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Encrypted</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Protected</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Password</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security Features</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• AES-256 encryption</li>
                <li>• SSL/TLS secure transfer</li>
                <li>• Access logging</li>
                <li>• Compliance ready</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the powerful features that make our file sharing platform the most advanced solution for individuals and businesses.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeFeature === feature.id
                  ? 'bg-gradient-to-r text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={{
                background: activeFeature === feature.id ? `linear-gradient(to right, var(--tw-gradient-stops))` : undefined,
                '--tw-gradient-from': activeFeature === feature.id ? feature.gradient.split(' ')[1] : undefined,
                '--tw-gradient-to': activeFeature === feature.id ? feature.gradient.split(' ')[3] : undefined,
              } as React.CSSProperties}
            >
              {feature.title}
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Feature Details */}
          <div className="space-y-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${getActiveFeature().gradient} rounded-xl flex items-center justify-center text-white`}>
              {getActiveFeature().icon}
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getActiveFeature().title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {getActiveFeature().subtitle}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {getActiveFeature().description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Features
              </h3>
              <ul className="space-y-2">
                {getActiveFeature().highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated ? (
              <Link to={`/${getActiveFeature().id.replace('-', '-')}`}>
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                  Try {getActiveFeature().title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 w-full">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  No credit card required • 14-day free trial
                </p>
              </div>
            )}
          </div>

          {/* Feature Demo */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                {getActiveFeature().demo.title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {getActiveFeature().demo.description}
              </p>
            </CardHeader>
            <CardContent>
              {renderDemo(getActiveFeature())}
            </CardContent>
          </Card>
        </div>

        {/* All Features Grid */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            All Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{feature.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.highlights.slice(0, 3).map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who trust our platform for their file sharing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Features; 