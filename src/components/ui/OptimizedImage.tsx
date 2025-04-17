import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  priority?: boolean;
  onLoad?: () => void;
  blurhash?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  style = {},
  onClick,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23cccccc" /%3E%3C/svg%3E',
  loading = 'lazy',
  decoding = 'async',
  priority = false,
  onLoad,
  blurhash
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Check if image is already in browser cache
  useEffect(() => {
    if (priority || imageRef.current?.complete) {
      // If the image is already loaded (from cache)
      if (imageRef.current && imageRef.current.naturalWidth > 0) {
        setIsLoaded(true);
        setImageSrc(src);
        onLoad?.();
      }
    }
  }, [src, priority, onLoad]);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
    setImageSrc(placeholder);

    // Skip preloading for data URLs and blob URLs
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      setImageSrc(src);
      return;
    }

    // Create new image object to preload
    const img = new Image();

    // Add loading priority
    if (priority) {
      // fetchPriority is not standard in all browsers yet
      // @ts-ignore
      img.fetchPriority = 'high';
    }

    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setError(true);
      // Keep placeholder on error
    };

    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder, priority, onLoad]);

  // Generate srcSet for responsive images if width is provided
  const generateSrcSet = (): string | undefined => {
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      // For regular URLs, create responsive sizes
      // This is a simplified version - in production you'd use actual resized images
      return `${src} 1x, ${src} 2x`;
    }
    return undefined;
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder or blur hash */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
          style={{
            backgroundImage: blurhash ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.05)' // Slightly larger to prevent blur edges
          }}
        />
      )}

      {/* Actual image with animation */}
      <motion.img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${error ? 'hidden' : ''}`}
        style={{
          objectFit: 'contain',
          opacity: isLoaded ? 1 : 0
        }}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={decoding}
        sizes={sizes}
        srcSet={generateSrcSet()}
        onClick={onClick}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        // @ts-ignore - fetchPriority is not in all TypeScript DOM definitions yet
        fetchPriority={priority ? 'high' : 'auto'}
      />

      {/* Error fallback */}
      {error && (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
