// NOTE: This API service is currently using mock data for demonstration purposes
// In production, replace the mock implementations with real API calls
// const API_BASE_URL = 'http://localhost:3001/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      email: string;
      username: string;
      firstName?: string;
      lastName?: string;
      isEmailVerified: boolean;
      subscription: {
        plan: string;
        status: string;
        features: string[];
      };
      storage: {
        used: number;
        limit: number;
      };
      settings?: {
        theme: string;
        language: string;
        notifications: {
          email: boolean;
          push: boolean;
        };
      };
    };
    token: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
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

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  // Make authenticated API request
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }

  // Real Authentication APIs
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting registration with:', { ...userData, password: '[HIDDEN]' });
      console.log('🌐 API URL:', `${this.baseUrl}/auth/register`);
      
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Registration response status:', response.status);
      const data = await response.json();
      console.log('📡 Registration response data:', data);

      if (data.success && data.data?.token) {
        this.setAuthToken(data.data.token);
        console.log('✅ Registration successful, token stored');
      } else {
        console.log('❌ Registration failed:', data.message);
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          return {
            success: false,
            message: errorMessages,
          };
        }
      }

      return data;
    } catch (error) {
      console.error('🚨 Registration error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to server. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { ...credentials, password: '[HIDDEN]' });
      console.log('🌐 API URL:', `${this.baseUrl}/auth/login`);
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Login response status:', response.status);
      const data = await response.json();
      console.log('📡 Login response data:', data);

      if (data.success && data.data?.token) {
        this.setAuthToken(data.data.token);
        console.log('✅ Login successful, token stored');
      } else {
        console.log('❌ Login failed:', data.message);
        
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          return {
            success: false,
            message: errorMessages,
          };
        }
      }

      return data;
    } catch (error) {
      console.error('🚨 Login error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to server. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        message: 'Login failed. Please check your credentials and try again.',
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/me');
      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, remove it
        if (response.status === 401) {
          this.removeAuthToken();
        }
        return {
          success: false,
          message: data.message || 'Failed to get user data',
        };
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: 'Failed to get user data',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeAuthenticatedRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reset email. Please try again.',
      };
    }
  }

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to verify email. Please try again.' };
    }
  }

  async resendVerification(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/resend-verification', {
        method: 'POST',
      });
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to resend verification email. Please try again.' };
    }
  }

  async updateProfile(profileData: { firstName?: string; lastName?: string; avatar?: string }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update profile.' };
    }
  }

  async updateSettings(settingsData: { theme?: string; language?: string; notifications?: { email?: boolean; push?: boolean } }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update settings.' };
    }
  }

  // Update user subscription plan
  async updateUserPlan(plan: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 API: Updating user plan to:', plan);
      console.log('🔑 API: Auth token:', this.getAuthToken() ? 'Present' : 'Missing');
      
      const response = await this.makeAuthenticatedRequest('/auth/update-plan', {
        method: 'PUT',
        body: JSON.stringify({ plan }),
      });

      console.log('📡 API: Update plan response status:', response.status);
      console.log('📡 API: Update plan response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📡 API: Update plan response data:', data);

      if (data.success) {
        console.log('✅ API: Plan updated successfully');
        return {
          success: true,
          message: data.message,
          data: data.data
        };
      } else {
        console.log('❌ API: Plan update failed:', data.message);
        return {
          success: false,
          message: data.message || 'Failed to update plan'
        };
      }
    } catch (error) {
      console.error('🚨 API: Update plan error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to server. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to update plan. Please try again.',
      };
    }
  }

  // Health check for API availability
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    try {
      console.log('🏥 Checking backend health at:', `${this.baseUrl.replace('/api', '')}/health`);
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
      const data = await response.json();
      console.log('🏥 Backend health response:', data);
      return data;
    } catch (error) {
      console.error('🚨 Backend health check failed:', error);
      // Return mock health data if API is not available
      return {
        status: 'mock',
        timestamp: new Date().toISOString(),
        uptime: 0
      };
    }
  }

  // Test backend connection
  async testBackendConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      console.log('🔍 Testing backend connection...');
      const healthData = await this.healthCheck();
      
      if (healthData.status === 'mock') {
        return {
          connected: false,
          message: 'Backend server is not running. Please start the backend server first.'
        };
      }
      
      return {
        connected: true,
        message: `Backend is running (${healthData.status})`
      };
    } catch (error) {
      console.error('🚨 Backend connection test failed:', error);
      return {
        connected: false,
        message: 'Cannot connect to backend server. Please check if the server is running.'
      };
    }
  }

  async getFileInfo(shareId: string): Promise<DownloadResponse> {
    try {
      console.log('📄 Getting file info for share:', shareId);
      console.log('🌐 API URL:', `${this.baseUrl}/share/public/${shareId}`);
      
      const response = await fetch(`${this.baseUrl}/share/public/${shareId}`);
      console.log('📡 File info response status:', response.status);
      
      const data = await response.json();
      console.log('📡 File info response data:', data);

      if (data.success && data.data?.share?.resource) {
        const file = data.data.share.resource;
        return {
          success: true,
          file: {
            id: file._id,
            originalName: file.originalName,
            filename: file.name,
            size: file.size,
            mimeType: file.mimeType,
            uploadDate: file.createdAt,
            expiryDate: data.data.share.access.expiresAt,
            downloadCount: data.data.share.access.downloadCount,
            maxDownloads: data.data.share.access.maxDownloads,
            isEncrypted: false
          }
        };
      }

      return {
        success: false,
        message: data.message || 'File not found'
      };
    } catch (error) {
      console.error('🚨 Get file info error:', error);
      return {
        success: false,
        message: 'Failed to get file information'
      };
    }
  }

  async checkPasswordRequired(shareId: string): Promise<{ success: boolean; requiresPassword: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/share/public/${shareId}`);
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          requiresPassword: data.data.share.access.type === 'password'
        };
      }

      return {
        success: false,
        requiresPassword: false
      };
    } catch (error) {
      console.error('🚨 Check password required error:', error);
      return {
        success: false,
        requiresPassword: false
      };
    }
  }

  async downloadFile(shareId: string, password?: string): Promise<Blob> {
    try {
      console.log('📥 Downloading file from share:', shareId);
      
      let url = `${this.baseUrl}/download/share/${shareId}`;
      if (password) {
        url += `?password=${encodeURIComponent(password)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('✅ File downloaded successfully:', blob.size, 'bytes');
      
      return blob;
    } catch (error) {
      console.error('🚨 File download error:', error);
      throw error;
    }
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

  /**
   * Upload multiple files with options (public, password, maxDownloads, expiresAt, tags, etc.)
   * @param files Array of File objects
   * @param options { public, password, maxDownloads, expiresAt, tags, bundleName }
   */
  async uploadMultipleFiles(
    files: File[],
    options: {
      public?: boolean;
      password?: string;
      maxDownloads?: number;
      expiresAt?: string;
      tags?: string[];
      bundleName?: string;
    } = {}
  ): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (options.public !== undefined) formData.append('public', String(options.public));
    if (options.password) formData.append('password', options.password);
    if (options.maxDownloads !== undefined) formData.append('maxDownloads', String(options.maxDownloads));
    if (options.expiresAt) formData.append('expiresAt', options.expiresAt);
    if (options.tags && options.tags.length > 0) formData.append('tags', JSON.stringify(options.tags));
    if (options.bundleName) formData.append('bundleName', options.bundleName);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    const data = await response.json();
    console.log('🚀 ~ ApiService Response ~ uploadMultipleFiles ~ data:', data);
    return data.data || data;
  }

  async createShare(shareData: {
    type: 'file' | 'folder' | 'collection';
    resourceId: string;
    access: {
      type: 'public' | 'password' | 'email';
      password?: string;
      emails?: string[];
      expiresAt?: string;
      maxDownloads?: number;
    };
    settings?: {
      allowDownload?: boolean;
      allowPreview?: boolean;
      allowComments?: boolean;
    };
  }): Promise<any> {
    try {
      console.log('🔗 Creating share with data:', shareData);
      
      const response = await this.makeAuthenticatedRequest('/share', {
        method: 'POST',
        body: JSON.stringify(shareData),
      });

      const data = await response.json();
      console.log('🔗 Share creation response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to create share',
        };
      }

      return data;
    } catch (error) {
      console.error('🚨 Create share error:', error);
      return {
        success: false,
        message: 'Failed to create share',
      };
    }
  }

  async getShareInfo(shareId: string): Promise<any> {
    try {
      console.log('🔗 Getting share info for:', shareId);
      
      const response = await fetch(`${this.baseUrl}/share/public/${shareId}`);
      const data = await response.json();
      
      console.log('🔗 Share info response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to get share info',
        };
      }

      return data;
    } catch (error) {
      console.error('🚨 Get share info error:', error);
      return {
        success: false,
        message: 'Failed to get share info',
      };
    }
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function uploadFilesWithProgress(
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload/multiple`, true);
    xhr.withCredentials = true;

    // Attach JWT token if present
    const token = localStorage.getItem('authToken');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });
}

export const apiService = new ApiService(); 