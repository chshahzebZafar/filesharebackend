import React, { useState } from 'react';
import { Plus, FolderPlus, Zap, CheckCircle, Calendar, MoreVertical, ChevronDown, ChevronUp, Lock, Download, Eye, Mail, Link as LinkIcon, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

const expiresOptions = [
  { label: 'Keep forever', value: 'forever' },
  { label: '1 year', value: '1y' },
  { label: '60 days', value: '60d' },
  { label: '30 days', value: '30d' },
  { label: '7 days', value: '7d', free: true },
  { label: '3 days', value: '3d', free: true },
  { label: '1 day', value: '1d', free: true },
];

export const RequestFilesAdvancedCard: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [expiresOpen, setExpiresOpen] = useState(false);
  const [expires, setExpires] = useState('7d');
  const [rememberExpires, setRememberExpires] = useState(false);

  // For demo, static email
  const email = 'shahzaibzafar093@gmail.com';

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto">
      {/* Files Card */}
      <div className={`bg-white rounded-2xl shadow-xl p-4 flex-1 min-w-[320px] max-w-md border border-gray-100 transition-all ${showOptions ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Add files/folders */}
        <div className="flex gap-2 mb-2">
          <Button variant="outline" className="flex-1 flex flex-col items-center py-4 gap-1 rounded-xl border-2 border-dashed border-gray-200">
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Add files</span>
          </Button>
          <Button variant="outline" className="flex-1 flex flex-col items-center py-4 gap-1 rounded-xl border-2 border-dashed border-gray-200">
            <FolderPlus className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Add folders</span>
          </Button>
        </div>
        {/* Upgrade link */}
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
          Get unlimited transfers
          <Zap className="w-4 h-4 text-purple-500 inline-block" />
          <a href="#" className="text-purple-600 font-medium ml-1 hover:underline">Increase limit</a>
        </div>
        {/* Email input (readonly for now) */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-1 border border-gray-200">
          <span className="text-xs text-gray-500">Your email</span>
          <span className="flex-1 text-sm text-gray-800 font-medium">{email}</span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
        {/* Title input */}
        <input
          type="text"
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {/* Message input */}
        <textarea
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
          {/* Expires dropdown */}
          {expiresOpen && (
            <div className="absolute left-0 top-12 z-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-fade-in">
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
        {/* Continue button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-base mt-1">
          Continue
        </Button>
      </div>
      {/* Options Card (only show when showOptions is true) */}
      {showOptions && (
        <div className="bg-white rounded-2xl shadow-xl p-4 flex-1 min-w-[320px] max-w-md border border-gray-100 transition-all animate-fade-in">
          {/* Back button */}
          <button
            className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
            onClick={() => setShowOptions(false)}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {/* Send email / Create link */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sendType" className="accent-blue-600" defaultChecked />
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Send email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sendType" className="accent-blue-600" />
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Create link</span>
            </label>
          </div>
          {/* Access control */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Access control</span>
              <span className="ml-auto text-xs text-gray-400 cursor-pointer">Select <ChevronDown className="w-3 h-3 inline" /></span>
            </div>
          </div>
          {/* Appearance */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Appearance</span>
              <span className="ml-auto text-xs text-purple-500 cursor-pointer">Customize background <Zap className="w-3 h-3 inline" /></span>
            </div>
          </div>
          {/* Price */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Download className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Price</span>
              <span className="ml-auto text-xs text-purple-500 cursor-pointer">Request payment <Zap className="w-3 h-3 inline" /></span>
            </div>
          </div>
          {/* Password */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Password</span>
              <span className="ml-auto text-xs text-gray-400 cursor-pointer">Set password</span>
            </div>
          </div>
          {/* Recoverable */}
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="recoverable" className="accent-blue-600" defaultChecked />
            <label htmlFor="recoverable" className="text-xs text-gray-700 cursor-pointer">Recoverable</label>
          </div>
        </div>
      )}
    </div>
  );
}; 