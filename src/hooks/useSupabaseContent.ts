import { useState, useEffect } from 'react';
import { contentService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import type { ContentMetadata } from '../types';

export const useSupabaseContent = () => {
  const { currentUser } = useAuth();
  const [contents, setContents] = useState<ContentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load contents from Supabase on mount
  useEffect(() => {
    const loadContents = async () => {
      setIsLoading(true);
      try {
        const userId = currentUser?.username;
        const data = await contentService.getContents(userId);
        setContents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('[Supabase] Failed to load contents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContents();
  }, [currentUser]);

  // Save a single content item
  const saveContent = async (content: ContentMetadata): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = currentUser?.username;
      await contentService.saveContent(content, userId);
      
      // Update local state
      setContents(prev => {
        const index = prev.findIndex(item => item.id === content.id);
        if (index >= 0) {
          const newContents = [...prev];
          newContents[index] = content;
          return newContents;
        } else {
          return [...prev, content];
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a content item
  const deleteContent = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await contentService.deleteContent(id);
      
      // Update local state
      setContents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Save all contents
  const saveAllContents = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = currentUser?.username;
      await contentService.saveContents(contents, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contents,
    setContents,
    saveContent,
    deleteContent,
    saveAllContents,
    isLoading,
    error
  };
};
