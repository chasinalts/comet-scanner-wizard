import { useState, useEffect, useMemo, useCallback } from 'react';
import { memoize } from '../utils/memoization';

interface ContentItem {
  id: string;
  type: 'banner' | 'scanner' | 'template' | 'question';
  title: string;
  content: string;
  imageUrl?: string;
  scale?: number;
  displayText?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ImageContent {
  id: string;
  src: string;
  alt: string;
  scale?: number;
  displayText?: string;
}

export interface AdminContentHook {
  getBannerImage: () => ImageContent | null;
  getScannerImages: () => ImageContent[];
  getTemplates: () => Array<{
    id: string;
    title: string;
    code: string;
  }>;
  getQuestions: () => Array<{
    id: string;
    title: string;
    text: string;
  }>;
  hasContent: boolean;
}

export const useAdminContent = (): AdminContentHook => {
  const [contents, setContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const loadContents = () => {
      const savedContents = localStorage.getItem('admin_contents');
      if (savedContents) {
        setContents(JSON.parse(savedContents));
      }
    };

    loadContents();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_contents') {
        loadContents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize the filter function for banner images
  const filterBanners = useMemo(() =>
    memoize((items: ContentItem[]) => items.filter(item => item.type === 'banner')),
    []
  );

  const getBannerImage = useCallback((): ImageContent | null => {
    const banners = filterBanners(contents);
    if (banners.length === 0) return null;

    const banner = banners[banners.length - 1];
    return {
      id: banner.id,
      src: banner.imageUrl || '',
      alt: banner.title,
      scale: banner.scale,
      displayText: banner.displayText
    };
  }, [contents, filterBanners]);

  // Memoize the filter and transform functions for scanner images
  const filterScanners = useMemo(() =>
    memoize((items: ContentItem[]) => items.filter(item => item.type === 'scanner')),
    []
  );

  const sortByUpdatedAt = useMemo(() =>
    memoize((items: ContentItem[]) => [...items].sort((a, b) => b.updatedAt - a.updatedAt)),
    []
  );

  const transformToImageContent = useMemo(() =>
    memoize((items: ContentItem[]): ImageContent[] =>
      items.map(item => ({
        id: item.id,
        src: item.imageUrl || '',
        alt: item.title,
        scale: item.scale,
        displayText: item.displayText
      }))
    ),
    []
  );

  const getScannerImages = useCallback((): ImageContent[] => {
    const filtered = filterScanners(contents);
    const sorted = sortByUpdatedAt(filtered);
    return transformToImageContent(sorted);
  }, [contents, filterScanners, sortByUpdatedAt, transformToImageContent]);

  // Memoize the filter and transform functions for templates
  const filterTemplates = useMemo(() =>
    memoize((items: ContentItem[]) => items.filter(item => item.type === 'template')),
    []
  );

  const transformToTemplates = useMemo(() =>
    memoize((items: ContentItem[]) =>
      items.map(item => ({
        id: item.id,
        title: item.title,
        code: item.content
      }))
    ),
    []
  );

  const getTemplates = useCallback(() => {
    const filtered = filterTemplates(contents);
    const sorted = sortByUpdatedAt(filtered);
    return transformToTemplates(sorted);
  }, [contents, filterTemplates, sortByUpdatedAt, transformToTemplates]);

  // Memoize the filter and transform functions for questions
  const filterQuestions = useMemo(() =>
    memoize((items: ContentItem[]) => items.filter(item => item.type === 'question')),
    []
  );

  const transformToQuestions = useMemo(() =>
    memoize((items: ContentItem[]) =>
      items.map(item => ({
        id: item.id,
        title: item.title,
        text: item.content
      }))
    ),
    []
  );

  const getQuestions = useCallback(() => {
    const filtered = filterQuestions(contents);
    const sorted = sortByUpdatedAt(filtered);
    return transformToQuestions(sorted);
  }, [contents, filterQuestions, sortByUpdatedAt, transformToQuestions]);

  // Memoize the final result to prevent unnecessary re-renders
  const result = useMemo(() => ({
    getBannerImage,
    getScannerImages,
    getTemplates,
    getQuestions,
    hasContent: contents.length > 0
  }), [getBannerImage, getScannerImages, getTemplates, getQuestions, contents.length]);

  return result;
};

export default useAdminContent;