import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const submitMessage = async (message: ContactMessageInsert) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit message';
      return { data: null, error: message };
    }
  };

  const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchMessages();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update message status';
      return { data: null, error: message };
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete message';
      return { error: message };
    }
  };

  const getNewMessages = () => messages.filter(m => m.status === 'new');
  const getReadMessages = () => messages.filter(m => m.status === 'read');
  const getArchivedMessages = () => messages.filter(m => m.status === 'archived');

  return {
    messages,
    loading,
    error,
    submitMessage,
    updateMessageStatus,
    deleteMessage,
    getNewMessages,
    getReadMessages,
    getArchivedMessages,
    refetch: fetchMessages,
  };
}
