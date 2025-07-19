import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, Upload, Share2, Calendar, Filter, BarChart3, PieChart, Activity, Clock, Users, FileText, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Link } from 'react-router-dom';

interface StatsData {
  totalFiles: number;
  totalDownloads: number;
  totalShares: number;
  storageUsed: number;
  storageLimit: number;
  recentActivity: Array<{
    id: string;
    type: 'upload' | 'download' | 'share';
    fileName: string;
    timestamp: string;
    size?: number;
  }>;
  topFiles: Array<{
    id: string;
    name: string;
    downloads: number;
    size: number;
    type: string;
  }>;
  monthlyStats: Array<{
    month: string;
    uploads: number;
    downloads: number;
    shares: number;
  }>;
}

const Stats = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [statsData, setStatsData] = useState<StatsData>({
    totalFiles: 0,
    totalDownloads: 0,
    totalShares: 0,
    storageUsed: 0,
    storageLimit: 2 * 1024 * 1024 * 1024,
    recentActivity: [],
    topFiles: [],
    monthlyStats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, this would fetch from API
      const mockData: StatsData = {
        totalFiles: 156,
        totalDownloads: 892,
        totalShares: 234,
        storageUsed: 1.2 * 1024 * 1024 * 1024,
        storageLimit: 2 * 1024 * 1024 * 1024,
        recentActivity: [
          { id: '1', type: 'upload', fileName: 'presentation.pdf', timestamp: '2024-01-15T10:30:00Z', size: 2048576 },
          { id: '2', type: 'download', fileName: 'document.docx', timestamp: '2024-01-15T09:15:00Z' },
          { id: '3', type: 'share', fileName: 'image.jpg', timestamp: '2024-01-15T08:45:00Z' },
          { id: '4', type: 'upload', fileName: 'video.mp4', timestamp: '2024-01-14T16:20:00Z', size: 52428800 },
          { id: '5', type: 'download', fileName: 'archive.zip', timestamp: '2024-01-14T14:30:00Z' },
          { id: '6', type: 'upload', fileName: 'report.xlsx', timestamp: '2024-01-14T11:30:00Z', size: 1048576 },
          { id: '7', type: 'share', fileName: 'photo.png', timestamp: '2024-01-14T10:15:00Z' },
          { id: '8', type: 'download', fileName: 'manual.pdf', timestamp: '2024-01-14T09:45:00Z' }
        ],
        topFiles: [
          { id: '1', name: 'presentation.pdf', downloads: 45, size: 2048576, type: 'application/pdf' },
          { id: '2', name: 'video.mp4', downloads: 38, size: 52428800, type: 'video/mp4' },
          { id: '3', name: 'document.docx', downloads: 32, size: 1048576, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          { id: '4', name: 'image.jpg', downloads: 28, size: 2097152, type: 'image/jpeg' },
          { id: '5', name: 'archive.zip', downloads: 25, size: 15728640, type: 'application/zip' }
        ],
        monthlyStats: [
          { month: 'Jan', uploads: 45, downloads: 156, shares: 23 },
          { month: 'Feb', uploads: 52, downloads: 189, shares: 31 },
          { month: 'Mar', uploads: 38, downloads: 134, shares: 19 },
          { month: 'Apr', uploads: 61, downloads: 201, shares: 28 },
          { month: 'May', uploads: 47, downloads: 167, shares: 25 },
          { month: 'Jun', uploads: 55, downloads: 178, shares: 29 }
        ]
      };

      setStatsData(mockData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  const storagePercentage = (statsData.storageUsed / statsData.storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Statistics & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your file sharing performance and usage statistics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        {user && (
          <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                    {user.plan || 'Free'} Plan
                  </Badge>
                  {user.planExpiry && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expires: {new Date(user.planExpiry).toLocaleDateString()}
                    </p>
                  )}
                  <Link to="/pricing" className="bg-teal-500 text-white px-6 py-2 mx-4 rounded-md hover:bg-teal-600 transition">Upgrade Plan</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Analytics Dashboard */}
      <AnalyticsDashboard className="mb-8" />

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Top Files
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage Breakdown */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Storage Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Used Space</span>
                    <span className="font-medium">{formatBytes(statsData.storageUsed)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        storagePercentage > 90 ? 'bg-red-500' : 
                        storagePercentage > 70 ? 'bg-yellow-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0 GB</span>
                    <span>{formatBytes(statsData.storageLimit)}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatBytes(statsData.storageLimit - statsData.storageUsed)} remaining
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Upload Success Rate</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      99.8%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Download Success Rate</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                      98.5%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Share2 className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Share Link Clicks</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                      {statsData.totalShares}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest file sharing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'upload' ? 'bg-green-100 dark:bg-green-900/20' :
                      activity.type === 'download' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      {activity.type === 'upload' && <Upload className="w-5 h-5 text-green-600" />}
                      {activity.type === 'download' && <Download className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'share' && <Share2 className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {activity.fileName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        activity.type === 'upload' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        activity.type === 'download' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                      }`}>
                        {activity.type}
                      </Badge>
                      {activity.size && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatBytes(activity.size)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Most Downloaded Files
              </CardTitle>
              <CardDescription>
                Your most popular shared files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsData.topFiles.map((file, index) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {file.downloads}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        downloads
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>
                Your activity over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-4">
                  {statsData.monthlyStats.map((month, index) => (
                    <div key={index} className="text-center">
                      <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-blue-500 transition-all duration-500"
                          style={{ 
                            height: `${((month.uploads + month.downloads + month.shares) / Math.max(...statsData.monthlyStats.map(m => m.uploads + m.downloads + m.shares))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                        {month.month}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {month.uploads + month.downloads + month.shares} total
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                    <span>Uploads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Shares</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stats; 