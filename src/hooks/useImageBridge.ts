import { useState, useEffect } from 'react';
import { useImageDB } from './useImageDB';
import type { ContentItem } from './useAdminContent';

// This hook bridges the gap between the admin dashboard's image storage
// and the main page's image display
export const useImageBridge = () => {
  const { getImage } = useImageDB();
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load content metadata from localStorage
  const loadContentMetadata = (): ContentItem[] => {
    try {
      const savedContents = localStorage.getItem('admin_contents');
      return savedContents ? JSON.parse(savedContents) : [];
    } catch (e) {
      console.error('Failed to load content metadata:', e);
      return [];
    }
  };

  // Load all images from IndexedDB
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const contents = loadContentMetadata();
        const imageIds = contents
          .filter(item => item.type === 'banner' || item.type === 'scanner')
          .map(item => item.imageId)
          .filter(Boolean);
        
        console.log('[ImageBridge] Loading images:', imageIds);
        
        const imagePromises = imageIds.map(async (imageId) => {
          if (!imageId) return null;
          
          try {
            const imageData = await getImage(imageId);
            if (imageData) {
              return { imageId, imageData };
            }
            console.warn(`[ImageBridge] Image not found: ${imageId}`);
            return null;
          } catch (err) {
            console.error(`[ImageBridge] Failed to load image ${imageId}:`, err);
            return null;
          }
        });
        
        const results = await Promise.all(imagePromises);
        const newCache: Record<string, string> = {};
        
        results.forEach(result => {
          if (result) {
            newCache[result.imageId] = result.imageData;
          }
        });
        
        setImageCache(newCache);
        console.log('[ImageBridge] Images loaded:', Object.keys(newCache).length);
      } catch (err) {
        console.error('[ImageBridge] Failed to load images:', err);
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [getImage]);
  
  // Get image data for a specific content item
  const getImageForContent = (content: ContentItem): string | null => {
    if (!content.imageId) {
      console.warn('[ImageBridge] Content has no imageId:', content.id);
      return null;
    }
    
    const imageData = imageCache[content.imageId];
    if (!imageData) {
      console.warn('[ImageBridge] Image not found in cache:', content.imageId);
      return null;
    }
    
    return imageData;
  };
  
  return {
    imageCache,
    loading,
    error,
    getImageForContent
  };
};

export default useImageBridge;
