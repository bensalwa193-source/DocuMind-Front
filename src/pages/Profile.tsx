import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { User, Mail, Lock, Camera, Star, CreditCard, Save, FileText, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useHistory } from '../hooks/useHistory';

const Profile = () => {
  const { user, updateProfile, changePassword, uploadAvatar } = useAuth();
  const { profile, isLoading: profileLoading, refreshProfile } = useProfile();
  const { history, isLoading: historyLoading } = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleSave = () => {
    setSavingBasic(true);
    updateProfile(formData.name, formData.email)
      .then(() => {
        alert('Changes saved successfully');
        setIsEditing(false);
        refreshProfile();
      })
      .catch(() => alert('An error occurred while saving data'))
      .finally(() => setSavingBasic(false));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSavingAvatar(true);
      uploadAvatar(file)
        .then(() => {
          alert('Image uploaded successfully');
          refreshProfile();
        })
        .catch(() => alert('Failed to upload image'))
        .finally(() => setSavingAvatar(false));
    }
  };

  const handlePasswordChange = () => {
    if (!formData.currentPassword || !formData.newPassword) {
      alert('Please enter both current and new password');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    changePassword(formData.currentPassword, formData.newPassword)
      .then(() => {
        alert('Password updated successfully');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      })
      .catch(() => alert('Failed to update password'))
      .finally(() => setSavingPassword(false));
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'upload': return <FileText className="w-4 h-4 text-green-600" />;
      case 'download': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'delete': return <FileText className="w-4 h-4 text-red-600" />;
      case 'analyze': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'settings_change': return <SettingsIcon className="w-4 h-4 text-gray-600" />;
      default: return <HistoryIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <p className="text-gray-900">{user?.plan === 'premium' ? 'Premium' : 'Free'}</p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={savingBasic}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {savingBasic ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 ml-2" />
                    )}
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={savingPassword}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {savingPassword ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="w-4 h-4 ml-2" />
                  )}
                  Update Password
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-3">
                  {history.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
                      {getOperationIcon(activity.operation)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.details}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activities</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:8080'}${user.avatar}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback si l'image ne peut pas être chargée
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={savingAvatar}
                    />
                  </label>
                  {savingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium text-gray-900">{profile?.documents?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-medium text-gray-900">{profile?.history?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className={`font-medium ${user?.plan === 'premium' ? 'text-yellow-600' : 'text-gray-900'}`}>
                    {user?.plan === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;