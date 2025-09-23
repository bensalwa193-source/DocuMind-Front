import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API = (import.meta as any).env?.VITE_API_URL || 'https://docmind-production.up.railway.app';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    return fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(async res => {
      if (!res.ok) throw new Error('Unauthorized');
      const u: User = await res.json();
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    });
  };

  const register = (name: string, email: string, password: string) => {
    return fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(async res => {
      if (!res.ok) throw new Error('Registration failed');
      const u: User = await res.json();
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return Promise.reject('Not authenticated');
    const params = new URLSearchParams({ email: user.email, password: 'dummy' }).toString();
    return fetch(`${API}/api/users/${user.id}?${params}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    }).then(async res => {
      if (!res.ok) throw new Error('Update failed');
      const updated: User = await res.json();
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    });
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return Promise.reject('Not authenticated');
    const params = new URLSearchParams({ currentPassword, newPassword, email: user.email }).toString();
    return fetch(`${API}/api/users/${user.id}/password?${params}`, { method: 'POST' })
      .then(res => { if (!res.ok) throw new Error('Password change failed'); });
  };

  const uploadAvatar = (file: File) => {
    if (!user) return Promise.reject('Not authenticated');
    const form = new FormData();
    form.append('file', file);
    const params = new URLSearchParams({ email: user.email, password: 'dummy' }).toString();
    return fetch(`${API}/api/users/${user.id}/avatar?${params}`, {
      method: 'POST',
      body: form
    }).then(async res => {
      if (!res.ok) throw new Error('Avatar upload failed');
      const updated: User = await res.json();
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    });
  };

  // Helper function to get authentication parameters
  // TODO: Replace with proper JWT token-based authentication for production
  const getAuthParams = () => {
    if (!user) return '';
    return new URLSearchParams({
      userId: user.id,
      email: user.email,
      password: 'dummy' // Development mode password
    }).toString();
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
    getAuthParams,
    isAuthenticated: !!user
  };
};
