import React from 'react';
import { Save, Edit, Plus, Trash2, Upload } from 'lucide-react';

interface ProfileData {
  name: string;
  photo: string;
  bio: string;
  contact: {
    whatsapp: string;
    availableHours: string;
    languages: string[];
  };
  visibility: {
    showWhatsApp: boolean;
    showAvailability: boolean;
    showLanguages: boolean;
  };
}

interface ProfileSettingsProps {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
}

export default function ProfileSettings({ data: initialData, onSave }: ProfileSettingsProps) {
  const [data, setData] = React.useState(initialData);
  const [editMode, setEditMode] = React.useState(false);

  const handleSave = () => {
    onSave(data);
    setEditMode(false);
  };

  const handleAddLanguage = () => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        languages: [...prev.contact.languages, '']
      }
    }));
  };

  const handleRemoveLanguage = (index: number) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        languages: prev.contact.languages.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Profile Settings
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
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Photo
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={data.photo}
              onChange={(e) => setData(prev => ({ ...prev, photo: e.target.value }))}
              disabled={!editMode}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
              placeholder="Enter image URL"
            />
            {data.photo && (
              <img
                src={data.photo}
                alt="Profile Preview"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            value={data.bio}
            onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!editMode}
            rows={4}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={data.contact.whatsapp}
            onChange={(e) => setData(prev => ({
              ...prev,
              contact: { ...prev.contact, whatsapp: e.target.value }
            }))}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available Hours
          </label>
          <input
            type="text"
            value={data.contact.availableHours}
            onChange={(e) => setData(prev => ({
              ...prev,
              contact: { ...prev.contact, availableHours: e.target.value }
            }))}
            disabled={!editMode}
            placeholder="e.g., Mon-Fri 9AM-5PM GMT"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Languages
          </label>
          {data.contact.languages.map((lang, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={lang}
                onChange={(e) => {
                  const newLangs = [...data.contact.languages];
                  newLangs[index] = e.target.value;
                  setData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, languages: newLangs }
                  }));
                }}
                disabled={!editMode}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
              />
              {editMode && (
                <button
                  onClick={() => handleRemoveLanguage(index)}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {editMode && (
            <button
              onClick={handleAddLanguage}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Language
            </button>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Visibility Settings
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.visibility.showWhatsApp}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  visibility: { ...prev.visibility, showWhatsApp: e.target.checked }
                }))}
                disabled={!editMode}
                className="rounded border-gray-300 dark:border-gray-600 text-purple-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show WhatsApp Number
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.visibility.showAvailability}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  visibility: { ...prev.visibility, showAvailability: e.target.checked }
                }))}
                disabled={!editMode}
                className="rounded border-gray-300 dark:border-gray-600 text-purple-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show Availability Hours
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.visibility.showLanguages}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  visibility: { ...prev.visibility, showLanguages: e.target.checked }
                }))}
                disabled={!editMode}
                className="rounded border-gray-300 dark:border-gray-600 text-purple-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show Languages
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}