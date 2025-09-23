import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { FileText, Download, Trash2, Search, Filter, Clock, User, MessageSquare, Eye } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { HistoryEntity, Conversation } from '../types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { history, isLoading, loadHistory, loadHistoryByOperation } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const { user, getAuthParams } = useAuth();
  const navigate = useNavigate();
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (user) {
      loadHistory();
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoadingConversations(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/conversations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to load conversations', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleDownloadDocument = async (documentId: number, documentName: string) => {
    try {
      const authParams = getAuthParams();
      
      // Add authentication parameters to the URL
      const url = new URL(`${API}/api/documents/${documentId}/download?${authParams}`);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url.toString();
      a.download = documentName || `document-${documentId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Log the download event (optional)
      toast.success('Downloading file...');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('An error occurred while downloading the file');
    }
  };

  const handleViewDocument = (documentId: number) => {
    navigate(`/document/${documentId}`);
  };

  const handleViewConversation = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'upload': return <FileText className="w-5 h-5 text-green-600" />;
      case 'download': return <Download className="w-5 h-5 text-blue-600" />;
      case 'delete': return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'analyze': return <Search className="w-5 h-5 text-purple-600" />;
      case 'settings_change': return <User className="w-5 h-5 text-gray-600" />;
      case 'conversation': return <MessageSquare className="w-5 h-5 text-indigo-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getOperationName = (operation: string) => {
    switch (operation) {
      case 'upload': return 'File Upload';
      case 'download': return 'File Download';
      case 'delete': return 'File Deletion';
      case 'analyze': return 'Document Analysis';
      case 'settings_change': return 'Settings Change';
      case 'conversation': return 'New Conversation';
      default: return operation;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  // Create a type for the combined history items
  type CombinedHistoryItem = HistoryEntity | {
    id: number;
    userId: number;
    operation: string;
    details: string;
    documentId?: number;
    timestamp: string;
  };

  // Filter history based on search term and selected operation
  const filteredHistory = history.filter(activity => {
    const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperation = selectedOperation === 'all' || activity.operation === selectedOperation;
    return matchesSearch && matchesOperation;
  });

  // Combine conversations with history for display
  const combinedHistory: CombinedHistoryItem[] = [...filteredHistory];
  if (selectedOperation === 'all' || selectedOperation === 'conversation') {
    conversations.forEach((conv, index) => {
      if (searchTerm === '' ||
          (conv.title && conv.title.toLowerCase().includes(searchTerm.toLowerCase()))) {
        combinedHistory.push({
          id: -parseInt(conv.id), // Use negative ID to avoid conflicts with regular history items
          userId: parseInt(user?.id || '0'),
          operation: 'conversation',
          details: `Conversation: ${conv.title || 'Untitled'}`,
          documentId: conv.documentId ? parseInt(conv.documentId) : undefined,
          timestamp: conv.updatedAt || conv.createdAt
        });
      }
    });
  }

  const operations = [
    { value: 'all', label: 'All Activities' },
    { value: 'upload', label: 'File Uploads' },
    { value: 'download', label: 'File Downloads' },
    { value: 'delete', label: 'File Deletions' },
    { value: 'analyze', label: 'Document Analysis' },
    { value: 'conversation', label: 'Conversations' },
    { value: 'settings_change', label: 'Settings Changes' }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity History</h1>
          <p className="text-gray-600">Track all your activities in the system</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedOperation}
                  onChange={(e) => {
                    setSelectedOperation(e.target.value);
                    if (e.target.value !== 'all') {
                      loadHistoryByOperation(e.target.value);
                    }
                  }}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operations.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
          </div>

          {combinedHistory.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {combinedHistory.map((activity) => (
                <div key={`${activity.operation === 'conversation' ? 'conv' : 'history'}-${Math.abs(activity.id)}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      {getOperationIcon(activity.operation)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {getOperationName(activity.operation)}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {activity.details}
                      </p>

                     

                      {activity.documentId && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewDocument(activity.documentId!)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3 ml-1" />
                            Document #{activity.documentId}
                          </button>
                          {activity.operation === 'conversation' && (
                            <button
                              onClick={() => handleViewConversation(activity.id.toString())}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 ml-1" />
                              View Conversation
                            </button>
                          )}
                          {(activity.operation === 'upload' || activity.operation === 'analyze') && (
                            <button
                              onClick={() => handleDownloadDocument(activity.documentId!, 'document-' + activity.documentId)}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              <Download className="w-3 h-3 ml-1" />
                              Download
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start using the system to see activity history here.
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">Uploads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.operation === 'upload').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.operation === 'download').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">Analysis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.operation === 'analyze').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;