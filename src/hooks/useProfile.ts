import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAuthParams } = useAuth();
  const API = (import.meta as any).env?.VITE_API_URL || 'https://docmind-production.up.railway.app';

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = getAuthParams();
      const res = await fetch(`${API}/api/users/${user.id}/profile?${params}`);
      if (res.ok) {
        const data: UserProfile = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const refreshProfile = () => {
    loadProfile();
  };

  return {
    profile,
    isLoading,
    refreshProfile
  };
};
