import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Key, Mail, Save, Eye, EyeOff, Globe, Download, BarChart3, HardDrive, FileText, Upload, Calendar, TrendingUp, AlertCircle, CheckCircle, Crown, Zap, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PlanLimits {
  storageLimit: number; // in bytes
  dailyUploads: number;
  maxFileSize: number; // in bytes
  retentionDays: number;
  features: string[];
}

const Settings = () => {
  const { isAuthenticated, user, logout, getCurrentPlan } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile settings
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [downloadNotifications, setDownloadNotifications] = useState(true);
  const [shareNotifications, setShareNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(false);
  const [showFileSizes, setShowFileSizes] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  
  // Download settings
  const [autoDownload, setAutoDownload] = useState(false);
  const [downloadLocation, setDownloadLocation] = useState('default');
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState('3');

  // Usage stats
  const [usageStats, setUsageStats] = useState({
    storageUsed: 0,
    filesUploaded: 0,
    dailyUploads: 0,
    totalDownloads: 0,
    totalShares: 0
  });

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.name) {
      setName(user.name);
    }
    loadUsageStats();
  }, [user]);

  const loadUsageStats = async () => {
    // Mock usage stats - in real app, this would fetch from API
    const mockStats = {
      storageUsed: user?.stats?.storageUsed || 1.2 * 1024 * 1024 * 1024, // 1.2GB
      filesUploaded: user?.stats?.totalUploads || 15,
      dailyUploads: 3,
      totalDownloads: user?.stats?.totalDownloads || 45,
      totalShares: user?.stats?.totalShares || 8
    };
    setUsageStats(mockStats);
  };

  const getPlanLimits = (): PlanLimits => {
    const currentPlan = getCurrentPlan();
    
    switch (currentPlan) {
      case 'pro':
        return {
          storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
          dailyUploads: -1, // unlimited
          maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
          retentionDays: 30,
          features: [
            'Advanced encryption',
            'Priority support',
            'Custom branding',
            'Password protection',
            'Download analytics',
            'Unlimited transfers'
          ]
        };
      case 'business':
        return {
          storageLimit: 50 * 1024 * 1024 * 1024, // 50GB
          dailyUploads: -1, // unlimited
          maxFileSize: 50 * 1024 * 1024 * 1024, // 50GB
          retentionDays: 90,
          features: [
            'Enterprise encryption',
            '24/7 priority support',
            'Full white-label',
            'Advanced analytics',
            'Team management',
            'API access',
            'Custom integrations'
          ]
        };
      default: // free
        return {
          storageLimit: 2 * 1024 * 1024 * 1024, // 2GB
          dailyUploads: 5,
          maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
          retentionDays: 7,
          features: [
            'Basic encryption',
            'Standard support',
            'File sharing',
            'QR code generation'
          ]
        };
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-teal-500';
  };

  const getPlanIcon = () => {
    const currentPlan = getCurrentPlan();
    switch (currentPlan) {
      case 'pro': return <Crown className="w-5 h-5" />;
      case 'business': return <Users className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getPlanBadge = () => {
    const currentPlan = getCurrentPlan();
    switch (currentPlan) {
      case 'pro': return { text: 'Pro Plan', gradient: 'from-teal-400 to-blue-500' };
      case 'business': return { text: 'Business Plan', gradient: 'from-purple-400 to-pink-500' };
      default: return { text: 'Free Plan', gradient: 'from-yellow-400 to-orange-500' };
    }
  };

  const planLimits = getPlanLimits();
  const planBadge = getPlanBadge();
  const storagePercentage = getUsagePercentage(usageStats.storageUsed, planLimits.storageLimit);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password changed!",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to access settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage your account preferences and security
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Globe },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                {/* Current Plan Overview */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getPlanIcon()}
                      Current Plan
                    </CardTitle>
                    <CardDescription>
                      Your current plan and usage limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className={`bg-gradient-to-r ${planBadge.gradient} text-white`}>
                          {planBadge.text}
                        </Badge>
                        {user?.planExpiry && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Expires: {new Date(user.planExpiry).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/pricing'}
                        className="flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        {getCurrentPlan() === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Storage Usage */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5" />
                      Storage Usage
                    </CardTitle>
                    <CardDescription>
                      Monitor your storage consumption
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Used Storage
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatBytes(usageStats.storageUsed)} / {formatBytes(planLimits.storageLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getUsageColor(storagePercentage)}`}
                        style={{ width: `${storagePercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>0 GB</span>
                      <span>{formatBytes(planLimits.storageLimit)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {storagePercentage >= 90 ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className={storagePercentage >= 90 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {storagePercentage >= 90 
                          ? 'Storage almost full! Consider upgrading your plan.' 
                          : `${formatBytes(planLimits.storageLimit - usageStats.storageUsed)} remaining`
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Limits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded Today</span>
                        <span className="font-medium">{usageStats.dailyUploads}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Daily Limit</span>
                        <span className="font-medium">
                          {planLimits.dailyUploads === -1 ? 'Unlimited' : planLimits.dailyUploads}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Max File Size</span>
                        <span className="font-medium">{formatBytes(planLimits.maxFileSize)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">File Retention</span>
                        <span className="font-medium">{planLimits.retentionDays} days</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Activity Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Files</span>
                        <span className="font-medium">{usageStats.filesUploaded}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</span>
                        <span className="font-medium">{usageStats.totalDownloads}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Shares</span>
                        <span className="font-medium">{usageStats.totalShares}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Account Created</span>
                        <span className="font-medium">
                          {user?.planExpiry ? new Date(user.planExpiry).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plan Features */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Plan Features
                    </CardTitle>
                    <CardDescription>
                      Features included in your current plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {planLimits.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upgrade CTA */}
                {getCurrentPlan() === 'free' && (
                  <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-700">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Need More Storage?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Upgrade to Pro or Business plan for more storage, unlimited uploads, and advanced features.
                        </p>
                        <Button 
                          onClick={() => window.location.href = '/pricing'}
                          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                        >
                          View Plans
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="currentPassword"
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handleChangePassword} disabled={isLoading}>
                      {isLoading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Choose which notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Download Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified when someone downloads your files
                        </p>
                      </div>
                      <Switch
                        checked={downloadNotifications}
                        onCheckedChange={setDownloadNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Share Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notifications about shared file activity
                        </p>
                      </div>
                      <Switch
                        checked={shareNotifications}
                        onCheckedChange={setShareNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Public Profile</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow others to see your profile information
                        </p>
                      </div>
                      <Switch
                        checked={publicProfile}
                        onCheckedChange={setPublicProfile}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Show File Sizes</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Display file sizes in shared links
                        </p>
                      </div>
                      <Switch
                        checked={showFileSizes}
                        onCheckedChange={setShowFileSizes}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow us to collect usage analytics
                        </p>
                      </div>
                      <Switch
                        checked={allowAnalytics}
                        onCheckedChange={setAllowAnalytics}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'downloads' && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your download preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Auto Download</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically download files when clicked
                        </p>
                      </div>
                      <Switch
                        checked={autoDownload}
                        onCheckedChange={setAutoDownload}
                      />
                    </div>
                    <div>
                      <Label htmlFor="downloadLocation">Download Location</Label>
                      <Select value={downloadLocation} onValueChange={setDownloadLocation}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Downloads Folder</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="custom">Custom Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxDownloads">Max Concurrent Downloads</Label>
                      <Select value={maxConcurrentDownloads} onValueChange={setMaxConcurrentDownloads}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 