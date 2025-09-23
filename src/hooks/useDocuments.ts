import { useState, useEffect } from 'react';
import { Document } from '../types';
import { useAuth } from './useAuth';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAuthParams } = useAuth();
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

  const loadDocuments = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/documents?${params}`);
      if (res.ok) {
        const list: Document[] = await res.json();
        setDocuments(list);
      }
    } catch (e) {
      console.error('Failed to load documents', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const uploadDocument = async (files: FileList) => {
    if (!user) return;

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      try {
        const params = getAuthParams();
        const res = await fetch(`${API}/api/documents?${params}`, {
          method: 'POST',
          body: form
        });
        if (!res.ok) throw new Error('Upload failed');
        const saved: Document = await res.json();
        setDocuments(prev => [saved, ...prev]);
      } catch (e) {
        console.error('Failed to upload file', file.name, e);
      }
    }
  };

  const deleteDocument = (id: string) => {
    if (!user) return;

    const params = getAuthParams();
    fetch(`${API}/api/documents/${id}?${params}`, { method: 'DELETE' })
      .then(() => setDocuments(prev => prev.filter(d => d.id !== id)))
      .catch(e => console.error('Failed to delete document', e));
  };

  const renameDocument = (id: string, newName: string) => {
    if (!user) return;

    const params = getAuthParams();
    fetch(`${API}/api/documents/${id}?name=${encodeURIComponent(newName)}&${params}`, { method: 'PATCH' })
      .then(async res => {
        if (!res.ok) throw new Error('Rename failed');
        const updated: Document = await res.json();
        setDocuments(prev => prev.map(d => d.id === id ? updated : d));
      })
      .catch(e => console.error('Failed to rename document', e));
  };

  const downloadDocument = (id: string) => {
    if (!user) return;

    const params = getAuthParams();
    window.open(`${API}/api/documents/${id}/download?${params}`);
  };

  const analyzeDocument = (id: string) => {
    if (!user) return;

    const params = getAuthParams();
    return fetch(`${API}/api/documents/${id}/analyze?${params}`, { method: 'POST' });
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
    renameDocument,
    downloadDocument,
    analyzeDocument,
    refreshDocuments: loadDocuments
  };
};