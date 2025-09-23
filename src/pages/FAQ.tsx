import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      category: 'Basics',
      questions: [
        {
          question: 'What is DocuMind?',
          answer: 'DocuMind is an intelligent platform that uses artificial intelligence to analyze documents and chat with them. You can upload your documents and ask questions to get instant and detailed answers.'
        },
        {
          question: 'How do I get started with the platform?',
          answer: 'After creating a free account, you can upload your documents from the "Documents" page, then go to the "Chat" page to start asking questions about the content of these documents.'
        },
        {
          question: 'Is the platform free?',
          answer: 'Yes, we offer a free plan that allows you to process up to 5 documents per month. We also provide paid plans for intensive use with additional features.'
        }
      ]
    },
    {
      category: 'Document Upload',
      questions: [
        {
          question: 'What file formats are supported?',
          answer: 'We support PDF, Word (.doc, .docx), Excel (.xls, .xlsx), images (PNG, JPEG), and text files (.txt). We are constantly working on adding support for new formats.'
        },
        {
          question: 'What is the maximum file size?',
          answer: 'In the free plan, the maximum is 25MB per file. In paid plans, you can upload files up to 100MB.'
        },
        {
          question: 'How many files can I upload?',
          answer: 'The free plan allows uploading 5 documents per month. Paid plans offer unlimited document uploads.'
        },
        {
          question: 'Can I delete uploaded documents?',
          answer: 'Yes, you can delete any document from the "Documents" page at any time. The document will be permanently deleted from our servers.'
        }
      ]
    },
    {
      category: 'Chat and Analysis',
      questions: [
        {
          question: 'How does document chat work?',
          answer: 'After uploading your documents, our system analyzes and indexes them. You can then ask questions in natural language and get accurate answers with references to the sources in the document.'
        },
        {
          question: 'How accurate are the answers?',
          answer: 'We use the latest AI models specifically trained to understand Arabic context. Answer accuracy exceeds 95% for clear texts.'
        },
        {
          question: 'Can I compare two documents?',
          answer: 'Yes, you can select multiple documents in the chat and ask comparison questions. The system will analyze the content in all selected documents.'
        },
        {
          question: 'Does the system save chat history?',
          answer: 'Yes, all your conversations are saved in the "Saved Chats" page and you can refer to or download them at any time.'
        }
      ]
    },
    {
      category: 'Security and Privacy',
      questions: [
        {
          question: 'Are my documents secure?',
          answer: 'Yes, we use SSL/TLS encryption for data transfer and AES-256 encryption for storage. All documents are protected with the highest security standards.'
        },
        {
          question: 'Who can access my documents?',
          answer: 'Your documents are private to you. No one else, not even the DocuMind team, can access your document content without your explicit permission.'
        },
        {
          question: 'Do you keep copies of the documents?',
          answer: 'We retain documents as long as your account is active. You can delete any document at any time, and it will be permanently removed from our servers within 30 days.'
        },
        {
          question: 'Do you share data with third parties?',
          answer: 'No, we do not share your documents or personal data with any third parties. Please refer to the privacy policy for complete details.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'Why did my document upload fail?',
          answer: 'Uploads may fail for several reasons: large file size, unsupported format, connection issues, or reaching the monthly limit. Check the error message for details.'
        },
        {
          question: 'The site is slow or not working?',
          answer: 'Try refreshing the page or clearing your cache. If the problem persists, contact us with your browser and device details.'
        },
        {
          question: 'Not getting accurate answers?',
          answer: 'Make sure your document is clear and readable. Scanned documents or unclear images may affect result accuracy. Enable OCR in settings if available.'
        },
        {
          question: 'Forgot your password?',
          answer: 'Use the "Forgot Password" link on the login page. We will send a password reset link to your email.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const itemKey = categoryIndex * 100 + questionIndex;
    setOpenItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const isItemOpen = (categoryIndex: number, questionIndex: number) => {
    const itemKey = categoryIndex * 100 + questionIndex;
    return openItems.includes(itemKey);
  };

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="mx-auto h-16 w-16 text-blue-600 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive answers to the most common questions about using DocuMind
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try different search terms
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">{category.category}</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {faq.question}
                          </h3>
                          {isItemOpen(categoryIndex, questionIndex) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {isItemOpen(categoryIndex, questionIndex) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Couldn't find an answer to your question?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is ready to help you anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/docs"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Browse Documentation
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;