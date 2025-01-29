import { useState, useEffect } from 'react';
import { profileStorage } from '../lib/storage/profile';
import type { ProfileData } from '../lib/types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(() => profileStorage.get());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setProfile(profileStorage.get());
    };

    window.addEventListener('profile-updated', handleStorageUpdate);
    return () => window.removeEventListener('profile-updated', handleStorageUpdate);
  }, []);

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      setLoading(true);
      setError(null);
      profileStorage.update(data);
      setProfile(profileStorage.get());
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create object URL for the uploaded file
      const photoUrl = URL.createObjectURL(file);
      
      // Update profile with new photo URL
      await updateProfile({ photo: photoUrl });
      
      return { success: true, url: photoUrl };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload photo';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    updateProfile,
    uploadPhoto,
    loading,
    error,
  };
}