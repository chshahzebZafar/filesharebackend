
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  file: File;
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          )
        );

        if (progress === 100 && index === newFiles.length - 1) {
          setTimeout(() => {
            onFilesUploaded([...files, ...newFiles]);
          }, 500);
        }
      }, 200);
    });
  }, [files, onFilesUploaded]);

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
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept="*/*"
        />
        
        <div className={`transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
          <Upload className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${isDragOver ? 'text-teal-500' : 'text-gray-400'}`} />
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Drop files here or click to browse
          </h2>
          <p className="text-gray-500 mb-6">
            Upload files up to 2GB. All file types supported.
          </p>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
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
