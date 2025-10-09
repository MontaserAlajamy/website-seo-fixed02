import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type PhotoAlbum = Database['public']['Tables']['photo_albums']['Row'];
type PhotoAlbumInsert = Database['public']['Tables']['photo_albums']['Insert'];
type PhotoAlbumUpdate = Database['public']['Tables']['photo_albums']['Update'];
type Photo = Database['public']['Tables']['photos']['Row'];
type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
type PhotoUpdate = Database['public']['Tables']['photos']['Update'];

export function usePhotoAlbums() {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photo_albums')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setAlbums(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const addAlbum = async (album: PhotoAlbumInsert) => {
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .insert([album])
        .select()
        .single();

      if (error) throw error;
      await fetchAlbums();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add album';
      return { data: null, error: message };
    }
  };

  const updateAlbum = async (id: string, updates: PhotoAlbumUpdate) => {
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchAlbums();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update album';
      return { data: null, error: message };
    }
  };

  const deleteAlbum = async (id: string) => {
    try {
      const { error } = await supabase
        .from('photo_albums')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAlbums();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete album';
      return { error: message };
    }
  };

  return {
    albums,
    loading,
    error,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    refetch: fetchAlbums,
  };
}

export function usePhotos(albumId?: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      let query = supabase.from('photos').select('*');

      if (albumId) {
        query = query.eq('album_id', albumId);
      }

      const { data, error } = await query.order('order_index', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [albumId]);

  const addPhoto = async (photo: PhotoInsert) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .insert([photo])
        .select()
        .single();

      if (error) throw error;
      await fetchPhotos();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add photo';
      return { data: null, error: message };
    }
  };

  const updatePhoto = async (id: string, updates: PhotoUpdate) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPhotos();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update photo';
      return { data: null, error: message };
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPhotos();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete photo';
      return { error: message };
    }
  };

  return {
    photos,
    loading,
    error,
    addPhoto,
    updatePhoto,
    deletePhoto,
    refetch: fetchPhotos,
  };
}
