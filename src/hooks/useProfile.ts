import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileUpdate {
  display_name?: string;
  avatar_url?: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async (): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) throw error;
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProfile,
    updateProfile,
    uploadAvatar,
    loading,
    error
  };
}