import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download, File, Image, FileText, Video, Music, Lock, Eye, Copy, X } from 'lucide-react';
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

interface CollectionInfo {
  _id: string;
  name: string;
  files: FileInfo[];
  title: string;
  message: string;
  recipients: any[];
  createdAt: string;
  updatedAt: string;
}

interface ShareInfo {
  _id: string;
  type: 'file' | 'folder' | 'collection';
  resource: FileInfo | CollectionInfo;
  owner: {
    username: string;
  };
  access: {
    type: 'public' | 'password' | 'email';
    expiresAt?: string;
    maxDownloads?: number;
    downloadCount: number;
  };
  settings: {
    allowDownload: boolean;
    allowPreview: boolean;
    allowComments: boolean;
  };
  createdAt: string;
  shareUrl: string;
}

const Share = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const { toast } = useToast();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [lastDownloadUrl, setLastDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (shareId) {
      loadFileInfo();
    }
  }, [shareId]);

  const loadFileInfo = async () => {
    try {
      setIsLoading(true);
      
      // Get share info
      const response = await apiService.getShareInfo(shareId!);
      if (response.success && response.data?.share) {
        const share = response.data.share;
        
        // Check if password is required
        if (share.access.type === 'password') {
          setIsPasswordProtected(true);
          setRequiresPassword(true);
          setIsLoading(false);
          return;
        }
        
        setShareInfo(share);
      } else {
        toast({
          title: "Share not found",
          description: response.message || "The requested share could not be found or has expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading share info:', error);
      toast({
        title: "Error",
        description: "Failed to load share information.",
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
        description: "Please enter the password to access this share.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.getShareInfo(shareId!);
      if (response.success && response.data?.share) {
        setShareInfo(response.data.share);
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

  // Remove old handleDownload and replace with new logic
  const handleDownload = async () => {
    if (!shareId || !shareInfo) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Download from backend endpoint
      const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/download/share/${shareId}`;
      const response = await fetch(downloadUrl, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to download file(s)');
      }
      const blob = await response.blob();
      clearInterval(progressInterval);
      setDownloadProgress(100);
      // Determine filename
      let filename = 'download';
      if (isCollection) {
        filename = ((resource as CollectionInfo).name || 'collection') + '.zip';
      } else {
        filename = (resource as FileInfo).originalName || 'download';
      }
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setLastDownloadUrl(downloadUrl);
      setShowDownloadModal(true);
      toast({
        title: 'Download successful!',
        description: isCollection ? 'ZIP file has been downloaded.' : 'File has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file(s)',
        variant: 'destructive',
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
                This share is password protected. Please enter the password to continue.
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
                {isLoading ? 'Verifying...' : 'Access Share'}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shareInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Share Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The requested share could not be found or has expired.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const isCollection = shareInfo.type === 'collection';
  const resource = shareInfo.resource;
  const IconComponent = isCollection ? File : getFileIcon((resource as FileInfo).mimeType);

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
                {isCollection ? 'Files Ready for Download' : 'File Ready for Download'}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {isCollection ? 'These files have been shared with you securely' : 'This file has been shared with you securely'}
              </p>
              {isCollection && (resource as CollectionInfo).title && (
                <div className="mt-2">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {(resource as CollectionInfo).title}
                  </h4>
                  {(resource as CollectionInfo).message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {(resource as CollectionInfo).message}
                    </p>
                  )}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Share Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                {isCollection ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Collection Name</span>
                      <span className="text-sm text-gray-900 dark:text-white font-semibold truncate max-w-xs">
                        {(resource as CollectionInfo).name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Files</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {(resource as CollectionInfo).files.length} file{(resource as CollectionInfo).files.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Size</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatFileSize((resource as CollectionInfo).files.reduce((total, file) => total + file.size, 0))}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Name</span>
                      <span className="text-sm text-gray-900 dark:text-white font-semibold truncate max-w-xs">
                        {(resource as FileInfo).originalName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Size</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatFileSize((resource as FileInfo).size)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Shared by</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {shareInfo.owner.username}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Shared on</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(shareInfo.createdAt)}
                  </span>
                </div>
                {shareInfo.access.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expires</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(shareInfo.access.expiresAt)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Downloads</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {shareInfo.access.downloadCount} {shareInfo.access.maxDownloads ? `/ ${shareInfo.access.maxDownloads}` : ''}
                  </span>
                </div>
              </div>

              {/* Files List for Collections */}
              {isCollection && (resource as CollectionInfo).files.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Files in this collection:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(resource as CollectionInfo).files.map((file, index) => (
                      <div key={file.id || index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {React.createElement(getFileIcon(file.mimeType), { className: "w-4 h-4 text-gray-500 flex-shrink-0" })}
                          <span className="text-sm text-gray-900 dark:text-white truncate">
                            {file.originalName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                      {isCollection ? 'Download All Files' : 'Download File'}
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
                <p>This {isCollection ? 'collection' : 'file'} is shared securely through FileShare</p>
                {isPasswordProtected && (
                  <p className="mt-1">🔒 Password protected {isCollection ? 'collection' : 'file'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setShowDownloadModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Download Complete</h3>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">Your download has started. You can use the links below to share or download again:</div>
            <div className="mb-3">
              <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Share Link:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 px-2 py-1 rounded border text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
                <Button size="sm" onClick={() => {navigator.clipboard.writeText(window.location.href); toast({title: 'Copied!', description: 'Share link copied to clipboard.'});}}>Copy</Button>
              </div>
            </div>
            <div className="mb-3">
              <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Direct Download Link:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={lastDownloadUrl || ''}
                  className="flex-1 px-2 py-1 rounded border text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
                <Button size="sm" onClick={() => {if(lastDownloadUrl) navigator.clipboard.writeText(lastDownloadUrl); toast({title: 'Copied!', description: 'Download link copied to clipboard.'});}}>Copy</Button>
              </div>
            </div>
            <Button className="w-full mt-2" onClick={() => setShowDownloadModal(false)}>Close</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Share; 