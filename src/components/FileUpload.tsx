
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Video, Music, Copy, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiService, UploadResponse, MultipleUploadResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QRCodeCanvas } from 'qrcode.react';
import { RequestFilesAdvancedCard } from './RequestFilesAdvancedCard';
import { RequestFilesCard } from './RequestFilesCard';

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

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onFileRemoved?: (fileId: string) => void;
  oneTimeDownload?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, onFileRemoved, oneTimeDownload = false }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Upload options state
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState<number | undefined>(undefined);
  const [expiresAt, setExpiresAt] = useState('');
  const [tags, setTags] = useState<string>('');
  const [bundleName, setBundleName] = useState<string>('');

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sharedFiles, setSharedFiles] = useState<UploadedFile[]>([]);

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

  const handleFiles = useCallback(async (fileList: FileList) => {
    // Prevent multiple simultaneous uploads
    if (isUploading) {
      console.log('Upload already in progress, ignoring new files');
      return;
    }
    
    console.log('handleFiles called with', fileList.length, 'files');
    
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      file
    }));

    console.log('New files to upload:', newFiles.map(f => f.name));

    // Clear any existing files and start fresh with the new batch
    setFiles(newFiles);
    setIsUploading(true);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setFiles(prev => 
        prev.map(f => {
          if (newFiles.some(nf => nf.id === f.id) && f.progress < 90) {
            return { ...f, progress: Math.min(f.progress + Math.random() * 15, 90) };
          }
          return f;
        })
      );
    }, 200);

    try {
      // Always use the multiple files upload API for consistency
      // This ensures all files get the same share link
      const fileArray = newFiles.map(f => f.file);
      console.log('Uploading', fileArray.length, 'files as batch');
      
      const response = await apiService.uploadMultipleFiles(fileArray, {
        public: isPublic,
        password: password || undefined,
        maxDownloads: maxDownloads !== undefined ? maxDownloads : undefined,
        expiresAt: expiresAt || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        bundleName: bundleName || undefined,
      });
      
      clearInterval(progressInterval);
      
      console.log('Upload response:', response);
      if (!response || response.success === false) {
        throw new Error(response?.message || 'Upload failed');
      }
      
      // Get the shared download URL from the first file (they all have the same URL now)
      const sharedDownloadUrl = response.files[0]?.downloadUrl;
      const sharedShareId = response.files[0]?.shareId;
      
      console.log('Shared URL:', sharedDownloadUrl);
      console.log('Shared Share ID:', sharedShareId);
      
      const updatedFiles = newFiles.map((file, index) => {
        const uploadResult = response.files[index];
        if (uploadResult && !uploadResult.error) {
          return {
            ...file,
            progress: 100,
            shareId: sharedShareId, // Use the same share ID for all files
            downloadUrl: sharedDownloadUrl, // Use the same download URL for all files
            qrCode: uploadResult.qrCode
          };
        }
        return { ...file, progress: 100 };
      });

      console.log('Updated files with shared link:', updatedFiles.map(f => ({ name: f.name, url: f.downloadUrl })));

      setFiles(updatedFiles);
      setSharedFiles(updatedFiles);
      setShowShareDialog(true);

      const successMessage = newFiles.length === 1 
        ? "Your file has been uploaded and is ready to share."
        : `Uploaded ${response.files.filter(f => !f.error).length} files with a single share link.`;

      toast({
        title: "Upload successful!",
        description: successMessage,
      });

      onFilesUploaded(updatedFiles);
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error?.message || (typeof error === 'string' ? error : 'Failed to upload files'),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [onFilesUploaded, toast, isPublic, password, maxDownloads, expiresAt, tags, bundleName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File input triggered with', files.length, 'files');
      handleFiles(files);
      // Clear the input value to allow selecting the same files again
      e.target.value = '';
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    onFileRemoved?.(id);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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

  // Reset state when share dialog closes
  const handleShareDialogChange = (open: boolean) => {
    setShowShareDialog(open);
    if (!open) {
      setFiles([]);
      setSharedFiles([]);
      setIsPublic(true);
      setPassword('');
      setMaxDownloads(undefined);
      setExpiresAt('');
      setTags('');
      setBundleName('');
    }
  };

  // Add restriction for unverified users
  if (user && !user.isEmailVerified) {
    return (
      <div className="p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-center">
        <p className="mb-2 font-semibold">Email Verification Required</p>
        <p className="mb-4">You must verify your email address before uploading files. Please check your inbox for a verification link.</p>
        <Button disabled className="opacity-60 cursor-not-allowed">Upload Disabled</Button>
      </div>
    );
  }

  // Hide upload options and drop area when share dialog is open
  if (showShareDialog) {
    return (
      <Dialog open={showShareDialog} onOpenChange={handleShareDialogChange}>
        <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <Link className="w-6 h-6" /> Share Your Files
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
              Share this link with others to give them access to your files. You can copy the link or scan the QR code.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4 flex flex-col gap-4">
            {/* Share Link & Copy */}
            {sharedFiles[0]?.downloadUrl && (
              <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg px-3 py-2">
                <div className="flex-1 text-xs text-teal-700 dark:text-teal-200 truncate">
                  {sharedFiles[0].downloadUrl}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(sharedFiles[0].downloadUrl!)}
                  className="h-7 w-7 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100 dark:hover:bg-teal-950/40"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
            {/* QR Code */}
            {sharedFiles[0]?.qrCode && (
              <div className="flex justify-center">
                <QRCodeCanvas value={sharedFiles[0].downloadUrl!} size={120} fgColor="#14b8a6" bgColor="transparent" />
              </div>
            )}
            {/* File List (Scrollable) */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 max-h-48 overflow-hidden">
              <ScrollArea className="h-48 w-full p-2">
                <ul className="space-y-2">
                  {sharedFiles.map((file) => {
                    const IconComponent = getFileIcon(file.type);
                    return (
                      <li key={file.id} className="flex items-center gap-3 p-2 rounded hover:bg-teal-50 dark:hover:bg-teal-900/30 transition">
                        <IconComponent className="w-5 h-5 text-gray-500" />
                        <span className="flex-1 truncate text-gray-800 dark:text-gray-200">{file.name}</span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="px-6 pb-4 flex justify-end">
            <Button onClick={() => handleShareDialogChange(false)} className="bg-teal-600 hover:bg-teal-700 text-white">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

<RequestFilesCard />


      {files.length > 0 && isUploading && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Uploading Files ({files.length})
          </h3>
          {files.map((file) => {
            const IconComponent = getFileIcon(file.type);
            return (
              <div key={file.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">
                        {file.name}
                      </p>
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
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {file.progress < 100 ? 'Uploading...' : 'Complete'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round(file.progress)}%
                    </span>
                  </div>
                  <Progress value={file.progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
