import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Hook to fetch and manage site_content key-value pairs
export function useSiteContent(contentId?: string) {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = async () => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Use 'as any' to work around strict Supabase type inference
            let query = (supabase as any).from('site_content').select('*');

            if (contentId) {
                query = query.eq('id', contentId);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            // Convert array to object for easy access
            const contentMap: Record<string, string> = {};
            if (data) {
                for (const item of data as { id: string; content: string }[]) {
                    contentMap[item.id] = item.content;
                }
            }

            setContent(contentMap);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [contentId]);

    const updateContent = async (id: string, newContent: string) => {
        try {
            const { error: updateError } = await (supabase as any)
                .from('site_content')
                .update({ content: newContent, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (updateError) throw updateError;
            await fetchContent();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update content';
            return { error: message };
        }
    };

    const upsertContent = async (id: string, newContent: string, contentType = 'text') => {
        try {
            const { error: upsertError } = await (supabase as any)
                .from('site_content')
                .upsert({ id, content: newContent, content_type: contentType, updated_at: new Date().toISOString() });

            if (upsertError) throw upsertError;
            await fetchContent();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to upsert content';
            return { error: message };
        }
    };

    // Helper to get content with fallback
    const get = (key: string, fallback: string = '') => {
        return content[key] || fallback;
    };

    // Helper to parse JSON content
    const getJSON = (key: string, fallback: any = {}) => {
        try {
            return content[key] ? JSON.parse(content[key]) : fallback;
        } catch {
            return fallback;
        }
    };

    return {
        content,
        loading,
        error,
        updateContent,
        upsertContent,
        get,
        getJSON,
        refetch: fetchContent,
    };
}
