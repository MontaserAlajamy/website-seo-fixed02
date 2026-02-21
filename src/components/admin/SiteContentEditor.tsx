import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

export default function SiteContentEditor() {
    const { content, loading, upsertContent } = useSiteContent();
    const [formData, setFormData] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_tagline: '',
        hero_video_url: '',
        about_bio: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (content) {
            setFormData({
                hero_title: content.hero_title || '',
                hero_subtitle: content.hero_subtitle || '',
                hero_tagline: content.hero_tagline || '',
                hero_video_url: content.hero_video_url || '',
                about_bio: content.about_bio || '',
            });
        }
    }, [content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Upsert each field (creates if missing, updates if exists)
        const updates = Object.entries(formData);
        for (const [key, value] of updates) {
            await upsertContent(key, value);
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Site Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Edit the content that appears on your website pages.</p>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Hero Section</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
                        <input
                            type="text"
                            value={formData.hero_title}
                            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                        <input
                            type="text"
                            value={formData.hero_subtitle}
                            onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                            placeholder="Your Title/Role"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Tagline</label>
                        <input
                            type="text"
                            value={formData.hero_tagline}
                            onChange={(e) => setFormData({ ...formData, hero_tagline: e.target.value })}
                            placeholder="Your tagline or motto"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Video URL (iframe)</label>
                        <input
                            type="url"
                            value={formData.hero_video_url}
                            onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Full iframe URL with autoplay/muted parameters</p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">About Section</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Bio</label>
                        <textarea
                            rows={5}
                            value={formData.about_bio}
                            onChange={(e) => setFormData({ ...formData, about_bio: e.target.value })}
                            placeholder="Tell your story..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
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
                        <><Save className="w-5 h-5" /> Save Changes</>
                    )}
                </button>
            </form>
        </div>
    );
}
