import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import FileUpload from '../components/Documents/FileUpload';
import DocumentList from '../components/Documents/DocumentList';
import { useDocuments } from '../hooks/useDocuments';
import { Document } from '../types';

const Documents = () => {
  const navigate = useNavigate();
  const { documents, uploadDocument, deleteDocument, renameDocument } = useDocuments();

  const handleUpload = (files: FileList) => {
    uploadDocument(files);
  };

  const handleView = (document: Document) => {
    navigate(`/document/${document.id}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Upload and analyze your documents using AI</p>
        </div>

        <div className="space-y-8">
          <FileUpload onUpload={handleUpload} />
          
          {documents.length > 0 && (
            <DocumentList
              documents={documents}
              onDelete={deleteDocument}
              onRename={renameDocument}
              onView={handleView}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;