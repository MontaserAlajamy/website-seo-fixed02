import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { initialProjects } from '../lib/initialData';

type VideoProject = Database['public']['Tables']['video_projects']['Row'];
type VideoProjectInsert = Database['public']['Tables']['video_projects']['Insert'];
type VideoProjectUpdate = Database['public']['Tables']['video_projects']['Update'];

// Module-level flag to prevent double-seeding (survives StrictMode re-mounts)
let seedingInProgress = false;
let seedingDone = false;

export function useVideoProjects() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const seedInitialData = async () => {
    if (seedingInProgress || seedingDone) return false;
    seedingInProgress = true;

    try {
      // Double-check the table is actually empty (race condition guard)
      const { data: check } = await supabase
        .from('video_projects')
        .select('id')
        .limit(1);

      if (check && check.length > 0) {
        seedingDone = true;
        seedingInProgress = false;
        return false;
      }

      const dbProjects: VideoProjectInsert[] = initialProjects.map((p, index) => ({
        title: p.title,
        category: p.category,
        vimeo_id: p.vimeoId,
        description: p.description || '',
        thumbnail_url: p.thumbnail || `https://vumbnail.com/${p.vimeoId}.jpg`,
        order_index: index + 1,
        video_source: 'vimeo' as const,
        featured: index === 6,
      }));

      for (let i = 0; i < dbProjects.length; i += 20) {
        const batch = dbProjects.slice(i, i + 20);
        const { error: insertError } = await supabase
          .from('video_projects')
          .insert(batch as any);

        if (insertError) throw insertError;
      }

      console.log(`✅ Seeded ${dbProjects.length} video projects`);
      seedingDone = true;
      return true;
    } catch (err) {
      console.error('Seed error:', err);
      return false;
    } finally {
      seedingInProgress = false;
    }
  };

  const fetchProjects = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      if ((!data || data.length === 0) && !seedingDone) {
        const seeded = await seedInitialData();
        if (seeded) {
          const { data: seededData } = await supabase
            .from('video_projects')
            .select('*')
            .order('order_index', { ascending: true });
          setProjects((seededData as VideoProject[]) || []);
        }
      } else {
        setProjects((data as VideoProject[]) || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: VideoProjectInsert) => {
    try {
      const { data, error } = await supabase
        .from('video_projects')
        .insert([project] as any)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add project' };
    }
  };

  const updateProject = async (id: string, updates: VideoProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('video_projects')
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update project' };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete project' };
    }
  };

  const getFeaturedProjects = () => projects.filter(p => p.featured);
  const getProjectsByCategory = (category: string) => projects.filter(p => p.category === category);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getProjectsByCategory,
    refetch: fetchProjects,
  };
}
