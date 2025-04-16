export const handleImageUpload = (
  file: File,
  onSuccess: (imageUrl: string, imagePreview: string) => void
) => {
  // Create a blob URL for preview (this is more efficient for display)
  const imagePreview = URL.createObjectURL(file);

  // Use FileReader to get a data URL (this is more reliable for storage)
  const reader = new FileReader();

  reader.onloadend = () => {
    const imageUrl = reader.result as string;
    console.log('Image uploaded:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageUrlPrefix: imageUrl.substring(0, 30) + '...',
      imagePreview
    });
    onSuccess(imageUrl, imagePreview);
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
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = image.width;
      let height = image.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Create a canvas and draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);

      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not create blob from canvas'));
        }
      }, file.type);

      // Clean up the blob URL
      URL.revokeObjectURL(image.src);
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(image.src);
    };
  });
};
