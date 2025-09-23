import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DocumentSelector from '../components/Chat/DocumentSelector';
import MessageBubble from '../components/Chat/MessageBubble';
import MessageInput from '../components/Chat/MessageInput';
import { useDocuments } from '../hooks/useDocuments';
import { useSettings } from '../hooks/useSettings';
import { Message } from '../types';

const Chat = () => {
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef(true);
  const { settings } = useSettings();
  const [activeModel, setActiveModel] = useState('');
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { conversationId: routeConvId } = useParams<{ conversationId: string }>();
  const prevMessagesLength = useRef(0);

  // Fetch conversation history when conversationId changes
  useEffect(() => {
    if (routeConvId) {
      setConversationId(routeConvId);
      // Fetch conversation history here if needed
    }
  }, [routeConvId]);

  // Log the active model for debugging
  useEffect(() => {
    if (activeModel) {
      console.log('Active model:', activeModel);
    }
  }, [activeModel]);

  // Fonction pour faire défiler vers le bas de manière fluide
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current && isAutoScrollEnabled.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Effet pour gérer le défilement automatique
  useEffect(() => {
    // Faire défiler vers le bas à chaque nouveau message
    scrollToBottom();

    // Gestionnaire pour détecter le défilement manuel
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Vérifier si l'utilisateur a fait défiler vers le haut
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      // Activer/désactiver le défilement automatique en fonction de la position
      isAutoScrollEnabled.current = isNearBottom;
    };

    container.addEventListener('scroll', handleScroll);
    
    // Nettoyage
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [messages]); // Dépendance sur messages pour se déclencher à chaque nouveau message

  // Update active model when settings change
  useEffect(() => {
    if (settings?.llm) {
      setActiveModel(settings.llm);
      console.log('Updated active model from settings:', settings.llm);
    }
  }, [settings]);

  // If navigated from History with /chat/:id, load that conversation
  useEffect(() => {
    const loadConversation = async () => {
      if (!routeConvId) return;
      try {
        const res = await fetch(`${API}/api/conversations/${routeConvId}`);
        if (!res.ok) return;
        const conv = await res.json();
        setConversationId(conv.id);
        // Prefill messages
        if (Array.isArray(conv.messages)) {
          const loadedMessages = conv.messages.map((m: any) => ({
            id: m.id,
            text: m.text,
            isUser: m.isUser,
            timestamp: m.timestamp,
            citations: m.citations
          }));
          setMessages(loadedMessages);
          
          // Attendre que le DOM soit mis à jour avec les nouveaux messages
          setTimeout(() => {
            scrollToBottom('auto'); // Défilement instantané au chargement initial
          }, 0);
        }
        // Preselect the conversation's document
        if (conv.documentId) {
          setSelectedDocuments([String(conv.documentId)]);
        }
      } catch {}
    };
    loadConversation();
  }, [routeConvId, API]);

  const handleSendMessage = async (messageText: string) => {
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document for the conversation');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const firstDoc = documents.find(d => d.id === selectedDocuments[0]);
      // Get current settings to include the selected model
      const settingsRes = await fetch(`${API}/api/settings/global`);
      const settings = settingsRes.ok ? await settingsRes.json() : {};
      
      const body: any = {
        message: messageText,
        documentIds: selectedDocuments
          .map(id => {
            const n = Number(id);
            return isNaN(n) ? null : n;
          })
          .filter((v): v is number => v !== null),
        model: activeModel || settings.llm // Use active model or fall back to settings
      };
      
      // Update active model in state if not set
      if (settings.llm && !activeModel) {
        setActiveModel(settings.llm);
      }
      if (conversationId) body.conversationId = Number(conversationId);
      else if (firstDoc) body.title = `Chat about ${firstDoc.name}`;
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json(); // { response, citations, model, conversationId }
      if (data?.model) setActiveModel(data.model);
      if (data?.conversationId && !conversationId) setConversationId(String(data.conversationId));
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date().toISOString(),
        citations: data.citations
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: 'An error occurred while processing your message. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDocsInfo = documents.filter(doc => 
    selectedDocuments.includes(doc.id)
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat with Documents</h1>
          <p className="text-gray-600">
            Ask questions about your documents and get detailed answers
            {activeModel ? (
              <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Model: {activeModel}
              </span>
            ) : null}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-180px)]">
          {/* Document Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-full overflow-y-auto">
              <DocumentSelector
                documents={documents}
                selectedDocuments={selectedDocuments}
                onSelectionChange={setSelectedDocuments}
              />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 h-full flex flex-col">
            <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDocsInfo.length > 0 
                    ? `Chat with ${selectedDocsInfo.length} document${selectedDocsInfo.length > 1 ? 's' : ''}`
                    : 'Select documents to start'
                  }
                </h3>
                {selectedDocsInfo.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedDocsInfo.map(doc => doc.name).join(', ')}
                  </p>
                )}
              </div>

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
                style={{
                  maxHeight: 'calc(100vh - 350px)',
                  minHeight: '200px'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      💬
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Start the conversation
                    </h3>
                    <p className="text-gray-500">
                      {selectedDocuments.length > 0 
                        ? 'Type your question below to get started'
                        : 'Please select documents from the left panel first'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div key={message.id} className="message-container">
                        <MessageBubble message={message} />
                      </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  disabled={selectedDocuments.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;