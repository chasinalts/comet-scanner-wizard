import React, { useState, useEffect } from 'react';

interface ImageDisplayProps {
  src: string;
  alt: string;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  src, 
  alt, 
  scale = 1, 
  className = '', 
  style = {} 
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Handle different types of image sources
    if (!src) {
      setError('No image source provided');
      setIsLoading(false);
      return;
    }

    try {
      // If it's already a valid URL or data URL, use it directly
      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')) {
        setImageSrc(src);
        setIsLoading(false);
      } else {
        // If it's a base64 string without the data URL prefix, add it
        if (src.startsWith('/9j/') || src.startsWith('iVBOR')) {
          setImageSrc(`data:image/jpeg;base64,${src}`);
        } else {
          // Just use the source as is
          setImageSrc(src);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error setting image source:', err);
      setError('Failed to load image');
      setIsLoading(false);
    }
  }, [src]);

  // Apply the scale transformation
  const imageStyle = {
    ...style,
    transform: `scale(${scale})`,
    transformOrigin: 'center center'
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}>
        <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={imageStyle}
      onError={() => {
        console.error('Image failed to load:', src);
        setError('Failed to load image');
      }}
    />
  );
};

export default ImageDisplay;
