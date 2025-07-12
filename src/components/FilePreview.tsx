import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Eye, EyeOff, File, Image, Video, FileText, Music, Archive, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    shareId?: string;
    downloadUrl?: string;
    qrCode?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose, onDownload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && file) {
      generatePreview();
    }
  }, [isOpen, file]);

  const generatePreview = async () => {
    setIsLoading(true);
    try {
      // For images, create a blob URL for preview
      if (file.type.startsWith('image/')) {
        // In a real app, you'd fetch the actual file
        // For now, we'll create a placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, 400, 300);
          ctx.fillStyle = '#6b7280';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Image Preview', 200, 150);
          ctx.fillText(file.name, 200, 180);
        }
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve));
        setPreviewUrl(URL.createObjectURL(blob));
      } else if (file.type.startsWith('video/')) {
        // For videos, we'd create a video element
        setPreviewUrl(null);
      } else {
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('text') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    return File;
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
        description: "Link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const getFileTypeCategory = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('text') || type.includes('document')) return 'Document';
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'Archive';
    return 'File';
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (type.startsWith('video/')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (type.startsWith('audio/')) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (type.includes('text') || type.includes('document')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  if (!isOpen) return null;

  const IconComponent = getFileIcon(file.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{file.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={getFileTypeColor(file.type)}>
                    {getFileTypeCategory(file.type)}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>
            ) : file.type.startsWith('image/') && previewUrl ? (
              <img 
                src={previewUrl} 
                alt={file.name}
                className="max-w-full max-h-[400px] object-contain rounded-lg"
              />
            ) : file.type.startsWith('video/') ? (
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Video preview not available</p>
              </div>
            ) : (
              <div className="text-center">
                <IconComponent className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Preview not available for this file type</p>
              </div>
            )}
          </div>

          {/* File Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">File Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium">{file.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="font-medium">{formatFileSize(file.size)}</span>
                </div>
                {file.shareId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Share ID:</span>
                    <span className="font-medium font-mono text-xs">{file.shareId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Actions</h4>
              <div className="space-y-3">
                {onDownload && (
                  <Button 
                    onClick={onDownload}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                )}
                
                {file.downloadUrl && (
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(file.downloadUrl!)}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Share Link
                  </Button>
                )}

                {file.qrCode && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // In a real app, you'd show a QR code modal
                      toast({
                        title: "QR Code",
                        description: "QR code feature coming soon!",
                      });
                    }}
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Share Link */}
          {file.downloadUrl && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Share Link</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={file.downloadUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(file.downloadUrl!)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FilePreview; 