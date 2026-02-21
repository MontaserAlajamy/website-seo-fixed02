import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Manual types since generated types resolve to 'never' for these tables
interface PhotoAlbum {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Photo {
  id: string;
  album_id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  order_index: number;
  created_at: string;
}

const db = supabase as any;

export function usePhotoAlbums() {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await db
        .from('photo_albums')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      // For albums without a cover, fetch the first photo as fallback
      const enriched = await Promise.all(
        (data || []).map(async (album: PhotoAlbum) => {
          if (!album.cover_image_url) {
            const { data: firstPhoto } = await db
              .from('photos')
              .select('image_url')
              .eq('album_id', album.id)
              .order('order_index', { ascending: true })
              .limit(1)
              .single();
            if (firstPhoto) {
              return { ...album, cover_image_url: firstPhoto.image_url };
            }
          }
          return album;
        })
      );

      setAlbums(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const addAlbum = async (album: Partial<PhotoAlbum>) => {
    try {
      const { data, error } = await db
        .from('photo_albums')
        .insert([album])
        .select()
        .single();

      if (error) throw error;
      await fetchAlbums();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add album' };
    }
  };

  const updateAlbum = async (id: string, updates: Partial<PhotoAlbum>) => {
    try {
      const { data, error } = await db
        .from('photo_albums')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchAlbums();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update album' };
    }
  };

  const deleteAlbum = async (id: string) => {
    try {
      // First delete all photos in the album
      const { data: photos } = await db
        .from('photos')
        .select('id, image_url')
        .eq('album_id', id);

      if (photos && photos.length > 0) {
        // Delete storage files
        const storagePaths = (photos as Photo[])
          .map(p => {
            const match = p.image_url.match(/portfolio-images\/(.+)/);
            return match ? match[1] : null;
          })
          .filter(Boolean) as string[];

        if (storagePaths.length > 0) {
          await supabase.storage.from('portfolio-images').remove(storagePaths);
        }

        // Delete photo records
        await db.from('photos').delete().eq('album_id', id);
      }

      // Then delete the album
      const { error } = await db.from('photo_albums').delete().eq('id', id);
      if (error) throw error;
      await fetchAlbums();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete album' };
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

export interface UploadProgress {
  file: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

export function usePhotos(albumId?: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const fetchPhotos = async () => {
    if (!isSupabaseConfigured || !albumId) { setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await db
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPhotos((data as Photo[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [albumId]);

  const addPhoto = async (photo: Partial<Photo> & { album_id: string; image_url: string }) => {
    try {
      const { data, error } = await db
        .from('photos')
        .insert([photo])
        .select()
        .single();

      if (error) throw error;
      await fetchPhotos();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add photo' };
    }
  };

  // Upload multiple files to Supabase Storage and create photo records
  const uploadPhotos = async (files: File[], targetAlbumId: string) => {
    const progress: UploadProgress[] = files.map(f => ({
      file: f.name,
      progress: 0,
      status: 'pending' as const,
    }));
    setUploadProgress([...progress]);

    const currentCount = photos.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueName = `${targetAlbumId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      progress[i].status = 'uploading';
      progress[i].progress = 10;
      setUploadProgress([...progress]);

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(uniqueName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        progress[i].progress = 70;
        setUploadProgress([...progress]);

        const { data: urlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;
        progress[i].url = imageUrl;

        const { error: dbError } = await db
          .from('photos')
          .insert([{
            album_id: targetAlbumId,
            title: file.name.replace(/\.[^/.]+$/, ''),
            image_url: imageUrl,
            thumbnail_url: imageUrl,
            order_index: currentCount + i,
          }]);

        if (dbError) throw dbError;

        progress[i].progress = 100;
        progress[i].status = 'done';
        setUploadProgress([...progress]);

      } catch (err) {
        progress[i].status = 'error';
        progress[i].error = err instanceof Error ? err.message : 'Upload failed';
        setUploadProgress([...progress]);
      }
    }

    await fetchPhotos();

    // Auto-set album cover if it doesn't have one
    try {
      const { data: album } = await db
        .from('photo_albums')
        .select('cover_image_url')
        .eq('id', targetAlbumId)
        .single();

      if (album && !album.cover_image_url) {
        const firstDoneUrl = progress.find(p => p.status === 'done' && p.url)?.url;
        if (firstDoneUrl) {
          await db
            .from('photo_albums')
            .update({ cover_image_url: firstDoneUrl })
            .eq('id', targetAlbumId);
        }
      }
    } catch { /* non-critical */ }

    setTimeout(() => setUploadProgress([]), 3000);
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    try {
      const { data, error } = await db
        .from('photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPhotos();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update photo' };
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const photo = photos.find(p => p.id === id);
      if (photo) {
        const match = photo.image_url.match(/portfolio-images\/(.+)/);
        if (match) {
          await supabase.storage.from('portfolio-images').remove([match[1]]);
        }
      }

      const { error } = await db.from('photos').delete().eq('id', id);
      if (error) throw error;
      await fetchPhotos();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete photo' };
    }
  };

  const reorderPhotos = async (reorderedPhotos: { id: string; order_index: number }[]) => {
    try {
      for (const { id, order_index } of reorderedPhotos) {
        await db
          .from('photos')
          .update({ order_index })
          .eq('id', id);
      }
      await fetchPhotos();
    } catch (err) {
      console.error('Reorder failed:', err);
    }
  };

  return {
    photos,
    loading,
    error,
    uploadProgress,
    addPhoto,
    uploadPhotos,
    updatePhoto,
    deletePhoto,
    reorderPhotos,
    refetch: fetchPhotos,
  };
}
