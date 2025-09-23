import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: FileList) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const supportedTypes = {
    'application/pdf': { icon: FileText, label: 'PDF' },
    'application/msword': { icon: FileText, label: 'Word' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Word' },
    'application/vnd.ms-excel': { icon: FileSpreadsheet, label: 'Excel' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, label: 'Excel' },
    'image/png': { icon: Image, label: 'PNG' },
    'image/jpeg': { icon: Image, label: 'JPEG' },
    'text/plain': { icon: FileText, label: 'Text' }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-colors ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-10 h-10 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse your device
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Choose Files
            </button>
          </div>
        </div>
      </div>

      {/* Supported file types */}
      <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 ml-2 text-blue-600" />
          Supported Formats
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(supportedTypes).map(([type, { icon: Icon, label }]) => (
            <div key={type} className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
              <Icon className="w-4 h-4 text-blue-600" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
        Maximum file size: 25MB per file
        </p>
      </div>
    </div>
  );
};

export default FileUpload;