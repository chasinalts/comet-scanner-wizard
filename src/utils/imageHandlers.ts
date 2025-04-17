import { debugImageUpload, debugImageProcessing, measurePerformance } from './debugUtils';
import { debugLogger } from '../components/dev/DebugConsole';

export const handleImageUpload = (
  file: File,
  onSuccess: (imageUrl: string, imagePreview: string) => void
) => {
  // Log the image upload for debugging
  debugImageUpload(file);

  // Create a blob URL for preview (this is more efficient for display)
  const imagePreview = URL.createObjectURL(file);

  // Use FileReader to get a data URL (this is more reliable for storage)
  const reader = new FileReader();

  reader.onloadend = () => {
    const imageUrl = reader.result as string;

    // Log the processed image for debugging
    debugImageProcessing(imageUrl, imagePreview);

    // For backward compatibility, still log to console
    console.log('Image uploaded:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageUrlPrefix: imageUrl.substring(0, 30) + '...',
      imagePreview
    });

    onSuccess(imageUrl, imagePreview);
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
  };

  reader.readAsDataURL(file);
};

export const cleanupImageUrl = (url: string) => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Resizes an image to the specified dimensions
 * @param file The image file to resize
 * @param maxWidth Maximum width of the resized image
 * @param maxHeight Maximum height of the resized image
 * @returns A promise that resolves to a Blob of the resized image
 */
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return measurePerformance('resizeImage', () => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const blobUrl = URL.createObjectURL(file);
      image.src = blobUrl;

      image.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = image.width;
        let height = image.height;
        const originalDimensions = { width, height };

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const newDimensions = { width, height };

        // Log resize operation
        debugLogger.image('Resizing image', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          originalDimensions,
          newDimensions,
          scaleFactor: {
            width: newDimensions.width / originalDimensions.width,
            height: newDimensions.height / originalDimensions.height
          }
        }, 'ImageResize');

        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const error = new Error('Could not get canvas context');
          debugLogger.error('Canvas context error', error, 'ImageResize');
          reject(error);
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);

        // Convert the canvas to a blob
        canvas.toBlob((blob) => {
          if (blob) {
            debugLogger.image('Image resized successfully', {
              originalSize: file.size,
              newSize: blob.size,
              compressionRatio: (blob.size / file.size * 100).toFixed(2) + '%'
            }, 'ImageResize');
            resolve(blob);
          } else {
            const error = new Error('Could not create blob from canvas');
            debugLogger.error('Blob creation error', error, 'ImageResize');
            reject(error);
          }
        }, file.type);

        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      };

      image.onerror = (error) => {
        const errorMsg = new Error('Failed to load image');
        debugLogger.error('Image loading error', { error, file: file.name }, 'ImageResize');
        reject(errorMsg);
        URL.revokeObjectURL(blobUrl);
      };
    });
  });
};
