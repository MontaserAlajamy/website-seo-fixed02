import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Skill = Database['public']['Tables']['skills']['Row'];
type SkillInsert = Database['public']['Tables']['skills']['Insert'];
type SkillUpdate = Database['public']['Tables']['skills']['Update'];

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (skill: SkillInsert) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([skill])
        .select()
        .single();

      if (error) throw error;
      await fetchSkills();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add skill';
      return { data: null, error: message };
    }
  };

  const updateSkill = async (id: string, updates: SkillUpdate) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSkills();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update skill';
      return { data: null, error: message };
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSkills();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete skill';
      return { error: message };
    }
  };

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills,
  };
}
