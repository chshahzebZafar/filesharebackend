import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Upload, Download, Share2, Eye, Calendar, Search, Filter, FileText, Image, Video, Archive, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryItem {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete';
  fileName: string;
  fileSize: number;
  date: string;
  time: string;
  shareId?: string;
  downloadCount?: number;
  fileType: string;
}

const History = () => {
  const { isAuthenticated, user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (isAuthenticated) {
      const mockHistory: HistoryItem[] = [
        {
          id: '1',
          type: 'upload',
          fileName: 'presentation.pdf',
          fileSize: 2048576,
          date: '2024-01-15',
          time: '14:30',
          shareId: 'abc123',
          downloadCount: 5,
          fileType: 'application/pdf'
        },
        {
          id: '2',
          type: 'download',
          fileName: 'image.jpg',
          fileSize: 1048576,
          date: '2024-01-14',
          time: '16:45',
          fileType: 'image/jpeg'
        },
        {
          id: '3',
          type: 'share',
          fileName: 'document.docx',
          fileSize: 512000,
          date: '2024-01-13',
          time: '09:15',
          shareId: 'def456',
          downloadCount: 2,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        {
          id: '4',
          type: 'upload',
          fileName: 'video.mp4',
          fileSize: 15728640,
          date: '2024-01-12',
          time: '11:20',
          shareId: 'ghi789',
          downloadCount: 8,
          fileType: 'video/mp4'
        },
        {
          id: '5',
          type: 'delete',
          fileName: 'old-file.zip',
          fileSize: 1048576,
          date: '2024-01-11',
          time: '13:10',
          fileType: 'application/zip'
        }
      ];
      
      setHistory(mockHistory);
      setFilteredHistory(mockHistory);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = history;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
      } else if (sortBy === 'name') {
        return a.fileName.localeCompare(b.fileName);
      } else if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });

    setFilteredHistory(filtered);
  }, [history, searchTerm, filterType, sortBy]);

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
      case 'delete': return Trash2;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'download': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'share': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'delete': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    return FileText;
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'upload': return 'Uploaded';
      case 'download': return 'Downloaded';
      case 'share': return 'Shared';
      case 'delete': return 'Deleted';
      default: return 'Modified';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your history
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Track all your file sharing activities
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
            Activity History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all your file sharing activities and operations
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="upload">Uploads</SelectItem>
                  <SelectItem value="download">Downloads</SelectItem>
                  <SelectItem value="share">Shares</SelectItem>
                  <SelectItem value="delete">Deletions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="size">Size (Largest)</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setSortBy('date');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No activity found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start uploading files to see your activity history'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => {
              const ActivityIcon = getActivityIcon(item.type);
              const FileIcon = getFileIcon(item.fileType);
              
              return (
                <Card key={item.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getActivityColor(item.type)}`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileIcon className="w-4 h-4 text-gray-500" />
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.fileName}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatBytes(item.fileSize)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date} at {item.time}
                          </span>
                          <span className="text-teal-600 dark:text-teal-400 font-medium">
                            {getActivityLabel(item.type)}
                          </span>
                          {item.downloadCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {item.downloadCount} downloads
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {item.shareId && (
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary */}
        {filteredHistory.length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg mt-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredHistory.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatBytes(filteredHistory.reduce((sum, item) => sum + item.fileSize, 0))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredHistory.filter(item => item.type === 'upload').length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
};

export default History; 