import { useState } from 'react';
import { imageService, storageService } from '../services/supabaseService';

export const useSupabaseImage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addImage = async (id: string, base64Data: string, contentType: string = 'scanner'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // For larger images (>1MB), use Supabase Storage
      if (base64Data.length > 1000000) {
        // Upload to Supabase Storage and get URL
        const imageUrl = await storageService.uploadImage(id, base64Data);
        
        // Store the URL reference in Supabase
        await imageService.addImage(id, imageUrl, contentType);
      } else {
        // For smaller images, store directly in Supabase
        await imageService.addImage(id, base64Data, contentType);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getImage = async (id: string): Promise<string | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await imageService.getImage(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the image data first to check if it's a URL
      const imageData = await imageService.getImage(id);
      
      // If it's a URL, delete from Storage as well
      if (imageData && imageData.startsWith('https://')) {
        await storageService.deleteImage(id);
      }
      
      // Delete from Supabase
      await imageService.deleteImage(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addImage,
    getImage,
    deleteImage,
    isLoading,
    error
  };
};
