import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download, File, Image, FileText, Video, Music, Lock, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FileInfo {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  expiryDate?: string;
  downloadCount: number;
  maxDownloads?: number;
  isEncrypted: boolean;
}

const Share = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (shareId) {
      loadFileInfo();
    }
  }, [shareId]);

  const loadFileInfo = async () => {
    try {
      setIsLoading(true);
      
      // Check if password is required
      const passwordCheck = await apiService.checkPasswordRequired(shareId!);
      setIsPasswordProtected(passwordCheck.requiresPassword);
      
      if (passwordCheck.requiresPassword) {
        setRequiresPassword(true);
        setIsLoading(false);
        return;
      }

      // Get file info
      const response = await apiService.getFileInfo(shareId!);
      if (response.success && response.file) {
        setFileInfo(response.file);
      } else {
        toast({
          title: "File not found",
          description: "The requested file could not be found or has expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading file info:', error);
      toast({
        title: "Error",
        description: "Failed to load file information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter the password to access this file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.getFileInfo(shareId!);
      if (response.success && response.file) {
        setFileInfo(response.file);
        setRequiresPassword(false);
        setIsPasswordProtected(true);
      } else {
        toast({
          title: "Invalid password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid password",
        description: "The password you entered is incorrect.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!shareId) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Download the file
      const blob = await apiService.downloadFile(shareId, isPasswordProtected ? password : undefined);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo?.originalName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download successful!",
        description: "File has been downloaded successfully.",
      });

      // Check if this was a one-time download
      if (fileInfo?.maxDownloads === 1) {
        // Simulate link expiration
        setTimeout(() => {
          setFileInfo(null);
          toast({
            title: "Link expired",
            description: "This was a one-time download link and has now expired.",
            variant: "destructive",
          });
        }, 1000);
      }

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 1000);
    }
  };

  const copyToClipboard = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('text') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading file information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-teal-600" />
              </div>
              <CardTitle>Password Protected</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                This file is password protected. Please enter the password to continue.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              </div>
              <Button 
                onClick={handlePasswordSubmit}
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Access File'}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                File Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The requested file could not be found or has expired.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = getFileIcon(fileInfo.mimeType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-white">
                File Ready for Download
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                This file has been shared with you securely
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* File Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Name</span>
                  <span className="text-sm text-gray-900 dark:text-white font-semibold truncate max-w-xs">
                    {fileInfo.originalName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Size</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatFileSize(fileInfo.size)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(fileInfo.uploadDate)}
                  </span>
                </div>
                {fileInfo.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expires</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(fileInfo.expiryDate)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Downloads</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {fileInfo.downloadCount} {fileInfo.maxDownloads ? `/ ${fileInfo.maxDownloads}` : ''}
                  </span>
                </div>
              </div>

              {/* Download Progress */}
              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Downloading...
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round(downloadProgress)}%
                    </span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
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
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                <p>This file is shared securely through FileShare</p>
                {isPasswordProtected && (
                  <p className="mt-1">🔒 Password protected file</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Share; 