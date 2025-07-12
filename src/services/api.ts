// NOTE: This API service is currently using mock data for demonstration purposes
// In production, replace the mock implementations with real API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface UploadResponse {
  success: boolean;
  fileId: string;
  shareId: string;
  downloadUrl: string;
  qrCode?: string;
  message?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  files: Array<{
    originalName: string;
    fileId: string;
    shareId: string;
    downloadUrl: string;
    qrCode?: string;
    size: number;
    error?: string;
  }>;
  message: string;
}

export interface FileInfo {
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

export interface DownloadResponse {
  success: boolean;
  file?: FileInfo;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export interface UploadOptions {
  password?: string;
  expiryDays?: number;
  maxDownloads?: number;
  oneTimeDownload?: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Mock implementation - no real API calls
  private generateMockShareId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateMockQRCode(): string {
    return `data:image/svg+xml;base64,${btoa('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12">Mock QR Code</text></svg>')}`;
  }

  async uploadSingleFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResponse> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let shareId = this.generateMockShareId();
    
    // Add one-time download identifier if enabled
    if (options.oneTimeDownload) {
      shareId = `one-time-${shareId}`;
    }
    
    const downloadUrl = `${window.location.origin}/share/${shareId}`;
    
    return {
      success: true,
      fileId: Math.random().toString(36).substring(2, 15),
      shareId,
      downloadUrl,
      qrCode: this.generateMockQRCode(),
      message: 'File uploaded successfully (mock)'
    };
  }

  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<MultipleUploadResponse> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a single share ID for all files in the batch
    let batchShareId = this.generateMockShareId();
    
    // Add one-time download identifier if enabled
    if (options.oneTimeDownload) {
      batchShareId = `one-time-${batchShareId}`;
    }
    
    const batchDownloadUrl = `${window.location.origin}/share/${batchShareId}`;
    
    const uploadedFiles = files.map(file => {
      return {
        originalName: file.name,
        fileId: Math.random().toString(36).substring(2, 15),
        shareId: batchShareId, // Use the same share ID for all files
        downloadUrl: batchDownloadUrl, // Use the same download URL for all files
        qrCode: this.generateMockQRCode(),
        size: file.size
      };
    });

    return {
      success: true,
      files: uploadedFiles,
      message: `${files.length} files uploaded successfully (mock)`
    };
  }

  async getFileInfo(shareId: string): Promise<DownloadResponse> {
    // Mock file info with more realistic data
    const mockFiles = [
      {
        originalName: 'document.pdf',
        filename: 'document.pdf',
        size: 2048576, // 2MB
        mimeType: 'application/pdf'
      },
      {
        originalName: 'image.jpg',
        filename: 'image.jpg',
        size: 1048576, // 1MB
        mimeType: 'image/jpeg'
      },
      {
        originalName: 'presentation.pptx',
        filename: 'presentation.pptx',
        size: 5242880, // 5MB
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      },
      {
        originalName: 'video.mp4',
        filename: 'video.mp4',
        size: 15728640, // 15MB
        mimeType: 'video/mp4'
      }
    ];
    
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    
    // Check if this is a one-time download (simulate by checking shareId pattern)
    const isOneTimeDownload = shareId.includes('one-time') || Math.random() < 0.3;
    
    return {
      success: true,
      file: {
        id: shareId,
        originalName: randomFile.originalName,
        filename: randomFile.filename,
        size: randomFile.size,
        mimeType: randomFile.mimeType,
        uploadDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        downloadCount: Math.floor(Math.random() * 5),
        maxDownloads: isOneTimeDownload ? 1 : 10,
        isEncrypted: false
      }
    };
  }

  async checkPasswordRequired(shareId: string): Promise<{ success: boolean; requiresPassword: boolean }> {
    return {
      success: true,
      requiresPassword: false
    };
  }

  async downloadFile(shareId: string, password?: string): Promise<Blob> {
    // Mock download - return a simple text blob
    const mockContent = `This is a mock file download for share ID: ${shareId}\n\nThis is a demonstration of the file transfer application. In a real implementation, this would be the actual file content.`;
    return new Blob([mockContent], { type: 'text/plain' });
  }

  async getUploadStats(): Promise<{ success: boolean; stats: { totalFiles: number; totalSize: number; totalShares: number } }> {
    return {
      success: true,
      stats: {
        totalFiles: 1234,
        totalSize: 1024 * 1024 * 500, // 500MB
        totalShares: 567
      }
    };
  }

  getDownloadUrl(shareId: string, password?: string): string {
    const url = new URL(`${window.location.origin}/share/${shareId}`);
    if (password) {
      url.searchParams.append('password', password);
    }
    return url.toString();
  }
}

export const apiService = new ApiService(); 