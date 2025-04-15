export const handleImageUpload = (
  file: File,
  onSuccess: (imageUrl: string, imagePreview: string) => void
) => {
  const imagePreview = URL.createObjectURL(file);
  const reader = new FileReader();
  
  reader.onloadend = () => {
    const imageUrl = reader.result as string;
    onSuccess(imageUrl, imagePreview);
  };
  
  reader.readAsDataURL(file);
};

export const cleanupImageUrl = (url: string) => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
