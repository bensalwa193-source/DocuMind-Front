import { useState, useEffect } from 'react';
import { Settings } from '../types';
import { useAuth } from './useAuth';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const { user, getAuthParams } = useAuth();
  const API = (import.meta as any).env?.VITE_API_URL || 'https://docmind-production.up.railway.app';

  const loadSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/settings?${params}`);
      if (res.ok) {
        const data: Settings = await res.json();
        setSettings(data);
      } else {
        // Fallback to global settings if user-specific settings don't exist
        const globalRes = await fetch(`${API}/api/settings`);
        if (globalRes.ok) {
          const globalData: Settings = await globalRes.json();
          setSettings(globalData);
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadModels = async () => {
    try {
      const res = await fetch(`${API}/api/settings/models`);
      if (res.ok) {
        const list: string[] = await res.json();
        setModels(list);
      }
    } catch (e) {
      console.warn('Could not load local models list');
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    if (!user) {
      // For global settings (no user)
      try {
        const res = await fetch(`${API}/api/settings/global`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
        if (res.ok) {
          const updated: Settings = await res.json();
          setSettings(updated);
          return true;
        }
      } catch (e) {
        console.error('Failed to update global settings', e);
      }
      return false;
    }

    // For user-specific settings
    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/settings?${params}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const updated: Settings = await res.json();
        setSettings(updated);
        return true;
      }
    } catch (e) {
      console.error('Failed to update settings', e);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  useEffect(() => {
    loadModels();
  }, []);

  return {
    settings,
    models,
    isLoading,
    updateSettings,
    refreshSettings: loadSettings
  };
};
