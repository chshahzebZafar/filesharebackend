import React, { useState, useEffect } from 'react';
import { 
  Brain, FileText, Image, Video, Music, Archive, File, 
  Tag, Search, Lightbulb, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, BarChart3, Sparkles, Zap, Eye,
  Download, Share2, Lock, Unlock, Calendar, HardDrive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  analysis: {
    category: string;
    confidence: number;
    tags: string[];
    contentSummary?: string;
    securityScore: number;
    duplicateRisk: number;
    optimizationSuggestions: string[];
    relatedFiles: string[];
    usagePatterns: {
      downloadFrequency: number;
      shareFrequency: number;
      accessTime: string;
    };
  };
  insights: {
    type: 'info' | 'warning' | 'success' | 'error';
    message: string;
    icon: React.ReactNode;
  }[];
  recommendations: {
    action: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    impact: string;
  }[];
}

interface AIFileAnalyzerProps {
  className?: string;
}

const AIFileAnalyzer: React.FC<AIFileAnalyzerProps> = ({ className = '' }) => {
  const [analyzedFiles, setAnalyzedFiles] = useState<FileAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileAnalysis | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyzedFiles();
  }, []);

  const loadAnalyzedFiles = async () => {
    // Mock AI analysis data
    const mockAnalysis: FileAnalysis[] = [
      {
        id: '1',
        fileName: 'quarterly_report.pdf',
        fileType: 'application/pdf',
        size: 2048576,
        analysis: {
          category: 'Business Document',
          confidence: 95,
          tags: ['report', 'business', 'quarterly', 'financial', 'analysis'],
          contentSummary: 'Contains quarterly financial analysis with charts and projections. Includes revenue data, expense breakdown, and future forecasts.',
          securityScore: 85,
          duplicateRisk: 15,
          optimizationSuggestions: [
            'Consider compressing images to reduce file size by 30%',
            'Remove unused pages to optimize loading time',
            'Add password protection for sensitive financial data'
          ],
          relatedFiles: ['annual_report.pdf', 'budget_planning.xlsx', 'financial_metrics.csv'],
          usagePatterns: {
            downloadFrequency: 12,
            shareFrequency: 5,
            accessTime: 'Business hours (9 AM - 5 PM)'
          }
        },
        insights: [
          {
            type: 'info',
            message: 'This file is frequently accessed during business hours',
            icon: <Clock className="w-4 h-4" />
          },
          {
            type: 'warning',
            message: 'Contains sensitive financial data - consider encryption',
            icon: <Lock className="w-4 h-4" />
          },
          {
            type: 'success',
            message: 'File is well-organized and follows business document standards',
            icon: <CheckCircle className="w-4 h-4" />
          }
        ],
        recommendations: [
          {
            action: 'Enable encryption',
            description: 'Add password protection for sensitive financial data',
            priority: 'high',
            impact: 'High security improvement'
          },
          {
            action: 'Optimize file size',
            description: 'Compress images to reduce file size by 30%',
            priority: 'medium',
            impact: 'Better performance and storage efficiency'
          },
          {
            action: 'Add metadata tags',
            description: 'Improve searchability with additional tags',
            priority: 'low',
            impact: 'Enhanced file discovery'
          }
        ]
      },
      {
        id: '2',
        fileName: 'vacation_photos.zip',
        fileType: 'application/zip',
        size: 15728640,
        analysis: {
          category: 'Personal Media Archive',
          confidence: 88,
          tags: ['photos', 'vacation', 'personal', 'archive', 'memories'],
          contentSummary: 'Archive containing vacation photos from multiple locations. Includes landscape shots, group photos, and scenic views.',
          securityScore: 60,
          duplicateRisk: 45,
          optimizationSuggestions: [
            'Extract and organize photos into separate albums',
            'Use cloud storage for better accessibility',
            'Create backup copies for long-term preservation'
          ],
          relatedFiles: ['family_photos.zip', 'travel_photos.zip', 'event_photos.zip'],
          usagePatterns: {
            downloadFrequency: 3,
            shareFrequency: 8,
            accessTime: 'Evenings and weekends'
          }
        },
        insights: [
          {
            type: 'warning',
            message: 'Large file size may impact download performance',
            icon: <AlertTriangle className="w-4 h-4" />
          },
          {
            type: 'info',
            message: 'Frequently shared with family and friends',
            icon: <Share2 className="w-4 h-4" />
          },
          {
            type: 'success',
            message: 'Good organization with descriptive naming',
            icon: <CheckCircle className="w-4 h-4" />
          }
        ],
        recommendations: [
          {
            action: 'Extract and organize',
            description: 'Break down into smaller, themed albums',
            priority: 'high',
            impact: 'Better organization and faster access'
          },
          {
            action: 'Enable cloud sync',
            description: 'Sync to cloud storage for backup and sharing',
            priority: 'medium',
            impact: 'Improved accessibility and backup'
          },
          {
            action: 'Optimize for sharing',
            description: 'Create web-friendly versions for social sharing',
            priority: 'low',
            impact: 'Enhanced sharing experience'
          }
        ]
      }
    ];

    setAnalyzedFiles(mockAnalysis);
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis: FileAnalysis = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        analysis: {
          category: getFileCategory(file),
          confidence: Math.floor(Math.random() * 20) + 80,
          tags: generateTags(file),
          contentSummary: generateContentSummary(file),
          securityScore: Math.floor(Math.random() * 40) + 60,
          duplicateRisk: Math.floor(Math.random() * 50),
          optimizationSuggestions: generateOptimizationSuggestions(file),
          relatedFiles: [],
          usagePatterns: {
            downloadFrequency: 0,
            shareFrequency: 0,
            accessTime: 'New file'
          }
        },
        insights: generateInsights(file),
        recommendations: generateRecommendations(file)
      };

      setAnalyzedFiles(prev => [mockAnalysis, ...prev]);
      
      toast({
        title: "Analysis Complete! 🧠",
        description: `AI has analyzed "${file.name}" and found ${mockAnalysis.insights.length} insights.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFileCategory = (file: File): string => {
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type.startsWith('audio/')) return 'Audio';
    if (file.type.includes('document') || file.type.includes('pdf')) return 'Document';
    if (file.type.includes('zip') || file.type.includes('rar')) return 'Archive';
    return 'Other';
  };

  const generateTags = (file: File): string[] => {
    const tags = [];
    if (file.type.startsWith('image/')) {
      tags.push('image', 'media', 'visual');
      if (file.size > 5 * 1024 * 1024) tags.push('high-resolution');
    } else if (file.type.startsWith('video/')) {
      tags.push('video', 'media', 'motion');
      if (file.size > 50 * 1024 * 1024) tags.push('high-quality');
    } else if (file.type.includes('document')) {
      tags.push('document', 'text', 'business');
    }
    return tags;
  };

  const generateContentSummary = (file: File): string => {
    if (file.type.startsWith('image/')) {
      return 'Image file with visual content. Consider adding descriptive metadata for better organization.';
    } else if (file.type.startsWith('video/')) {
      return 'Video file with motion content. May benefit from compression for better sharing.';
    } else if (file.type.includes('document')) {
      return 'Document file containing text and potentially structured data.';
    }
    return 'File content analysis completed. Review recommendations for optimization.';
  };

  const generateOptimizationSuggestions = (file: File): string[] => {
    const suggestions = [];
    if (file.size > 10 * 1024 * 1024) {
      suggestions.push('Consider compressing to reduce file size');
    }
    if (file.type.startsWith('image/')) {
      suggestions.push('Add descriptive tags for better searchability');
    }
    if (file.type.startsWith('video/')) {
      suggestions.push('Create thumbnail for preview');
    }
    return suggestions;
  };

  const generateInsights = (file: File) => {
    const insights = [];
    
    if (file.size > 10 * 1024 * 1024) {
      insights.push({
        type: 'warning' as const,
        message: 'Large file size may impact upload and download performance',
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }
    
    if (file.type.startsWith('image/')) {
      insights.push({
        type: 'info' as const,
        message: 'Image file detected - consider adding alt text for accessibility',
        icon: <Eye className="w-4 h-4" />
      });
    }
    
    insights.push({
      type: 'success' as const,
      message: 'File successfully analyzed by AI',
      icon: <CheckCircle className="w-4 h-4" />
    });
    
    return insights;
  };

  const generateRecommendations = (file: File) => {
    const recommendations = [];
    
    if (file.size > 5 * 1024 * 1024) {
      recommendations.push({
        action: 'Optimize file size',
        description: 'Consider compression to improve performance',
        priority: 'medium' as const,
        impact: 'Better upload/download speeds'
      });
    }
    
    recommendations.push({
      action: 'Add metadata',
      description: 'Include descriptive tags and information',
      priority: 'low' as const,
      impact: 'Enhanced searchability'
    });
    
    return recommendations;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI File Analyzer</h2>
            <p className="text-gray-600 dark:text-gray-400">Intelligent insights and recommendations for your files</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowInsights(!showInsights)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showInsights ? 'Hide Insights' : 'Show Insights'}
        </Button>
      </div>

      {/* Analysis Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Files Analyzed</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{analyzedFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Insights</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {analyzedFiles.reduce((sum, file) => sum + file.insights.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimizations</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {analyzedFiles.reduce((sum, file) => sum + file.recommendations.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Accuracy</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyzed Files */}
      <div className="space-y-4">
        {analyzedFiles.map((file) => (
          <Card 
            key={file.id} 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedFile(selectedFile?.id === file.id ? null : file)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {file.fileName}
                      </h3>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                        {file.analysis.category}
                      </Badge>
                      <Badge variant="secondary">
                        {formatBytes(file.size)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>Confidence: {file.analysis.confidence}%</span>
                      <span>Security: {file.analysis.securityScore}/100</span>
                      <span>Duplicate Risk: {file.analysis.duplicateRisk}%</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {file.analysis.tags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {file.analysis.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.analysis.tags.length - 5}
                        </Badge>
                      )}
                    </div>
                    
                    {file.analysis.contentSummary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {file.analysis.contentSummary}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedFile?.id === file.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Insights */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        AI Insights
                      </h4>
                      <div className="space-y-3">
                        {file.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className={`mt-0.5 ${getInsightColor(insight.type)}`}>
                              {insight.icon}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {insight.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        {file.recommendations.map((rec, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {rec.action}
                              </h5>
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {rec.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Impact: {rec.impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimization Suggestions */}
                  {file.analysis.optimizationSuggestions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Optimization Suggestions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {file.analysis.optimizationSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  AI Analysis in Progress...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Our AI is analyzing your file content, extracting insights, and generating recommendations.
                </p>
                <Progress value={65} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIFileAnalyzer; 