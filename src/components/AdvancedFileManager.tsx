import React, { useState, useEffect } from 'react';
import { 
  Folder, File, FolderOpen, Trash2, Share2, Download, MoreVertical, 
  Search, Filter, Grid, List, Upload, Tag, Star, Copy, Move, 
  CheckSquare, Square, Eye, Edit, Lock, Unlock, Calendar, HardDrive,
  ChevronRight, ChevronDown, Plus, FolderPlus, FilePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType?: string;
  path: string;
  parentId?: string;
  createdAt: string;
  modifiedAt: string;
  isStarred: boolean;
  isShared: boolean;
  isEncrypted: boolean;
  tags: string[];
  downloadCount: number;
  shareCount: number;
  children?: FileItem[];
}

interface AdvancedFileManagerProps {
  className?: string;
}

const AdvancedFileManager: React.FC<AdvancedFileManagerProps> = ({ className = '' }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, this would fetch from API
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'Documents',
          type: 'folder',
          size: 0,
          path: '/Documents',
          createdAt: '2024-01-01T00:00:00Z',
          modifiedAt: '2024-01-15T10:30:00Z',
          isStarred: false,
          isShared: false,
          isEncrypted: false,
          tags: ['work', 'important'],
          downloadCount: 0,
          shareCount: 0,
          children: [
            {
              id: '1-1',
              name: 'presentation.pdf',
              type: 'file',
              size: 2048576,
              mimeType: 'application/pdf',
              path: '/Documents/presentation.pdf',
              parentId: '1',
              createdAt: '2024-01-10T09:00:00Z',
              modifiedAt: '2024-01-15T10:30:00Z',
              isStarred: true,
              isShared: true,
              isEncrypted: false,
              tags: ['presentation', 'work'],
              downloadCount: 15,
              shareCount: 3
            }
          ]
        },
        {
          id: '2',
          name: 'Images',
          type: 'folder',
          size: 0,
          path: '/Images',
          createdAt: '2024-01-01T00:00:00Z',
          modifiedAt: '2024-01-14T16:20:00Z',
          isStarred: false,
          isShared: false,
          isEncrypted: false,
          tags: ['photos'],
          downloadCount: 0,
          shareCount: 0,
          children: [
            {
              id: '2-1',
              name: 'vacation.jpg',
              type: 'file',
              size: 3145728,
              mimeType: 'image/jpeg',
              path: '/Images/vacation.jpg',
              parentId: '2',
              createdAt: '2024-01-12T14:30:00Z',
              modifiedAt: '2024-01-14T16:20:00Z',
              isStarred: false,
              isShared: false,
              isEncrypted: true,
              tags: ['vacation', 'personal'],
              downloadCount: 5,
              shareCount: 1
            }
          ]
        },
        {
          id: '3',
          name: 'report.docx',
          type: 'file',
          size: 1048576,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          path: '/report.docx',
          createdAt: '2024-01-13T11:00:00Z',
          modifiedAt: '2024-01-15T08:45:00Z',
          isStarred: false,
          isShared: true,
          isEncrypted: false,
          tags: ['report', 'work'],
          downloadCount: 8,
          shareCount: 2
        }
      ];
      setFiles(mockFiles);
    } catch (error) {
      toast({
        title: "Error loading files",
        description: "Failed to load your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return expandedFolders.has(item.id) ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />;
    }
    
    if (item.mimeType?.startsWith('image/')) return <File className="w-5 h-5 text-blue-500" />;
    if (item.mimeType?.startsWith('video/')) return <File className="w-5 h-5 text-purple-500" />;
    if (item.mimeType?.startsWith('audio/')) return <File className="w-5 h-5 text-green-500" />;
    if (item.mimeType?.includes('pdf')) return <File className="w-5 h-5 text-red-500" />;
    if (item.mimeType?.includes('document')) return <File className="w-5 h-5 text-orange-500" />;
    
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    const allFileIds = getAllFileIds(files);
    setSelectedFiles(allFileIds);
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const getAllFileIds = (fileList: FileItem[]): string[] => {
    let ids: string[] = [];
    fileList.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        ids = [...ids, ...getAllFileIds(item.children)];
      }
    });
    return ids;
  };

  const handleBulkAction = (action: 'delete' | 'share' | 'download' | 'star' | 'move') => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to perform this action.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedFiles.length} item(s)?`)) {
          // Delete logic
          toast({
            title: "Files deleted",
            description: `${selectedFiles.length} item(s) have been deleted.`,
          });
          setSelectedFiles([]);
        }
        break;
      case 'share':
        // Share logic
        toast({
          title: "Sharing files",
          description: `Preparing to share ${selectedFiles.length} item(s).`,
        });
        break;
      case 'download':
        // Download logic
        toast({
          title: "Downloading files",
          description: `Starting download of ${selectedFiles.length} item(s).`,
        });
        break;
      case 'star':
        // Star logic
        toast({
          title: "Files starred",
          description: `${selectedFiles.length} item(s) have been starred.`,
        });
        break;
      case 'move':
        // Move logic
        toast({
          title: "Move files",
          description: `Select destination for ${selectedFiles.length} item(s).`,
        });
        break;
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Invalid folder name",
        description: "Please enter a valid folder name.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        size: 0,
        path: `${currentPath}${newFolderName}`,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        isStarred: false,
        isShared: false,
        isEncrypted: false,
        tags: [],
        downloadCount: 0,
        shareCount: 0,
        children: []
      };

      setFiles(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowCreateFolder(false);
      
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error creating folder",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedFiles = files
    .filter(file => {
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterType !== 'all') {
        if (filterType === 'folders' && file.type !== 'folder') return false;
        if (filterType === 'files' && file.type !== 'file') return false;
        if (filterType === 'starred' && !file.isStarred) return false;
        if (filterType === 'shared' && !file.isShared) return false;
        if (filterType === 'encrypted' && !file.isEncrypted) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Manager</h2>
          <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
            {files.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="folders">Folders</SelectItem>
                <SelectItem value="files">Files</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="encrypted">Encrypted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
            
            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedFiles.length} item(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAll}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Deselect All
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('star')}
                  className="flex items-center gap-1"
                >
                  <Star className="w-4 h-4" />
                  Star
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('share')}
                  className="flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('download')}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('move')}
                  className="flex items-center gap-1"
                >
                  <Move className="w-4 h-4" />
                  Move
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedFiles.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedFiles.includes(item.id) 
                  ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => toggleFileSelection(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedFiles.includes(item.id)}
                      onChange={() => toggleFileSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {getFileIcon(item)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="w-4 h-4 mr-2" />
                        {item.isStarred ? 'Unstar' : 'Star'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Move className="w-4 h-4 mr-2" />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.type === 'file' && (
                      <span>{formatBytes(item.size)}</span>
                    )}
                    <span>{formatDate(item.modifiedAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {item.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    {item.isShared && <Share2 className="w-3 h-3 text-blue-500" />}
                    {item.isEncrypted && <Lock className="w-3 h-3 text-green-500" />}
                  </div>
                  
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedFiles.length === getAllFileIds(files).length}
                        onChange={selectedFiles.length === getAllFileIds(files).length ? deselectAll : selectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Name</th>
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Size</th>
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Modified</th>
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFiles.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        selectedFiles.includes(item.id) ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                      }`}
                      onClick={() => toggleFileSelection(item.id)}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedFiles.includes(item.id)}
                          onChange={() => toggleFileSelection(item.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.type === 'folder' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(item.id);
                              }}
                            >
                              {expandedFolders.has(item.id) ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </button>
                          )}
                          {getFileIcon(item)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            {item.isShared && <Share2 className="w-3 h-3 text-blue-500" />}
                            {item.isEncrypted && <Lock className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {item.type === 'file' ? formatBytes(item.size) : '--'}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {formatDate(item.modifiedAt)}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {item.type === 'file' ? item.mimeType?.split('/')[1]?.toUpperCase() : 'Folder'}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="w-4 h-4 mr-2" />
                              {item.isStarred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Move className="w-4 h-4 mr-2" />
                              Move
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Folder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Folder Name
                </label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={createFolder}>
                  Create Folder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedFileManager; 