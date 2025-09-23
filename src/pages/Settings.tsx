import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Settings as SettingsIcon, Bot, Palette, Globe, Eye, Save } from 'lucide-react';
import { Settings as SettingsType } from '../types';
import { useSettings } from '../hooks/useSettings';

const Settings = () => {
  const { settings, models, isLoading, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsType>(() => ({
    llm: models.length > 0 && (models[0] as SettingsType['llm']) ? (models[0] as SettingsType['llm']) : 'mistral',
    contextWindow: 4000,
    theme: 'light',
    language: 'en',
    ocrEnabled: true
  }));
  const [isSaving, setIsSaving] = useState(false);

  // Update local settings when settings or models are loaded
  useEffect(() => {
    if (settings) {
      // If we have settings, use them
      setLocalSettings(settings);
    } else if (models.length > 0) {
      // If no settings but we have models, set the first model as default
      const handleChange = <K extends keyof SettingsType>(
        field: K,
        value: SettingsType[K]
      ) => {
        setLocalSettings(prev => ({
          ...prev,
          [field]: value
        }));
      };
    }
  }, [settings, models]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateSettings(localSettings);
      if (success) {
        // Show success message
        console.log('Settings saved successfully');
      } else {
        console.error('Failed to save settings');
      }
    } catch (e) {
      console.error('Error saving settings', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SettingsType, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Use localSettings for display since it has default values
  const displaySettings = localSettings;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your experience</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Model Settings</h2>
          </div>

          <div className="px-6 py-4 space-y-6">
            {/* LLM Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={displaySettings.llm}
                onChange={(e) => handleChange('llm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Context Window */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Context Window
              </label>
              <input
                type="number"
                value={displaySettings.contextWindow}
                onChange={(e) => handleChange('contextWindow', parseInt(e.target.value))}
                min="1000"
                max="32000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={displaySettings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={displaySettings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* OCR Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Optical Character Recognition (OCR)</label>
                <p className="text-sm text-gray-500">Enable text extraction from images</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('ocrEnabled', !displaySettings.ocrEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  displaySettings.ocrEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    displaySettings.ocrEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

