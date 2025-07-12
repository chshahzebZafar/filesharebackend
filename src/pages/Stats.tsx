import React, { useState, useEffect } from 'react';
import { BarChart3, Upload, Download, Share2, Eye, Calendar, TrendingUp, FileText, Image, Video, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

const Stats = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    totalShares: 0,
    totalDownloads: 0,
    totalViews: 0,
    filesThisMonth: 0,
    downloadsThisMonth: 0,
    storageUsed: 0,
    storageLimit: 2 * 1024 * 1024 * 1024,
  });

  const [fileTypeStats, setFileTypeStats] = useState({
    images: 0,
    documents: 0,
    videos: 0,
    archives: 0,
    others: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'upload',
      fileName: 'presentation.pdf',
      date: '2024-01-15',
      size: 2048576,
    },
    {
      id: 2,
      type: 'download',
      fileName: 'image.jpg',
      date: '2024-01-14',
      size: 1048576,
    },
    {
      id: 3,
      type: 'share',
      fileName: 'document.docx',
      date: '2024-01-13',
      size: 512000,
    },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadStats = async () => {
        try {
          const response = await apiService.getUploadStats();
          if (response.success) {
            setStats(prev => ({
              ...prev,
              totalFiles: response.stats.totalFiles,
              totalSize: response.stats.totalSize,
              totalShares: response.stats.totalShares,
            }));
          }
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      };

      loadStats();
    }
  }, [isAuthenticated]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return Upload;
      case 'download': return Download;
      case 'share': return Share2;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'download': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'share': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your stats
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Track your file sharing activity and performance
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your file sharing performance and activity
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalFiles}
                </div>
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDownloads}
                </div>
                <Download className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Shares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalShares}
                </div>
                <Share2 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatBytes(stats.storageUsed)}
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Progress */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>
              {formatBytes(stats.storageUsed)} of {formatBytes(stats.storageLimit)} used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  stats.storageUsed / stats.storageLimit > 0.9 ? 'bg-red-500' : 
                  stats.storageUsed / stats.storageLimit > 0.7 ? 'bg-yellow-500' : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min((stats.storageUsed / stats.storageLimit) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formatBytes(stats.storageLimit - stats.storageUsed)} remaining
            </p>
          </CardContent>
        </Card>

        {/* File Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle>File Types</CardTitle>
              <CardDescription>Distribution of your uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Images</span>
                  </div>
                  <span className="text-sm font-medium">{fileTypeStats.images}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <span className="text-sm font-medium">{fileTypeStats.documents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Videos</span>
                  </div>
                  <span className="text-sm font-medium">{fileTypeStats.videos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Archives</span>
                  </div>
                  <span className="text-sm font-medium">{fileTypeStats.archives}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest file operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.date} • {formatBytes(activity.size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Your activity over the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.filesThisMonth}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.downloadsThisMonth}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Stats; 