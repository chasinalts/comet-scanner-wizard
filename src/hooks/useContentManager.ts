import { useState, useEffect, useCallback } from 'react';
import type { ContentItem } from './useAdminContent';
import { handleImageUpload, cleanupImageUrl } from '../utils/imageHandlers';

export interface ContentManagerHook {
  contents: ContentItem[];
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateContent: (id: string, updates: Partial<Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteContent: (id: string) => void;
  uploadImage: (file: File, type: 'banner' | 'scanner', title?: string) => Promise<string>;
  updateImageScale: (id: string, scale: number) => void;
  updateImageDisplayText: (id: string, displayText: string) => void;
}

export const useContentManager = (): ContentManagerHook => {
  const [contents, setContents] = useState<ContentItem[]>(() => {
    const savedContents = localStorage.getItem('admin_contents');
    return savedContents ? JSON.parse(savedContents) : [];
  });

  // Save contents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin_contents', JSON.stringify(contents));
    console.log('Contents saved to localStorage:', contents);
  }, [contents]);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      contents.forEach((content) => {
        if (content.imageUrl && content.imageUrl.startsWith('blob:')) {
          cleanupImageUrl(content.imageUrl);
        }
      });
    };
  }, []);

  const addContent = useCallback((content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `content-${Date.now()}`;
    const timestamp = Date.now();

    const newContent: ContentItem = {
      ...content,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setContents(prev => [...prev, newContent]);
    return id;
  }, []);

  const updateContent = useCallback((id: string, updates: Partial<Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setContents(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: Date.now() }
          : item
      )
    );
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContents(prev => {
      const contentToDelete = prev.find(item => item.id === id);

      // Cleanup image URL if it exists
      if (contentToDelete?.imageUrl && contentToDelete.imageUrl.startsWith('blob:')) {
        cleanupImageUrl(contentToDelete.imageUrl);
      }

      return prev.filter(item => item.id !== id);
    });
  }, []);

  const uploadImage = useCallback(async (file: File, type: 'banner' | 'scanner', title = 'Uploaded Image'): Promise<string> => {
    console.log(`Starting upload of ${type} image:`, { fileName: file.name, fileSize: file.size, fileType: file.type });
    return new Promise((resolve, reject) => {
      try {
        handleImageUpload(file, (imageUrl: string, _imagePreview: string) => {
          console.log(`Adding ${type} content to storage`);

          // Store the image data URL in localStorage
          const id = addContent({
            type,
            title,
            content: '',
            imageUrl, // This is a data URL, not a blob URL
            scale: 1,
            displayText: title // Initialize with the title
          });

          // Log success
          console.log(`${type} image added with ID:`, id);
          console.log(`Total ${type} images:`, contents.filter(item => item.type === type).length + 1);

          resolve(id);
        });
      } catch (error) {
        console.error(`Error uploading ${type} image:`, error);
        reject(error);
      }
    });
  }, [addContent, contents]);

  const updateImageScale = useCallback((id: string, scale: number) => {
    updateContent(id, { scale });
  }, [updateContent]);

  const updateImageDisplayText = useCallback((id: string, displayText: string) => {
    updateContent(id, { displayText });
  }, [updateContent]);

  return {
    contents,
    addContent,
    updateContent,
    deleteContent,
    uploadImage,
    updateImageScale,
    updateImageDisplayText
  };
};

export default useContentManager;
