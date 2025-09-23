import React from 'react';
import Layout from '../components/Layout/Layout';
import { Book, FileText, MessageCircle, Settings, Zap, Shield, Code, ExternalLink } from 'lucide-react';

const Docs = () => {
  const sections = [
    {
      icon: Zap,
      title: 'Quick Start',
      description: 'Get started with DocuMind in minutes',
      items: [
        'Create a new account',
        'Upload your first document',
        'Start a chat with your document',
        'Export results'
      ]
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Everything you need to know about uploading and managing documents',
      items: [
        'Supported formats',
        'File size limits',
        'Document preview',
        'Organizing documents'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Chat & Analysis',
      description: 'Learn how to use the smart chat system',
      items: [
        'Asking the right questions',
        'Understanding answers and references',
        'Advanced conversations',
        'Exporting chats'
      ]
    },
    {
      icon: Settings,
      title: 'Settings & Customization',
      description: 'Customize your DocuMind experience',
      items: [
        'AI settings',
        'Interface customization',
        'Language settings',
        'Enable OCR'
      ]
    }
  ];

  const apiDocs = [
    {
      method: 'POST',
      endpoint: '/api/documents',
      description: 'Upload a new document'
    },
    {
      method: 'GET',
      endpoint: '/api/documents',
      description: 'Get list of documents'
    },
    {
      method: 'POST',
      endpoint: '/api/chat',
      description: 'Send a chat message'
    },
    {
      method: 'GET',
      endpoint: '/api/conversations',
      description: 'Get saved conversations'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Book className="mx-auto h-16 w-16 text-blue-600 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive guide to using DocuMind and exploring all features and capabilities
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {section.description}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Documentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {[
                  'Introduction',
                  'Quick Start',
                  'Uploading Documents',
                  'Using the Chat',
                  'Advanced Settings',
                  'Troubleshooting',
                  'API Reference',
                  'FAQ'
                ].map((item, index) => (
                  <a
                    key={index}
                    href={`#section-${index}`}
                    className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction */}
            <section id="section-0" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  DocuMind is an advanced platform that uses artificial intelligence to analyze documents and chat with them. 
                  The platform allows you to upload your documents in different formats and get instant and accurate answers to your questions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This guide will show you how to use all the platform's features to get the best results.
                </p>
              </div>
            </section>

            {/* Quick Start */}
            <section id="section-1" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Create an Account</h3>
                  <p className="text-gray-600 mb-3">
                    Start by creating a free account by clicking on "Sign Up" on the homepage.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm text-gray-700">
                      You can sign up using your email and a strong password
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Upload a Document</h3>
                  <p className="text-gray-600 mb-3">
                    Go to the "Documents" page and upload your first document using drag and drop.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Maximum: 25MB per file</li>
                    <li>Supported formats: PDF, Word, Excel, Images</li>
                    <li>Automatic processing within seconds</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Start Chatting</h3>
                  <p className="text-gray-600">
                    Go to the "Chat" page, select your document, and ask your first question!
                  </p>
                </div>
              </div>
            </section>

            {/* Document Upload */}
            <section id="section-2" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploading Documents</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'PDF', desc: 'Regular and scanned PDF files' },
                    { type: 'Word', desc: '.doc and .docx documents' },
                    { type: 'Excel', desc: '.xls and .xlsx spreadsheets' },
                    { type: 'Images', desc: 'PNG and JPEG images' }
                  ].map((format, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900">{format.type}</div>
                      <div className="text-sm text-gray-600">{format.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* API Reference
            <section id="section-6" className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Code className="h-6 w-6 text-blue-600 ml-2" />
                <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                For developers who want to integrate DocuMind into their applications
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Main Endpoints</h3>
                {apiDocs.map((api, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        api.method === 'GET' ? 'bg-green-100 text-green-800' :
                        api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {api.method}
                      </span>
                      <code className="text-sm text-gray-700 ml-3">{api.endpoint}</code>
                    </div>
                    <p className="text-sm text-gray-600">{api.description}</p>
                  </div>
                ))}
              </div>
            </section>*/}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need additional help?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist you anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-blue-600 transition-colors"
            >
              FAQ
              <ExternalLink className="h-5 w-5 mr-2" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Docs;