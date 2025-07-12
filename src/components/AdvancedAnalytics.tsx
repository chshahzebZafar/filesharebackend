import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Download, Share2, FileText, 
  Calendar, Clock, Globe, Smartphone, Monitor, HardDrive,
  ArrowUpRight, ArrowDownRight, Eye, Star, Lock, Unlock,
  Filter, Download as DownloadIcon, Upload, Trash2, EyeOff,
  BarChart, PieChart, Activity, Target, Zap, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
  overview: {
    totalFiles: number;
    totalDownloads: number;
    totalShares: number;
    totalUsers: number;
    storageUsed: number;
    storageLimit: number;
    activeUsers: number;
    conversionRate: number;
  };
  trends: {
    date: string;
    uploads: number;
    downloads: number;
    shares: number;
    users: number;
  }[];
  fileTypes: {
    type: string;
    count: number;
    size: number;
    percentage: number;
  }[];
  topFiles: {
    id: string;
    name: string;
    downloads: number;
    shares: number;
    size: number;
    type: string;
    createdAt: string;
  }[];
  userActivity: {
    hour: number;
    activity: number;
  }[];
  geographicData: {
    country: string;
    users: number;
    downloads: number;
    percentage: number;
  }[];
  deviceStats: {
    device: string;
    users: number;
    percentage: number;
  }[];
  securityMetrics: {
    encryptedFiles: number;
    passwordProtected: number;
    expiredLinks: number;
    suspiciousActivity: number;
  };
  performanceMetrics: {
    avgUploadSpeed: number;
    avgDownloadSpeed: number;
    uptime: number;
    responseTime: number;
  };
}

interface AdvancedAnalyticsProps {
  className?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ className = '' }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalFiles: 1247,
          totalDownloads: 8943,
          totalShares: 2156,
          totalUsers: 342,
          storageUsed: 45.7,
          storageLimit: 100,
          activeUsers: 89,
          conversionRate: 23.4
        },
        trends: [
          { date: '2024-01-01', uploads: 45, downloads: 234, shares: 67, users: 12 },
          { date: '2024-01-02', uploads: 52, downloads: 289, shares: 78, users: 15 },
          { date: '2024-01-03', uploads: 38, downloads: 198, shares: 45, users: 11 },
          { date: '2024-01-04', uploads: 67, downloads: 345, shares: 89, users: 18 },
          { date: '2024-01-05', uploads: 43, downloads: 267, shares: 56, users: 14 },
          { date: '2024-01-06', uploads: 58, downloads: 312, shares: 73, users: 16 },
          { date: '2024-01-07', uploads: 49, downloads: 298, shares: 64, users: 13 }
        ],
        fileTypes: [
          { type: 'Images', count: 456, size: 12.3, percentage: 36.5 },
          { type: 'Documents', count: 234, size: 8.7, percentage: 18.8 },
          { type: 'Videos', count: 189, size: 15.2, percentage: 15.2 },
          { type: 'Audio', count: 123, size: 4.1, percentage: 9.9 },
          { type: 'Archives', count: 98, size: 3.8, percentage: 7.9 },
          { type: 'Other', count: 147, size: 1.6, percentage: 11.8 }
        ],
        topFiles: [
          { id: '1', name: 'presentation.pdf', downloads: 234, shares: 45, size: 2.4, type: 'PDF', createdAt: '2024-01-01' },
          { id: '2', name: 'vacation_photos.zip', downloads: 189, shares: 67, size: 15.7, type: 'ZIP', createdAt: '2024-01-02' },
          { id: '3', name: 'report.docx', downloads: 156, shares: 34, size: 1.8, type: 'DOCX', createdAt: '2024-01-03' },
          { id: '4', name: 'video_tutorial.mp4', downloads: 134, shares: 28, size: 45.2, type: 'MP4', createdAt: '2024-01-04' },
          { id: '5', name: 'data_analysis.xlsx', downloads: 98, shares: 23, size: 0.8, type: 'XLSX', createdAt: '2024-01-05' }
        ],
        userActivity: [
          { hour: 0, activity: 12 }, { hour: 1, activity: 8 }, { hour: 2, activity: 5 },
          { hour: 3, activity: 3 }, { hour: 4, activity: 2 }, { hour: 5, activity: 4 },
          { hour: 6, activity: 8 }, { hour: 7, activity: 15 }, { hour: 8, activity: 34 },
          { hour: 9, activity: 67 }, { hour: 10, activity: 89 }, { hour: 11, activity: 76 },
          { hour: 12, activity: 45 }, { hour: 13, activity: 67 }, { hour: 14, activity: 89 },
          { hour: 15, activity: 98 }, { hour: 16, activity: 87 }, { hour: 17, activity: 76 },
          { hour: 18, activity: 65 }, { hour: 19, activity: 54 }, { hour: 20, activity: 43 },
          { hour: 21, activity: 32 }, { hour: 22, activity: 21 }, { hour: 23, activity: 15 }
        ],
        geographicData: [
          { country: 'United States', users: 156, downloads: 2345, percentage: 45.6 },
          { country: 'United Kingdom', users: 67, downloads: 987, percentage: 19.6 },
          { country: 'Germany', users: 45, downloads: 678, percentage: 13.2 },
          { country: 'Canada', users: 34, downloads: 456, percentage: 8.9 },
          { country: 'Australia', users: 23, downloads: 345, percentage: 6.7 },
          { country: 'Other', users: 17, downloads: 232, percentage: 6.0 }
        ],
        deviceStats: [
          { device: 'Desktop', users: 234, percentage: 68.4 },
          { device: 'Mobile', users: 89, percentage: 26.0 },
          { device: 'Tablet', users: 19, percentage: 5.6 }
        ],
        securityMetrics: {
          encryptedFiles: 456,
          passwordProtected: 234,
          expiredLinks: 67,
          suspiciousActivity: 3
        },
        performanceMetrics: {
          avgUploadSpeed: 12.5,
          avgDownloadSpeed: 45.2,
          uptime: 99.8,
          responseTime: 245
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600 dark:text-green-400';
    if (current < previous) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (isLoading || !data) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading analytics...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Gathering comprehensive data insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and performance metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
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
          
          <Button variant="outline" size="sm">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(data.overview.totalFiles)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.overview.totalFiles, 1200)}
                  <span className="text-sm text-green-600 dark:text-green-400">+3.9%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(data.overview.totalDownloads)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.overview.totalDownloads, 8500)}
                  <span className="text-sm text-green-600 dark:text-green-400">+12.4%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.overview.activeUsers}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.overview.activeUsers, 85)}
                  <span className="text-sm text-green-600 dark:text-green-400">+4.7%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.overview.storageUsed}GB
                </p>
                <div className="mt-2">
                  <Progress value={(data.overview.storageUsed / data.overview.storageLimit) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {data.overview.storageLimit}GB total
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Types Distribution */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              File Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.fileTypes.map((fileType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {fileType.type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {fileType.count} files • {formatBytes(fileType.size * 1024 * 1024 * 1024)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fileType.percentage}%
                    </p>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{
                          width: `${fileType.percentage}%`,
                          backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Files */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topFiles.map((file, index) => (
                <div key={file.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatBytes(file.size * 1024 * 1024 * 1024)}</span>
                      <span>•</span>
                      <span>{file.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {file.downloads}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      downloads
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity by Hour */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              User Activity by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-1">
              {data.userActivity.map((hour, index) => {
                const maxActivity = Math.max(...data.userActivity.map(h => h.activity));
                const height = (hour.activity / maxActivity) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {hour.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.geographicData.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {country.country}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {country.users} users
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {country.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Security Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.performanceMetrics.avgUploadSpeed} MB/s
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Upload Speed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.performanceMetrics.avgDownloadSpeed} MB/s
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Download Speed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.performanceMetrics.uptime}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.performanceMetrics.responseTime}ms
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.securityMetrics.encryptedFiles}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Encrypted Files</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.securityMetrics.passwordProtected}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Password Protected</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {data.securityMetrics.expiredLinks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expired Links</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {data.securityMetrics.suspiciousActivity}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suspicious Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 