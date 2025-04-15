import React, { useState, useEffect } from 'react';

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
  decoding = 'async'
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setImageSrc(placeholder);

    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      // Keep placeholder on error
    };

    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

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
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{
        ...style,
        objectFit: 'contain',
      }}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      srcSet={generateSrcSet()}
      onClick={onClick}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default OptimizedImage;
