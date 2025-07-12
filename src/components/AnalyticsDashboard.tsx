import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, FileText, Download, Upload, Clock, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
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
  fileTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    uploads: number;
    downloads: number;
    shares: number;
  }>;
}

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalFiles: 0,
    totalDownloads: 0,
    totalShares: 0,
    storageUsed: 0,
    storageLimit: 2 * 1024 * 1024 * 1024, // 2GB
    recentActivity: [],
    fileTypeDistribution: [],
    dailyStats: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // Mock data - in real app, this would fetch from API
    const mockData: AnalyticsData = {
      totalFiles: 156,
      totalDownloads: 892,
      totalShares: 234,
      storageUsed: 1.2 * 1024 * 1024 * 1024, // 1.2GB
      storageLimit: 2 * 1024 * 1024 * 1024, // 2GB
      recentActivity: [
        { id: '1', type: 'upload', fileName: 'presentation.pdf', timestamp: '2024-01-15T10:30:00Z', size: 2048576 },
        { id: '2', type: 'download', fileName: 'document.docx', timestamp: '2024-01-15T09:15:00Z' },
        { id: '3', type: 'share', fileName: 'image.jpg', timestamp: '2024-01-15T08:45:00Z' },
        { id: '4', type: 'upload', fileName: 'video.mp4', timestamp: '2024-01-14T16:20:00Z', size: 52428800 },
        { id: '5', type: 'download', fileName: 'archive.zip', timestamp: '2024-01-14T14:30:00Z' }
      ],
      fileTypeDistribution: [
        { type: 'Images', count: 45, percentage: 28.8 },
        { type: 'Documents', count: 38, percentage: 24.4 },
        { type: 'Videos', count: 25, percentage: 16.0 },
        { type: 'Archives', count: 22, percentage: 14.1 },
        { type: 'Audio', count: 15, percentage: 9.6 },
        { type: 'Other', count: 11, percentage: 7.1 }
      ],
      dailyStats: [
        { date: '2024-01-09', uploads: 12, downloads: 45, shares: 8 },
        { date: '2024-01-10', uploads: 18, downloads: 52, shares: 12 },
        { date: '2024-01-11', uploads: 15, downloads: 38, shares: 9 },
        { date: '2024-01-12', uploads: 22, downloads: 67, shares: 15 },
        { date: '2024-01-13', uploads: 19, downloads: 43, shares: 11 },
        { date: '2024-01-14', uploads: 25, downloads: 58, shares: 18 },
        { date: '2024-01-15', uploads: 16, downloads: 41, shares: 10 }
      ]
    };

    setAnalyticsData(mockData);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-green-600" />;
      case 'download': return <Download className="w-4 h-4 text-blue-600" />;
      case 'share': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'download': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'share': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const storagePercentage = (analyticsData.storageUsed / analyticsData.storageLimit) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your file sharing activity and performance</p>
        </div>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Files
            </CardTitle>
            <FileText className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analyticsData.totalFiles.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analyticsData.totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Shares
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analyticsData.totalShares.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Storage Used
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatBytes(analyticsData.storageUsed)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {storagePercentage.toFixed(1)}% of {formatBytes(analyticsData.storageLimit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Progress */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Used Space</span>
              <span className="font-medium">{formatBytes(analyticsData.storageUsed)}</span>
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
              <span>{formatBytes(analyticsData.storageLimit)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              File Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.fileTypeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#14b8a6', '#3b82f6', '#8b5cf6', 
                          '#f59e0b', '#ef4444', '#6b7280'
                        ][index % 6]
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} files
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                  {activity.size && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBytes(activity.size)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Stats Chart */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Daily Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {analyticsData.dailyStats.map((day, index) => {
                const maxValue = Math.max(...analyticsData.dailyStats.map(d => d.uploads + d.downloads + d.shares));
                const total = day.uploads + day.downloads + day.shares;
                const height = (total / maxValue) * 100;
                
                return (
                  <div key={index} className="text-center">
                    <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-blue-500 transition-all duration-500"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {total}
                    </p>
                  </div>
                );
              })}
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
    </div>
  );
};

export default AnalyticsDashboard; 