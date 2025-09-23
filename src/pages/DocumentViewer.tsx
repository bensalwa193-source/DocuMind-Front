import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import { FileText, ArrowLeft, Download, Search, Zap, AlertCircle } from 'lucide-react';
import { Document as DocType } from '../types';
import { toast } from 'react-hot-toast';

const DocumentViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const { getAuthParams, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [extractedInfo, setExtractedInfo] = useState<string[]>([]);
  const [doc, setDoc] = useState<DocType | null>(null);

  const performAnalysis = async () => {
    if (!doc) return;
    if (!isAuthenticated) {
      setError('You must be logged in to analyze the document');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const params = getAuthParams();
      if (!params) {
        throw new Error('Failed to find authentication data');
      }

      const response = await fetch(`${API}/api/documents/${doc.id}/analyze?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Session expired, please log in again');
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setSummary(result.summary || 'Document analyzed successfully');
      setExtractedInfo(result.extractedInfo || []);
      toast.success('Document analyzed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Analysis failed:', error);
      setError(`Failed to analyze document: ${errorMessage}`);
      setSummary('');
      setExtractedInfo([]);
      toast.error(`Failed to analyze document: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prefer loading from backend by id; fallback to local list
  useEffect(() => {
    const load = async () => {
      if (!id) return;

      // Don't load if authentication is still loading
      if (isAuthLoading) return;

      // If not authenticated, don't try to load - ProtectedRoute should handle redirect
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch from backend first
        const params = getAuthParams();
        if (!params) {
          throw new Error('Failed to find authentication data');
        }

        const res = await fetch(`${API}/api/documents/${id}?${params}`);

        if (res.status === 401) {
          throw new Error('Session expired, please log in again');
        }

        if (res.ok) {
          const d: DocType = await res.json();
          
          // If this is a text file, fetch its content
          if (d.type?.startsWith('text/')) {
            try {
              const contentRes = await fetch(`${API}/api/documents/${id}/content?${params}`);
              if (contentRes.ok) {
                const content = await contentRes.text();
                setDoc({ ...d, content });
              } else {
                console.warn('Failed to fetch document content, using empty content');
                setDoc(d);
              }
            } catch (err) {
              console.error('Error fetching document content:', err);
              setDoc(d);
            }
          } else {
            setDoc(d);
          }
          
          setIsLoading(false);
          return;
        }

        if (res.status === 404) {
          throw new Error('Document not found');
        } else {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        // Fallback to in-memory list if backend fetch fails
        const local = documents.find(d => d.id === id) || null;
        if (local) {
          setDoc(local);
          setIsLoading(false);
          return;
        }

        // If we get here, the document was not found anywhere
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('Failed to load document:', error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, isAuthenticated, isAuthLoading, documents]);

  useEffect(() => {
    if (doc && doc.status === 'ready') {
      // Use the performAnalysis function for consistency
      performAnalysis();
    }
  }, [doc]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Loading document</h3>
            <p className="mt-2 text-gray-500">Please wait...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !doc) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {error || 'Document not found'}
            </h3>
            <p className="mt-2 text-gray-500">
              {error ? 'An error occurred while trying to load the document' : 'The requested document was not found'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/documents')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-3"
              >
                Back to Documents
              </button>
              {error && (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="pb-20">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => navigate('/documents')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doc.name}</h1>
              <p className="text-gray-600">
                Uploaded on {new Date(doc.uploadDate).toLocaleDateString('en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Document Viewer and Analysis Panel Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Document Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h2>
            <div className="h-[500px] sm:h-[600px] bg-gray-50 rounded-lg overflow-auto">
              {doc.type?.startsWith('image/') ? (
                // Image viewer
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={`${API}/api/documents/${doc.id}/content?${getAuthParams()}`}
                    alt={doc.name}
                    className="max-w-full max-h-full object-contain bg-white rounded shadow-sm"
                  />
                </div>
              ) : doc.type === 'application/pdf' ? (
                // PDF viewer
                <iframe
                  src={`${API}/api/documents/${doc.id}/content?${getAuthParams()}`}
                  title={doc.name}
                  className="w-full h-full bg-white"
                />
              ) : doc.type === 'text/plain' || doc.type === 'text/csv' ? (
                // Text file viewer
                <div className="w-full h-full p-4 bg-white">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 overflow-auto h-full p-4 bg-gray-50 rounded border border-gray-200">
                    {doc.content || 'No content available'}
                  </pre>
                </div>
              ) : doc.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   doc.type === 'application/vnd.ms-excel' ? (
                // Excel file viewer (shows a message with download option)
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Excel Document</h3>
                  <p className="text-gray-600 mb-6">This is an Excel spreadsheet. Download the file to view its contents.</p>
                  <a
                    href={`${API}/api/documents/${doc.id}/content?${getAuthParams()}`}
                    download={doc.name}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel File
                  </a>
                </div>
              ) : doc.type?.startsWith('application/') || doc.type?.startsWith('text/') ? (
                // Generic document viewer for other text-based documents
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Content</h3>
                  <p className="text-gray-600 mb-4">This document has been processed and its content is available for analysis.</p>
                  <p className="text-sm text-gray-500">File type: {doc.type}</p>
                </div>
              ) : (
                // Fallback for unsupported file types
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">File Preview Not Available</h3>
                  <p className="text-gray-600 mb-4">This file type cannot be previewed directly.</p>
                  <div className="mt-2">
                    <a
                      href={`${API}/api/documents/${doc.id}/content?${getAuthParams()}`}
                      download={doc.name}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download File
                    </a>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">File type: {doc.type || 'unknown'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <Zap className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Smart Analysis</h2>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Automatic Summary</h3>
                {isAnalyzing ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg min-h-[100px] lg:min-h-[120px]">
                    {summary || 'No summary available. Click "Analyze Again" to generate a summary.'}
                  </div>
                )}
              </div>

              {/* Extracted Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Extracted Information</h3>
                {isAnalyzing ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 min-h-[80px] lg:min-h-[100px]">
                    {extractedInfo.length > 0 ? (
                      <ul className="space-y-2">
                        {extractedInfo.map((info, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No extracted information. Analyze the document to extract information.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => navigate(`/chat/${doc.id}`)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">Start Chat</div>
                    <div className="text-xs text-gray-500">Ask questions about this document</div>
                  </button>
                  <button
                    onClick={performAnalysis}
                    disabled={isAnalyzing}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Again'
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Re-run smart analysis</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentViewer;