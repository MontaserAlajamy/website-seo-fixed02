import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function SiteSettingsView() {
    const { settings, loading, updateSettings } = useSiteSettings();
    const [formData, setFormData] = useState({
        hero_title: '',
        hero_subtitle: '',
        about_title: '',
        about_text: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                hero_title: settings.hero_title || '',
                hero_subtitle: settings.hero_subtitle || '',
                about_title: settings.about_title || '',
                about_text: settings.about_text || '',
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const result = await updateSettings(formData);
        setSaving(false);
        if (!result.error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h3>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
                    <input
                        type="text"
                        value={formData.hero_title}
                        onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                    <input
                        type="text"
                        value={formData.hero_subtitle}
                        onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Title</label>
                    <input
                        type="text"
                        value={formData.about_title}
                        onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Text</label>
                    <textarea
                        rows={5}
                        value={formData.about_text}
                        onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saved ? (
                        <><Check className="w-5 h-5" /> Saved!</>
                    ) : saving ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="w-5 h-5" /> Save Settings</>
                    )}
                </button>
            </form>
        </div>
    );
}
