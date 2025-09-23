import React, { useState } from 'react';
import { FileText, Image, FileSpreadsheet, Trash2, Edit3, Eye, Calendar, HardDrive } from 'lucide-react';
import { Document } from '../../types';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onView: (document: Document) => void;
}

const DocumentList = ({ documents, onDelete, onRename, onView }: DocumentListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'uploading': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'uploading': return 'Uploading';
      case 'processing': return 'Processing';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveRename = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No documents</h3>
        <p className="mt-2 text-gray-500">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Uploaded Documents ({documents.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.type);
          
          return (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-start space-x-3 rtl:space-x-reverse min-w-0">
                  <div className="flex-shrink-0">
                    <FileIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    {editingId === doc.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="block w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(doc.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => saveRename(doc.id)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                          >
Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                          >
Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h4 className="text-sm font-medium text-gray-900 break-words whitespace-normal">
                        {decodeURIComponent(doc.name)}
                      </h4>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(doc.status)}`}>
                    {getStatusText(doc.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 ml-1" />
                  {formatFileSize(doc.size)}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-1" />
                  {formatDate(doc.uploadDate)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => onView(doc)}
                  disabled={doc.status !== 'ready'}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4 ml-1" />
View
                </button>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleRename(doc.id, doc.name)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentList;