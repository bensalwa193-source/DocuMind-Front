export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'uploading' | 'ready' | 'processing' | 'error';
  preview?: string;
  url?: string;
  content?: string; // For text content of documents
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  citations?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  documentId: string;
  documentName: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;  // This is the correct property name
  plan: 'free' | 'premium';
}

export interface Settings {
  llm: 'mistral' | 'llama' | 'qwen' | 'zephyr' | '7b-chat.Q4_K_M.gguf';
  contextWindow: number;
  theme: 'light' | 'dark';
  language: 'ar' | 'en' | 'fr';
  ocrEnabled: boolean;
}

export interface HistoryEntity {
  id: number;
  userId: number;
  operation: 'upload' | 'download' | 'delete' | 'analyze' | 'settings_change';
  details: string;
  documentId?: number;
  timestamp: string;
}

export interface UserProfile {
  user: User;
  documents: Document[];
  history: HistoryEntity[];
  settings: Settings;
}