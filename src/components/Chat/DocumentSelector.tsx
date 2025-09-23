import React from 'react';
import { FileText, Check } from 'lucide-react';
import { Document } from '../../types';

interface DocumentSelectorProps {
  documents: Document[];
  selectedDocuments: string[];
  onSelectionChange: (documentIds: string[]) => void;
}

const DocumentSelector = ({ documents, selectedDocuments, onSelectionChange }: DocumentSelectorProps) => {
  const toggleDocument = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      onSelectionChange(selectedDocuments.filter(id => id !== documentId));
    } else {
      onSelectionChange([...selectedDocuments, documentId]);
    }
  };

  const readyDocuments = documents.filter(doc => doc.status === 'ready');

  if (readyDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No documents available</h3>
        <p className="mt-2 text-gray-500">Upload some documents first to start chatting</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select documents for chat</h3>
      
      <div className="space-y-2">
        {readyDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => toggleDocument(doc.id)}
            className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedDocuments.includes(doc.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              selectedDocuments.includes(doc.id)
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedDocuments.includes(doc.id) && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {doc.name}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(doc.uploadDate).toLocaleDateString('en-US')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSelector;