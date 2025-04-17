import { useState } from 'react';
import { imageService, storageService } from '../services/supabaseService';
import { debugLogger } from '../components/dev/DebugConsole';
import { debugImageStorage, debugSupabaseOperation, debugSupabaseError, measurePerformance } from '../utils/debugUtils';

export const useSupabaseImage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addImage = async (id: string, base64Data: string, contentType: string = 'scanner'): Promise<void> => {
    return measurePerformance('addImage', async () => {
      setIsLoading(true);
      setError(null);

      // Log the operation start
      debugSupabaseOperation('addImage', {
        id,
        contentType,
        dataLength: base64Data.length,
        dataSizeKB: (base64Data.length / 1024).toFixed(2),
        dataSizeMB: (base64Data.length / 1024 / 1024).toFixed(2)
      });

      // For backward compatibility
      console.log(`[Supabase] Starting image upload for ID: ${id}, Content Type: ${contentType}`);
      console.log(`[Supabase] Image data length: ${base64Data.length} characters`);

      try {
        // For larger images (>1MB), use Supabase Storage
        if (base64Data.length > 1000000) {
          debugLogger.image(`Image is large (${(base64Data.length / 1024 / 1024).toFixed(2)}MB), using Storage`, {
            id,
            contentType,
            size: base64Data.length
          }, 'SupabaseStorage');

          console.log(`[Supabase] Image is large (${(base64Data.length / 1024 / 1024).toFixed(2)}MB), using Storage`);

          try {
            // Upload to Supabase Storage and get URL
            const imageUrl = await storageService.uploadImage(id, base64Data);

            debugImageStorage(id, 'Supabase', true, {
              storageType: 'Storage',
              urlLength: imageUrl.length,
              urlPrefix: imageUrl.substring(0, 50) + '...'
            });

            console.log(`[Supabase] Successfully uploaded to Storage, URL: ${imageUrl.substring(0, 50)}...`);

            // Store the URL reference in Supabase
            await imageService.addImage(id, imageUrl, contentType);

            debugLogger.supabase('Stored URL reference in database', {
              id,
              contentType,
              isReference: true
            }, 'SupabaseDB');

            console.log(`[Supabase] Successfully stored URL reference in database`);
          } catch (storageErr) {
            debugSupabaseError('Storage upload', storageErr);
            console.error(`[Supabase] Storage upload failed:`, storageErr);

            // Fallback to direct database storage if storage fails
            debugLogger.warn('Falling back to direct database storage', {
              id,
              contentType,
              error: storageErr instanceof Error ? storageErr.message : 'Unknown error'
            }, 'SupabaseFallback');

            console.log(`[Supabase] Falling back to direct database storage`);
            await imageService.addImage(id, base64Data, contentType);

            debugImageStorage(id, 'Supabase', true, {
              storageType: 'Database',
              dataLength: base64Data.length,
              fallbackFromStorage: true
            });
          }
        } else {
          // For smaller images, store directly in Supabase
          debugLogger.image(`Image is small (${(base64Data.length / 1024).toFixed(2)}KB), storing directly in database`, {
            id,
            contentType,
            size: base64Data.length
          }, 'SupabaseDB');

          console.log(`[Supabase] Image is small (${(base64Data.length / 1024).toFixed(2)}KB), storing directly in database`);
          await imageService.addImage(id, base64Data, contentType);

          debugImageStorage(id, 'Supabase', true, {
            storageType: 'Database',
            dataLength: base64Data.length
          });

          console.log(`[Supabase] Successfully stored image in database`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        debugSupabaseError('Image upload', err);
        console.error(`[Supabase] Image upload failed:`, err);
        setError(errorMessage);

        // Try to store in IndexedDB as a fallback
        try {
          debugLogger.warn('Attempting to store in IndexedDB as fallback', {
            id,
            contentType,
            error: errorMessage
          }, 'IndexedDBFallback');

          console.log(`[Supabase] Attempting to store in IndexedDB as fallback`);
          const { addImage: addLocalImage } = await import('../hooks/useImageDB');
          await addLocalImage(id, base64Data);

          debugImageStorage(id, 'IndexedDB', true, {
            fallbackFromSupabase: true,
            dataLength: base64Data.length
          });

          console.log(`[Supabase] Successfully stored in IndexedDB as fallback`);
        } catch (localErr) {
          debugSupabaseError('IndexedDB fallback', localErr);
          console.error(`[Supabase] IndexedDB fallback failed:`, localErr);

          debugImageStorage(id, 'IndexedDB', false, {
            error: localErr instanceof Error ? localErr.message : 'Unknown error'
          });
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    });
  };

  const getImage = async (id: string): Promise<string | undefined> => {
    return measurePerformance('getImage', async () => {
      setIsLoading(true);
      setError(null);

      debugSupabaseOperation('getImage', { id });

      try {
        const data = await imageService.getImage(id);

        // Log the result
        if (data) {
          const isUrl = data.startsWith('http');
          debugLogger.image('Image retrieved successfully', {
            id,
            type: isUrl ? 'URL reference' : 'Base64 data',
            dataLength: data.length,
            preview: isUrl ? data : data.substring(0, 30) + '...'
          }, 'SupabaseGet');
        } else {
          debugLogger.warn('Image not found', { id }, 'SupabaseGet');
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        debugSupabaseError('getImage', err);
        setError(errorMessage);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    });
  };

  const deleteImage = async (id: string): Promise<void> => {
    return measurePerformance('deleteImage', async () => {
      setIsLoading(true);
      setError(null);

      debugSupabaseOperation('deleteImage', { id });

      try {
        // Get the image data first to check if it's a URL
        const imageData = await imageService.getImage(id);

        // If it's a URL, delete from Storage as well
        if (imageData && imageData.startsWith('https://')) {
          debugLogger.image('Deleting image from Storage', { id, url: imageData }, 'SupabaseDelete');
          await storageService.deleteImage(id);
          debugLogger.image('Image deleted from Storage', { id }, 'SupabaseDelete');
        }

        // Delete from Supabase
        debugLogger.image('Deleting image from Database', { id }, 'SupabaseDelete');
        await imageService.deleteImage(id);
        debugLogger.image('Image deleted from Database', { id }, 'SupabaseDelete');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        debugSupabaseError('deleteImage', err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    });
  };

  return {
    addImage,
    getImage,
    deleteImage,
    isLoading,
    error
  };
};
