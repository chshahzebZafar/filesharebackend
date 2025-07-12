
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Calendar, Lock, Link, Copy, QrCode, Download, Mail, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator';

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

interface LinkSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedFiles?: UploadedFile[];
}

const LinkSettings: React.FC<LinkSettingsProps> = ({ isOpen, onClose, uploadedFiles = [] }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [expiryTime, setExpiryTime] = useState('7');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [newEmail, setNewEmail] = useState('');
  const [oneTimeDownload, setOneTimeDownload] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const generateLink = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate a share link.",
        variant: "destructive",
      });
      // Redirect to login with current page as redirect parameter
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      onClose(); // Close the modal
      return;
    }

    // This will be handled by the parent component now
    // The link is already generated during upload
    setShowQR(true);
    
    toast({
      title: "Link ready!",
      description: "Your secure transfer link is ready to share.",
    });
  };

  const addEmail = () => {
    if (newEmail.trim() && !emails.includes(newEmail.trim())) {
      setEmails([...emails, newEmail.trim()]);
      setNewEmail('');
    }
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const sendEmails = async () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    if (validEmails.length === 0) {
      toast({
        title: "No valid emails",
        description: "Please add at least one valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate email sending
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Emails sent!",
        description: `Share link sent to ${validEmails.length} recipient${validEmails.length > 1 ? 's' : ''}.`,
      });
      setEmails(['']);
    }, 2000);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card ref={modalRef} className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Link Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Protection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-toggle" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password Protection
              </Label>
              <Switch
                id="password-toggle"
                checked={passwordEnabled}
                onCheckedChange={setPasswordEnabled}
              />
            </div>
            
            {passwordEnabled && (
              <div className="relative animate-fade-in">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Expiry Settings */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Link Expiry
            </Label>
            <Select value={expiryTime} onValueChange={setExpiryTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* One-Time Download */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                One-Time Download
              </Label>
              <Switch
                checked={oneTimeDownload}
                onCheckedChange={setOneTimeDownload}
              />
            </div>
            {oneTimeDownload && (
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-600" />
                Link will expire after first download
              </div>
            )}
          </div>

          {/* Email Sharing */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Share via Email
            </Label>
            
            {/* Email Input */}
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={addEmail}
                disabled={!newEmail.trim() || !validateEmail(newEmail)}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Email List */}
            {emails.filter(email => email.trim()).length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Recipients:</Label>
                <div className="space-y-2">
                  {emails.filter(email => email.trim()).map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge 
                        variant={validateEmail(email) ? "default" : "destructive"}
                        className="flex-1 justify-between"
                      >
                        <span className="truncate">{email}</span>
                        <button
                          onClick={() => removeEmail(index)}
                          className="ml-2 hover:bg-red-500 hover:text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={sendEmails}
                  disabled={isSending || emails.filter(email => email.trim() && validateEmail(email)).length === 0}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send to {emails.filter(email => email.trim() && validateEmail(email)).length} recipient{emails.filter(email => email.trim() && validateEmail(email)).length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Single Share Link for All Files */}
          {uploadedFiles.length > 0 && uploadedFiles[0]?.downloadUrl && (
            <div className="space-y-4 animate-fade-in">
              <Label className="text-base font-semibold">Your Share Link</Label>
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploadedFiles.length === 1 ? 'File Share Link' : `${uploadedFiles.length} Files Share Link`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={uploadedFiles[0].downloadUrl} 
                    readOnly 
                    className="bg-white dark:bg-gray-700 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(uploadedFiles[0].downloadUrl!)}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Generate Link Button */}
          {!generatedLink ? (
            <Button 
              onClick={generateLink} 
              className="w-full bg-teal-600 hover:bg-teal-700 transition-all duration-200 hover:scale-105"
            >
              Generate Share Link
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Generated Link */}
              <div className="space-y-2">
                <Label>Your Share Link</Label>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generatedLink)}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {showQR && (
                <div className="text-center space-y-3">
                  <QRCodeGenerator url={generatedLink} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* QR download logic */}}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {generatedLink && (
              <Button 
                onClick={() => copyToClipboard(generatedLink)} 
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Share Link
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkSettings;
