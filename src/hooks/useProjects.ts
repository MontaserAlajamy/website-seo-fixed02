import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialProjects } from '../lib/initialData';
import type { Project } from '../lib/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!isSupabaseConfigured) {
      // Fallback to initial data if Supabase isn't ready
      const mappedDefaults: Project[] = initialProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description || '',
        mediaUrl: p.vimeoId || '',
        vimeoId: p.vimeoId,
        thumbnail: p.thumbnail || '',
        featured: false,
        type: 'video'
      }));
      setProjects(mappedDefaults);
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

      if (!data || data.length === 0) {
        // Table is empty, use initial data mapped to Project type
        const mappedDefaults: Project[] = (initialProjects as any[]).map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description || '',
          mediaUrl: p.vimeoId || '',
          vimeoId: p.vimeoId,
          thumbnail: p.thumbnail || '',
          featured: false,
          type: 'video'
        }));
        setProjects(mappedDefaults);
      } else {
        // Map DB types to FE types
        const mapped: Project[] = (data as any[]).map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description || '',
          mediaUrl: item.video_url || item.vimeo_id || '',
          vimeoId: item.vimeo_id || undefined,
          videoUrl: item.video_url || undefined,
          videoSource: (item.video_source as any) || 'vimeo',
          thumbnail: item.thumbnail_url || '',
          featured: item.featured || false,
          tags: item.tags || [],
          type: 'video'
        }));
        setProjects(mapped);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      // Fallback
      setProjects(initialProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description || '',
        mediaUrl: p.vimeoId || '',
        vimeoId: p.vimeoId,
        thumbnail: p.thumbnail || '',
        type: 'video'
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Provide stubs for add/delete to prevent breaking other components
  // though ProjectGrid only uses 'projects'
  const addProject = async () => { };
  const deleteProject = async () => { };

  return { projects, loading, error, addProject, deleteProject, refetch: fetchProjects };
}