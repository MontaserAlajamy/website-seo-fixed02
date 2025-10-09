import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useSupabaseProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      let query = supabase.from('profiles').select('*');

      if (userId) {
        query = query.eq('id', userId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: ProfileUpdate) => {
    try {
      if (!profile) {
        throw new Error('No profile found to update');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      await fetchProfile();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      return { data: null, error: message };
    }
  };

  const createProfile = async (userId: string, profileData: Omit<ProfileUpdate, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData }])
        .select()
        .single();

      if (error) throw error;
      await fetchProfile();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create profile';
      return { data: null, error: message };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile,
  };
}
