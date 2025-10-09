import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
type SiteSettingsUpdate = Database['public']['Tables']['site_settings']['Update'];

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: SiteSettingsUpdate) => {
    try {
      if (!settings) {
        throw new Error('No settings found to update');
      }

      const { data, error } = await supabase
        .from('site_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      await fetchSettings();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      return { data: null, error: message };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  };
}
