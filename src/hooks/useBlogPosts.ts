import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Manual types — generated types resolve to 'never' for blog_posts
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
}

const db = supabase as any;

export type { BlogPost };

export function useBlogPosts(statusFilter?: 'draft' | 'published') {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let query = db
                .from('blog_posts')
                .select('*')
                .order('published_at', { ascending: false, nullsFirst: false });

            if (statusFilter) {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setPosts((data as BlogPost[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [statusFilter]);

    const addPost = async (post: Partial<BlogPost>) => {
        try {
            const { data, error } = await db
                .from('blog_posts')
                .insert([post])
                .select()
                .single();

            if (error) throw error;
            await fetchPosts();
            return { data, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add post';
            return { data: null, error: message };
        }
    };

    const updatePost = async (id: string, updates: Partial<BlogPost>) => {
        try {
            const { data, error } = await db
                .from('blog_posts')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            await fetchPosts();
            return { data, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update post';
            return { data: null, error: message };
        }
    };

    const deletePost = async (id: string) => {
        try {
            const { error } = await db
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchPosts();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete post';
            return { error: message };
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    return {
        posts,
        loading,
        error,
        addPost,
        updatePost,
        deletePost,
        generateSlug,
        refetch: fetchPosts,
    };
}
