import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type VideoProject = Database['public']['Tables']['video_projects']['Row'];
type VideoProjectInsert = Database['public']['Tables']['video_projects']['Insert'];
type VideoProjectUpdate = Database['public']['Tables']['video_projects']['Update'];

export function useVideoProjects() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
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
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add project';
      return { data: null, error: message };
    }
  };

  const updateProject = async (id: string, updates: VideoProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('video_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      return { data: null, error: message };
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
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      return { error: message };
    }
  };

  const getFeaturedProjects = () => {
    return projects.filter(p => p.featured);
  };

  const getProjectsByCategory = (category: string) => {
    return projects.filter(p => p.category === category);
  };

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
