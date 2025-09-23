import { useState, useEffect } from 'react';
import { HistoryEntity } from '../types';
import { useAuth } from './useAuth';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAuthParams } = useAuth();
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

  const loadHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/history?${params}`);
      if (res.ok) {
        const data: HistoryEntity[] = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryByOperation = async (operation: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/history/operation/${operation}?${params}`);
      if (res.ok) {
        const data: HistoryEntity[] = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  return {
    history,
    isLoading,
    loadHistory,
    loadHistoryByOperation,
  };
};
