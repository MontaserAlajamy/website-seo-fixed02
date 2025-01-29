import React from 'react';
import { Save, Edit, Plus, Trash2 } from 'lucide-react';

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  profileImage: string;
  contactEmail: string;
  socialLinks: { platform: string; url: string }[];
}

interface SiteSettingsProps {
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
}

export default function SiteSettings({ settings: initialSettings, onSave }: SiteSettingsProps) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [editMode, setEditMode] = React.useState(false);

  const handleSave = () => {
    onSave(settings);
    setEditMode(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Site Settings
        </h2>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Settings fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hero Title
          </label>
          <input
            type="text"
            value={settings.heroTitle}
            onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hero Subtitle
          </label>
          <input
            type="text"
            value={settings.heroSubtitle}
            onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            About Text
          </label>
          <textarea
            value={settings.aboutText}
            onChange={(e) => setSettings(prev => ({ ...prev, aboutText: e.target.value }))}
            disabled={!editMode}
            rows={5}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Image URL
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={settings.profileImage}
              onChange={(e) => setSettings(prev => ({ ...prev, profileImage: e.target.value }))}
              disabled={!editMode}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
            />
            {settings.profileImage && (
              <img
                src={settings.profileImage}
                alt="Profile Preview"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Links
          </label>
          {settings.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => {
                  const newLinks = [...settings.socialLinks];
                  newLinks[index].platform = e.target.value;
                  setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                }}
                disabled={!editMode}
                placeholder="Platform"
                className="w-1/3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...settings.socialLinks];
                  newLinks[index].url = e.target.value;
                  setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                }}
                disabled={!editMode}
                placeholder="URL"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
              />
              {editMode && (
                <button
                  onClick={() => {
                    const newLinks = settings.socialLinks.filter((_, i) => i !== index);
                    setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                  }}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {editMode && (
            <button
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
                }));
              }}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Social Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}