import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MessageSquare, Edit, Eye, Lock, Unlock, Bell, 
  CheckCircle, AlertCircle, Clock, User, Send, MoreVertical,
  Share2, Download, Star, Trash2, Plus, Settings, Video,
  Mic, MicOff, VideoOff, Phone, PhoneOff, Maximize, Minimize, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  isTyping: boolean;
  lastSeen: string;
  currentActivity: string;
}

interface Comment {
  id: string;
  author: Collaborator;
  content: string;
  timestamp: string;
  replies: Comment[];
  isResolved: boolean;
  fileLocation?: string;
}

interface CollaborationSession {
  id: string;
  fileName: string;
  fileType: string;
  collaborators: Collaborator[];
  comments: Comment[];
  isLiveEditing: boolean;
  isRecording: boolean;
  isScreenSharing: boolean;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
    canDownload: boolean;
  };
  activity: {
    type: 'comment' | 'edit' | 'view' | 'download';
    user: Collaborator;
    timestamp: string;
    description: string;
  }[];
}

interface RealTimeCollaborationProps {
  className?: string;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ className = '' }) => {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadCollaborationSession();
  }, []);

  const loadCollaborationSession = async () => {
    // Mock collaboration session data
    const mockSession: CollaborationSession = {
      id: 'session-1',
      fileName: 'project_proposal.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      collaborators: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          role: 'owner',
          status: 'online',
          isTyping: false,
          lastSeen: new Date().toISOString(),
          currentActivity: 'Editing section 3'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          role: 'editor',
          status: 'online',
          isTyping: true,
          lastSeen: new Date().toISOString(),
          currentActivity: 'Reviewing comments'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          role: 'viewer',
          status: 'away',
          isTyping: false,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          currentActivity: 'Viewing document'
        }
      ],
      comments: [
        {
          id: '1',
          author: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            role: 'editor',
            status: 'online',
            isTyping: false,
            lastSeen: new Date().toISOString(),
            currentActivity: 'Reviewing comments'
          },
          content: 'Great work on the executive summary! I think we should add more data to support our claims.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          replies: [],
          isResolved: false,
          fileLocation: 'Page 2, Section 1'
        },
        {
          id: '2',
          author: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            role: 'owner',
            status: 'online',
            isTyping: false,
            lastSeen: new Date().toISOString(),
            currentActivity: 'Editing section 3'
          },
          content: 'I\'ve updated the financial projections based on the latest market data.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          replies: [
            {
              id: '2-1',
              author: {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
                role: 'editor',
                status: 'online',
                isTyping: false,
                lastSeen: new Date().toISOString(),
                currentActivity: 'Reviewing comments'
              },
              content: 'Perfect! The numbers look much more realistic now.',
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              replies: [],
              isResolved: false
            }
          ],
          isResolved: true,
          fileLocation: 'Page 5, Financial Section'
        }
      ],
      isLiveEditing: true,
      isRecording: false,
      isScreenSharing: false,
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canDownload: true
      },
      activity: [
        {
          type: 'edit',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            role: 'owner',
            status: 'online',
            isTyping: false,
            lastSeen: new Date().toISOString(),
            currentActivity: 'Editing section 3'
          },
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          description: 'Updated financial projections'
        },
        {
          type: 'comment',
          user: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            role: 'editor',
            status: 'online',
            isTyping: false,
            lastSeen: new Date().toISOString(),
            currentActivity: 'Reviewing comments'
          },
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          description: 'Replied to comment'
        }
      ]
    };

    setSession(mockSession);
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const addComment = async () => {
    if (!newComment.trim() || !session || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: user.email || 'current-user',
        name: user.name || 'Current User',
        email: user.email || '',
        role: 'editor',
        status: 'online',
        isTyping: false,
        lastSeen: new Date().toISOString(),
        currentActivity: 'Adding comment'
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      replies: [],
      isResolved: false
    };

    setSession(prev => prev ? {
      ...prev,
      comments: [...prev.comments, comment],
      activity: [
        {
          type: 'comment',
          user: comment.author,
          timestamp: comment.timestamp,
          description: 'Added a comment'
        },
        ...prev.activity
      ]
    } : null);

    setNewComment('');
    setIsTyping(false);

    toast({
      title: "Comment added",
      description: "Your comment has been added to the document.",
    });
  };

  const addReply = async (parentComment: Comment) => {
    if (!replyContent.trim() || !session || !user) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: {
        id: user.email || 'current-user',
        name: user.name || 'Current User',
        email: user.email || '',
        role: 'editor',
        status: 'online',
        isTyping: false,
        lastSeen: new Date().toISOString(),
        currentActivity: 'Adding reply'
      },
      content: replyContent,
      timestamp: new Date().toISOString(),
      replies: [],
      isResolved: false
    };

    setSession(prev => prev ? {
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === parentComment.id 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ),
      activity: [
        {
          type: 'comment',
          user: reply.author,
          timestamp: reply.timestamp,
          description: 'Replied to a comment'
        },
        ...prev.activity
      ]
    } : null);

    setReplyContent('');
    setReplyTo(null);

    toast({
      title: "Reply added",
      description: "Your reply has been added to the comment.",
    });
  };

  const resolveComment = (commentId: string) => {
    setSession(prev => prev ? {
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isResolved: true }
          : comment
      )
    } : null);

    toast({
      title: "Comment resolved",
      description: "The comment has been marked as resolved.",
    });
  };

  const toggleVideoCall = () => {
    setIsVideoCall(!isVideoCall);
    toast({
      title: isVideoCall ? "Video call ended" : "Video call started",
      description: isVideoCall ? "Video call has been ended." : "Video call has been initiated.",
    });
  };

  const toggleAudioCall = () => {
    setIsAudioCall(!isAudioCall);
    toast({
      title: isAudioCall ? "Audio call ended" : "Audio call started",
      description: isAudioCall ? "Audio call has been ended." : "Audio call has been initiated.",
    });
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      description: isScreenSharing ? "Screen sharing has been stopped." : "Screen sharing has been started.",
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Session recording has been stopped." : "Session recording has been started.",
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (!session) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading collaboration session...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up real-time collaboration features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Real-Time Collaboration
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {session.fileName} • {session.collaborators.length} collaborators
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isVideoCall ? "default" : "outline"}
            size="sm"
            onClick={toggleVideoCall}
            className={isVideoCall ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isVideoCall ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </Button>
          <Button
            variant={isAudioCall ? "default" : "outline"}
            size="sm"
            onClick={toggleAudioCall}
            className={isAudioCall ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isAudioCall ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </Button>
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="sm"
            onClick={toggleScreenSharing}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant={isRecording ? "default" : "outline"}
            size="sm"
            onClick={toggleRecording}
            className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Preview */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  {session.fileName}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Live Editing
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
                        Star
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <File className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {session.fileName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Real-time collaborative editing in progress
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {session.collaborators.length} active
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {session.comments.length} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(session.activity[0]?.timestamp || '')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          {showComments && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({session.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      handleTyping();
                    }}
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {isTyping ? 'Typing...' : 'Press Enter to comment'}
                    </span>
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {session.comments.map((comment) => (
                    <div key={comment.id} className={`p-4 rounded-lg border ${
                      comment.isResolved 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comment.author.name}
                            </span>
                            <Badge className={getRoleColor(comment.author.role)}>
                              {comment.author.role}
                            </Badge>
                            {comment.isResolved && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                Resolved
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {comment.content}
                          </p>
                          
                          {comment.fileLocation && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              📍 {comment.fileLocation}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyTo(replyTo?.id === comment.id ? null : comment)}
                            >
                              Reply
                            </Button>
                            {!comment.isResolved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => resolveComment(comment.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                          
                          {/* Reply Form */}
                          {replyTo?.id === comment.id && (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[60px]"
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => addReply(comment)}
                                  disabled={!replyContent.trim()}
                                >
                                  Reply
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setReplyTo(null);
                                    setReplyContent('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="ml-8 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={reply.author.avatar} />
                                      <AvatarFallback>
                                        {reply.author.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatTime(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {reply.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Collaborators */}
          {showCollaborators && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collaborators ({session.collaborators.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {session.collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback>
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(collaborator.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {collaborator.name}
                        </span>
                        {collaborator.isTyping && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                            typing...
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(collaborator.role)}>
                          {collaborator.role}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {collaborator.currentActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{activity.user.name}</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaboration; 