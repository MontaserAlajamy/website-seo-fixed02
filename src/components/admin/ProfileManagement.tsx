import React, { useState, useEffect } from 'react';
import { Save, Check, User } from 'lucide-react';
import { useSupabaseProfile } from '../../hooks/useSupabaseProfile';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export default function ProfileManagement() {
    const { user } = useSupabaseAuth();
    const { profile, loading, updateProfile, createProfile } = useSupabaseProfile(user?.id);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        avatar_url: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                title: profile.title || '',
                bio: profile.bio || '',
                email: profile.email || '',
                phone: profile.phone || '',
                location: profile.location || '',
                avatar_url: profile.avatar_url || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (profile) {
            await updateProfile(formData);
        } else if (user) {
            await createProfile(user.id, formData);
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h3>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <input
                        type="url"
                        placeholder="Avatar URL"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                    <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
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
                        <><Save className="w-5 h-5" /> Save Profile</>
                    )}
                </button>
            </form>
        </div>
    );
}
