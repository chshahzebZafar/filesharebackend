import React, { useState, useEffect } from 'react';
import { Download as DownloadIcon, X, File as FileIcon, Image, FileText, Video, Music, Copy, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  file: File;
  shareId?: string;
  downloadUrl?: string;
  qrCode?: string;
}

const Download = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Load uploaded files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        setUploadedFiles(files);
      } catch (error) {
        console.error('Error loading saved files:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('text') || type.includes('document')) return FileText;
    return FileIcon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Share link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (file: UploadedFile) => {
    if (!file.shareId) {
      toast({
        title: "Download failed",
        description: "No share ID available for this file.",
        variant: "destructive",
      });
      return;
    }

    setDownloadingFiles(prev => new Set(prev).add(file.id));
    setDownloadProgress(prev => ({ ...prev, [file.id]: 0 }));

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const currentProgress = prev[file.id] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [file.id]: currentProgress + Math.random() * 10 };
        });
      }, 200);

      // Download the file
      const blob = await apiService.downloadFile(file.shareId);
      
      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [file.id]: 100 }));

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download successful!",
        description: `${file.name} has been downloaded.`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
      setTimeout(() => {
        setDownloadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.id];
          return newProgress;
        });
      }, 1000);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "File has been removed from your list.",
    });
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    toast({
      title: "All files cleared",
      description: "All files have been removed from your list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Files
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Download and manage your uploaded files. All your files are securely stored and ready to download.
            </p>
          </div>

          {/* Files Section */}
          <div className="max-w-4xl mx-auto">
            {uploadedFiles.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No files uploaded yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Upload some files to see them here
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Go to Upload
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Header with clear all button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Uploaded Files ({uploadedFiles.length})
                  </h2>
                  <Button
                    variant="outline"
                    onClick={clearAllFiles}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedFiles.map((file) => {
                    const IconComponent = getFileIcon(file.type);
                    const isDownloading = downloadingFiles.has(file.id);
                    const progress = downloadProgress[file.id] || 0;
                    
                    return (
                      <Card key={file.id} className="hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-8 h-8 text-teal-600" />
                              <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white truncate max-w-xs">
                                  {file.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Download Progress */}
                          {isDownloading && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Downloading...
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}

                          {/* Share URL */}
                          {file.downloadUrl && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Share Link
                              </label>
                              <div className="flex gap-2">
                                <input
                                  value={file.downloadUrl}
                                  readOnly
                                  className="flex-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(file.downloadUrl!)}
                                  className="shrink-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDownload(file)}
                              disabled={isDownloading}
                              className="flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                              {isDownloading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Downloading...
                                </>
                              ) : (
                                                              <>
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Download
                              </>
                              )}
                            </Button>
                            {file.downloadUrl && (
                              <Button
                                variant="outline"
                                onClick={() => window.open(file.downloadUrl, '_blank')}
                                className="shrink-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Download; 