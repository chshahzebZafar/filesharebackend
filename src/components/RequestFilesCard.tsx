import React, { useRef, useState } from 'react';
import { Plus, FolderPlus, Zap, CheckCircle, Calendar, MoreVertical, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadFilesWithProgress } from '@/services/api';

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const expiresOptions = [
  { label: 'Keep forever', value: 'forever' },
  { label: '1 year', value: '1y' },
  { label: '60 days', value: '60d' },
  { label: '30 days', value: '30d' },
  { label: '7 days', value: '7d', free: true },
  { label: '3 days', value: '3d', free: true },
  { label: '1 day', value: '1d', free: true },
];

export const RequestFilesCard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [expiresOpen, setExpiresOpen] = useState(false);
  const [expires, setExpires] = useState('7d');
  const [rememberExpires, setRememberExpires] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<{ email: string; type: 'to' | 'cc' }[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [recipientType, setRecipientType] = useState<'to' | 'cc'>('to');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState<number | ''>('');
  const [accessControl, setAccessControl] = useState('anyone');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Add a debug object for all selected/upload data
  const debugData = {
    files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
    title,
    message,
    recipients,
    password,
    maxDownloads,
    accessControl,
    expires,
    rememberExpires
  };

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };
  const handleAddFolders = () => {
    folderInputRef.current?.click();
  };
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files!);
      setFiles(prev => [...prev, ...selectedFiles]);
      e.target.value = '';
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleAddRecipient = () => {
    if (recipientInput.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipientInput.trim())) {
      setRecipients(prev => [...prev, { email: recipientInput.trim(), type: recipientType }]);
      setRecipientInput('');
    }
  };
  const handleRemoveRecipient = (idx: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx));
  };

  // For demo, static email
  // const email = 'shahzaibzafar093@gmail.com';

  const handleContinue = async () => {
    if (files.length === 0) {
      toast({ title: 'No files selected', description: 'Please add files or folders before continuing.', variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      files.forEach((file, idx) => {
        formData.append('files', file);
      });
      formData.append('title', title);
      formData.append('bundleName', title); // Group files as a bundle with the title
      formData.append('message', message);
      formData.append('expires', expires);
      formData.append('recipients', JSON.stringify(recipients));
      if (password) formData.append('password', password);
      if (maxDownloads) formData.append('maxDownloads', String(maxDownloads));
      if (accessControl) formData.append('accessControl', accessControl);
      const data = await uploadFilesWithProgress(formData, setUploadProgress);
      console.log('Upload response:', data);
      if (data.success) {
        toast({ title: 'Upload successful', description: 'Your files have been uploaded and a link has been generated.' });
        setFiles([]);
        setTitle('');
        setMessage('');
        setRecipients([]);
        setPassword('');
        setMaxDownloads('');
        setAccessControl('anyone');
      } else {
        toast({ title: 'Upload failed', description: data.message || 'An error occurred.', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Upload failed', description: 'An error occurred.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
      {/* Main Card */}
      <div className={`bg-white rounded-2xl shadow-xl p-4 flex-1 min-w-[320px] max-w-xl border border-gray-100 transition-all ${showOptions ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Add files/folders */}
        <div className="flex gap-2 mb-2 ">
          <Button onClick={handleAddFiles} variant="outline" className="flex-1 flex flex-col items-center py-4 gap-1 rounded-xl border-2 border-dashed border-gray-200 p-5 bg-blue-50">
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 ">Add files</span>
          </Button>
          <Button onClick={handleAddFolders} variant="outline" className="flex-1 flex flex-col items-center py-4 gap-1 rounded-xl border-2 border-dashed border-gray-200 p-5 bg-blue-50">
            <FolderPlus className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add folders</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesChange}
            accept="*/*"
          />
          {/* @ts-ignore */}
          {/* eslint-disable-next-line */}
          {/* @ts-ignore */}
          <input
            ref={folderInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesChange}
            webkitdirectory="true"
            directory="true"
            accept="*/*"
          />
        </div>
        {/* Uploaded files count and list */}
        {files.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-1 px-2">
              <span className="text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                {files.length} item{files.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 mb-2 max-h-40 overflow-y-auto border border-gray-200">
              {files.map((file, idx) => (
                <div
                  key={file.name + file.size + idx}
                  className="flex items-center justify-between px-2 py-1 group hover:bg-gray-100 rounded transition"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)} · {file.type.split('/').pop()}</div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100"
                    onClick={() => handleRemoveFile(idx)}
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Recipients (To/CC) */}
        <div className="mb-2">
          <div className="flex gap-2 mb-1">
            <select value={recipientType} onChange={e => setRecipientType(e.target.value as 'to' | 'cc')} className="rounded border px-2 py-1 text-xs">
              <option value="to">To</option>
              <option value="cc">CC</option>
            </select>
            <input
              type="email"
              value={recipientInput}
              onChange={e => setRecipientInput(e.target.value)}
              placeholder="Recipient email"
              className="flex-1 rounded border px-2 py-1 text-xs"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRecipient(); } }}
            />
            <Button size="sm" onClick={handleAddRecipient} className="px-2 py-1 text-xs">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipients.map((r, idx) => (
              <span key={r.email + r.type + idx} className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
                {r.type.toUpperCase()}: {r.email}
                <button onClick={() => handleRemoveRecipient(idx)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
              </span>
            ))}
          </div>
        </div>
        {/* Email input (readonly for now) replaced by recipients */}
        <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          rows={2}
        />
        {/* Expires in dropdown */}
        <div className="flex items-center gap-2 mb-2 relative">
          <button
            type="button"
            className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 cursor-pointer focus:ring-2 focus:ring-blue-200"
            onClick={() => setExpiresOpen(v => !v)}
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-700">Expires in</span>
            <span className="ml-auto text-xs text-gray-500">{expiresOptions.find(o => o.value === expires)?.label}</span>
            {expiresOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
          <Button variant="ghost" size="icon" className="ml-1" onClick={() => setShowOptions(true)}>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </Button>
          {/* Expires dropdown popup */}
          {expiresOpen && (
            <div className="absolute left-0 bottom-14 z-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-fade-in">
              {expiresOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-blue-50 transition ${expires === opt.value ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                  onClick={() => { setExpires(opt.value); setExpiresOpen(false); }}
                >
                  <span>{opt.label}</span>
                  {opt.free && <span className="text-xs text-blue-500 ml-2">Free</span>}
                </button>
              ))}
              <div className="flex items-center gap-2 mt-2 px-2">
                <input
                  type="checkbox"
                  id="rememberExpires"
                  checked={rememberExpires}
                  onChange={e => setRememberExpires(e.target.checked)}
                  className="accent-blue-600"
                />
                <label htmlFor="rememberExpires" className="text-xs text-gray-600 cursor-pointer">Remember for next time</label>
              </div>
            </div>
          )}
        </div>
        {/* Continue button (only show if options card is not open) */}
        {!showOptions && (
          <>
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-base mt-1 transition-all duration-300 animate-fade-in"
              onClick={handleContinue}
              disabled={isUploading}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : 'Continue'}
            </Button>
          </>
        )}
      </div>
      {/* Options Card (shows on right when three dots is clicked) */}
      {showOptions && (
        <div className="bg-white rounded-2xl shadow-xl p-4 flex-1 min-w-[320px] max-w-xl border border-gray-100 transition-all animate-fade-in relative flex flex-col">
          {/* Back button */}
          <button
            className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
            onClick={() => setShowOptions(false)}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-lg font-semibold mb-2">Advanced Options</div>
          {/* Access Control */}
          <label className="text-sm font-medium text-gray-700 mb-1">Access Control</label>
          <select
            value={accessControl}
            onChange={e => setAccessControl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="anyone">Anyone with the link</option>
            <option value="recipients">Only recipients</option>
            <option value="password">Password protected</option>
          </select>
          {/* Password - only show when "Password protected" is selected */}
          {accessControl === 'password' && (
            <>
              <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Set a password (required)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </>
          )}
          {/* Max Downloads */}
          <label className="text-sm font-medium text-gray-700 mb-1">Max Downloads</label>
          <input
            type="number"
            min={1}
            value={maxDownloads}
            onChange={e => setMaxDownloads(e.target.value ? Number(e.target.value) : '')}
            placeholder="Unlimited"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {/* Add more advanced options here as needed */}
          <div className="mt-auto">
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-base mt-1 transition-all duration-300 animate-fade-in"
              onClick={handleContinue}
              disabled={isUploading}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 