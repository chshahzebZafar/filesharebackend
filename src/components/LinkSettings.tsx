
import React, { useState } from 'react';
import { Eye, EyeOff, Calendar, Lock, Link, Copy, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import QRCodeGenerator from './QRCodeGenerator';

interface LinkSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const LinkSettings: React.FC<LinkSettingsProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [expiryTime, setExpiryTime] = useState('7');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const generateLink = () => {
    // Simulate link generation
    const randomId = Math.random().toString(36).substr(2, 8);
    const link = `https://transfer.app/d/${randomId}`;
    setGeneratedLink(link);
    setShowQR(true);
    
    toast({
      title: "Link generated successfully!",
      description: "Your secure transfer link is ready to share.",
    });
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
      <Card className="w-full max-w-md animate-scale-in">
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
